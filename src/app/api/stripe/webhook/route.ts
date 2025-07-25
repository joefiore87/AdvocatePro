import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getFirestoreAdmin, getAuthAdmin } from '@/lib/firebase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

interface PaymentData {
  customerId: string;
  email: string;
  sessionId: string;
  paymentStatus: string;
  purchaseDate: Date;
  expirationDate: Date;
  amountPaid: number;
  firebaseUid?: string;
}

interface SubscriptionData {
  customerId: string;
  email: string;
  subscriptionId: string;
  status: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  priceId: string;
  planType: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') as string;
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    
    const firestore = await getFirestoreAdmin();
    const auth = await getAuthAdmin();
    
    if (!firestore || !auth) {
      console.error('Firebase services not initialized');
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
    }
    
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (session.payment_status === 'paid') {
          const customerEmail = session.customer_details?.email;
          
          if (!customerEmail) {
            console.error('No customer email found in session');
            break;
          }
          
          // Calculate expiration date (1 year from purchase)
          const purchaseDate = new Date(session.created * 1000);
          const expirationDate = new Date(purchaseDate);
          expirationDate.setFullYear(expirationDate.getFullYear() + 1);
          
          const paymentData: PaymentData = {
            customerId: session.customer?.toString() || session.client_reference_id || 'unknown',
            email: customerEmail,
            sessionId: session.id,
            paymentStatus: session.payment_status,
            purchaseDate: purchaseDate,
            expirationDate: expirationDate,
            amountPaid: session.amount_total || 0,
            firebaseUid: session.metadata?.firebaseUid || session.client_reference_id || undefined
          };
          
          // Store payment record in Firestore
          await firestore.collection('payments').doc(customerEmail).set(paymentData);
          
          // Create/Update subscription record
          const subscriptionData: SubscriptionData = {
            customerId: paymentData.customerId,
            email: customerEmail,
            subscriptionId: session.subscription?.toString() || session.id,
            status: 'active',
            currentPeriodStart: purchaseDate,
            currentPeriodEnd: expirationDate,
            priceId: session.metadata?.priceId || '',
            planType: 'annual',
            createdAt: purchaseDate,
            updatedAt: new Date()
          };
          
          await firestore.collection('subscriptions').doc(customerEmail).set(subscriptionData);
          
          // Update user profile
          await firestore.collection('users').doc(customerEmail).update({
            subscriptionStatus: 'active',
            updatedAt: new Date()
          });
          
          // Set Firebase custom claims for instant access
          try {
            const user = await auth.getUserByEmail(customerEmail);
            await auth.setCustomUserClaims(user.uid, {
              hasAccess: true,
              role: 'user',
              subscriptionStatus: 'active',
              expiresAt: expirationDate.getTime()
            });
            
            console.log(`✅ Custom claims set for ${customerEmail} - Access granted`);
          } catch (error) {
            console.error(`Error setting custom claims for ${customerEmail}:`, error);
          }
          
          console.log(`Payment processed and access granted for ${customerEmail}`);
        }
        
        break;
      }
      
      case 'customer.subscription.updated':
      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Get customer details
        const customer = await stripe.customers.retrieve(subscription.customer as string);
        if (customer.deleted || !('email' in customer) || !customer.email) {
          console.error('Customer email not found');
          break;
        }
        
        const customerEmail = customer.email;
        const isActive = subscription.status === 'active';
        
        // Update subscription record
        const subscriptionData: SubscriptionData = {
          customerId: subscription.customer as string,
          email: customerEmail,
          subscriptionId: subscription.id,
          status: subscription.status,
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          priceId: subscription.items.data[0]?.price.id || '',
          planType: subscription.items.data[0]?.price.recurring?.interval || 'unknown',
          createdAt: new Date(subscription.created * 1000),
          updatedAt: new Date()
        };
        
        await firestore.collection('subscriptions').doc(customerEmail).set(subscriptionData);
        
        // Update user profile
        await firestore.collection('users').doc(customerEmail).update({
          subscriptionStatus: subscription.status,
          updatedAt: new Date()
        });
        
        // Update Firebase custom claims
        try {
          const user = await auth.getUserByEmail(customerEmail);
          await auth.setCustomUserClaims(user.uid, {
            hasAccess: isActive,
            role: 'user',
            subscriptionStatus: subscription.status,
            expiresAt: subscriptionData.currentPeriodEnd.getTime()
          });
          
          console.log(`✅ Subscription ${subscription.status} - Claims updated for ${customerEmail}`);
        } catch (error) {
          console.error(`Error updating custom claims for ${customerEmail}:`, error);
        }
        
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Get customer details
        const customer = await stripe.customers.retrieve(subscription.customer as string);
        if (customer.deleted || !('email' in customer) || !customer.email) {
          console.error('Customer email not found');
          break;
        }
        
        const customerEmail = customer.email;
        
        // Update subscription status
        await firestore.collection('subscriptions').doc(customerEmail).update({
          status: 'cancelled',
          updatedAt: new Date()
        });
        
        // Update user profile
        await firestore.collection('users').doc(customerEmail).update({
          subscriptionStatus: 'cancelled',
          updatedAt: new Date()
        });
        
        // Remove access via custom claims
        try {
          const user = await auth.getUserByEmail(customerEmail);
          await auth.setCustomUserClaims(user.uid, {
            hasAccess: false,
            role: 'user',
            subscriptionStatus: 'cancelled'
          });
          
          console.log(`❌ Subscription cancelled - Access removed for ${customerEmail}`);
        } catch (error) {
          console.error(`Error removing custom claims for ${customerEmail}:`, error);
        }
        
        break;
      }
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 400 });
  }
}
