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
  firebaseUid: string;
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
  firebaseUid: string;
}

async function findUserByEmail(email: string) {
  try {
    const auth = await getAuthAdmin();
    if (!auth) throw new Error('Firebase Admin not available');
    
    return await auth.getUserByEmail(email);
  } catch (error) {
    console.error(`Failed to find user by email ${email}:`, error);
    return null;
  }
}

async function grantUserAccess(email: string, expirationDate: Date) {
  try {
    const auth = await getAuthAdmin();
    const firestore = await getFirestoreAdmin();
    
    if (!auth || !firestore) {
      throw new Error('Firebase services not available');
    }

    // Get or create Firebase user
    let user;
    try {
      user = await auth.getUserByEmail(email);
    } catch (error) {
      console.log(`User not found, creating: ${email}`);
      user = await auth.createUser({
        email,
        emailVerified: true
      });
    }

    // Set custom claims for immediate access
    await auth.setCustomUserClaims(user.uid, {
      hasAccess: true,
      role: 'user',
      subscriptionStatus: 'active',
      expiresAt: expirationDate.getTime(),
      updatedAt: Date.now()
    });

    // Update user document using UID as document ID
    await firestore.collection('users').doc(user.uid).set({
      uid: user.uid,
      email,
      subscriptionStatus: 'active',
      hasAccess: true,
      expiresAt: expirationDate,
      updatedAt: new Date(),
      createdAt: new Date()
    }, { merge: true });

    console.log(`✅ Access granted successfully for: ${email} (UID: ${user.uid})`);
    return user.uid;
  } catch (error) {
    console.error(`❌ Failed to grant access for ${email}:`, error);
    return null;
  }
}

async function revokeUserAccess(email: string, reason: string) {
  try {
    const auth = await getAuthAdmin();
    const firestore = await getFirestoreAdmin();
    
    if (!auth || !firestore) {
      throw new Error('Firebase services not available');
    }

    const user = await auth.getUserByEmail(email);
    
    // Remove custom claims
    await auth.setCustomUserClaims(user.uid, {
      hasAccess: false,
      role: 'user',
      subscriptionStatus: reason,
      updatedAt: Date.now()
    });

    // Update user document using UID
    await firestore.collection('users').doc(user.uid).update({
      subscriptionStatus: reason,
      hasAccess: false,
      updatedAt: new Date()
    });

    console.log(`❌ Access revoked for ${email} (UID: ${user.uid}): ${reason}`);
    return user.uid;
  } catch (error) {
    console.error(`Failed to revoke access for ${email}:`, error);
    return null;
  }
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

    // Check for webhook idempotency to prevent duplicate processing
    const eventId = event.id;
    const eventRef = firestore.collection('webhook_events').doc(eventId);
    const eventDoc = await eventRef.get();
    
    if (eventDoc.exists) {
      console.log(`⏭️ Webhook event ${eventId} already processed, skipping`);
      return NextResponse.json({ received: true, status: 'already_processed' });
    }
    
    // Mark event as being processed
    await eventRef.set({
      eventId,
      eventType: event.type,
      processedAt: new Date(),
      status: 'processing'
    });
    
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (session.payment_status === 'paid') {
          const customerEmail = session.customer_details?.email || session.metadata?.userEmail;
          
          if (!customerEmail) {
            console.error('No customer email found in session');
            break;
          }
          
          // Calculate expiration date (1 year from purchase)
          const purchaseDate = new Date(session.created * 1000);
          const expirationDate = new Date(purchaseDate);
          expirationDate.setFullYear(expirationDate.getFullYear() + 1);
          
          // Grant user access and get UID
          const userUid = await grantUserAccess(customerEmail, expirationDate);
          
          if (!userUid) {
            console.error(`Failed to grant access for ${customerEmail}`);
            break;
          }
          
          const paymentData: PaymentData = {
            customerId: session.customer?.toString() || session.client_reference_id || 'unknown',
            email: customerEmail,
            sessionId: session.id,
            paymentStatus: session.payment_status,
            purchaseDate: purchaseDate,
            expirationDate: expirationDate,
            amountPaid: session.amount_total || 0,
            firebaseUid: userUid
          };
          
          // Store payment record using UID as document ID
          await firestore.collection('payments').doc(userUid).set(paymentData);
          
          // Create/Update subscription record using UID
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
            updatedAt: new Date(),
            firebaseUid: userUid
          };
          
          await firestore.collection('subscriptions').doc(userUid).set(subscriptionData);
          
          console.log(`🎉 Payment processed successfully for ${customerEmail} (UID: ${userUid})`);
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
        const periodEnd = new Date(subscription.current_period_end * 1000);
        
        // Find user by email to get UID
        const user = await findUserByEmail(customerEmail);
        if (!user) {
          console.error(`User not found for email: ${customerEmail}`);
          break;
        }
        
        // Update subscription record using UID
        const subscriptionData: SubscriptionData = {
          customerId: subscription.customer as string,
          email: customerEmail,
          subscriptionId: subscription.id,
          status: subscription.status,
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: periodEnd,
          priceId: subscription.items.data[0]?.price.id || '',
          planType: subscription.items.data[0]?.price.recurring?.interval || 'unknown',
          createdAt: new Date(subscription.created * 1000),
          updatedAt: new Date(),
          firebaseUid: user.uid
        };
        
        await firestore.collection('subscriptions').doc(user.uid).set(subscriptionData);
        
        if (isActive) {
          await grantUserAccess(customerEmail, periodEnd);
        } else {
          await revokeUserAccess(customerEmail, subscription.status);
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
        
        // Find user by email to get UID
        const user = await findUserByEmail(customerEmail);
        if (!user) {
          console.error(`User not found for email: ${customerEmail}`);
          break;
        }
        
        // Update subscription status using UID
        await firestore.collection('subscriptions').doc(user.uid).update({
          status: 'cancelled',
          updatedAt: new Date()
        });
        
        // Revoke access
        await revokeUserAccess(customerEmail, 'cancelled');
        
        break;
      }
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    // Mark event as completed
    await eventRef.update({
      status: 'completed',
      completedAt: new Date()
    });
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    
    // Mark event as failed if we have the event ID
    if (event?.id && firestore) {
      try {
        await firestore.collection('webhook_events').doc(event.id).update({
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
          failedAt: new Date()
        });
      } catch (updateError) {
        console.error('Failed to update webhook event status:', updateError);
      }
    }
    
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 400 });
  }
}
