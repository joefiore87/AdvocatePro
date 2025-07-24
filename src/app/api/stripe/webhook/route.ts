import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getFirestoreAdmin } from '@/lib/firebase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

interface SubscriptionData {
  customerId: string;
  email: string;
  subscriptionId: string;
  status: string;
  currentPeriodEnd: Date;
  priceId: string;
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
    if (!firestore) {
      console.error('Firestore not initialized');
      return NextResponse.json(
        { error: 'Service unavailable' },
        { status: 503 }
      );
    }
    
    // Handle the event
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customer = await stripe.customers.retrieve(subscription.customer as string);
        
        if (!('email' in customer)) {
          throw new Error('Customer email not found');
        }
        
        const subscriptionData: SubscriptionData = {
          customerId: subscription.customer as string,
          email: customer.email!,
          subscriptionId: subscription.id,
          status: subscription.status,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          priceId: subscription.items.data[0]?.price.id || '',
        };
        
        await firestore
          .collection('subscriptions')
          .doc(customer.email!)
          .set(subscriptionData);
        
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customer = await stripe.customers.retrieve(subscription.customer as string);
        
        if ('email' in customer && customer.email) {
          await firestore
            .collection('subscriptions')
            .doc(customer.email)
            .update({ status: 'canceled' });
        }
        
        break;
      }
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 400 }
    );
  }
}
