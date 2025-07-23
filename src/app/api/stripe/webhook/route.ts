import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getAdminFirestore } from '@/lib/firebase-admin-config';

interface SubscriptionData {
  customerId: string;
  email: string;
  purchaseDate: string;
  expirationDate: string;
  active: boolean;
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature') as string;
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error(`Webhook Error: ${error.message}`);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  // Handle successful checkout completion
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    try {
      // Get customer details
      const customer = await stripe.customers.retrieve(session.customer as string);
      
      if (!customer || customer.deleted || !customer.email) {
        throw new Error('Customer email not found');
      }
      
      // Calculate expiration date (1 year from now)
      const purchaseDate = new Date();
      const expirationDate = new Date(purchaseDate);
      expirationDate.setFullYear(expirationDate.getFullYear() + 1);
      
      // Get Firestore instance
      const db = getAdminFirestore();
      if (!db) {
        console.error('Firebase Admin not initialized - subscription not saved');
        // Still return 200 to acknowledge receipt
        return new NextResponse('Webhook received but Firebase Admin not configured', { status: 200 });
      }
      
      // Store in Firestore
      const subscriptionData: SubscriptionData = {
        customerId: customer.id,
        email: customer.email,
        purchaseDate: purchaseDate.toISOString(),
        expirationDate: expirationDate.toISOString(),
        active: true
      };
      
      await db.collection('subscriptions').doc(customer.email).set(subscriptionData);
      
      console.log(`Subscription created for ${customer.email}, expires on ${expirationDate.toDateString()}`);
    } catch (error) {
      console.error('Error processing webhook:', error);
      // Return 200 to prevent Stripe from retrying
      return new NextResponse('Webhook error', { status: 200 });
    }
  }

  return new NextResponse('Webhook processed', { status: 200 });
}
