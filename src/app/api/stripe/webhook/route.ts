import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { createOrUpdateSubscription } from '@/lib/server/subscription-service';

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
      
      if (!customer.email) {
        throw new Error('Customer email not found');
      }
      
      // Calculate expiration date (1 year from now)
      const purchaseDate = new Date();
      const expirationDate = new Date(purchaseDate);
      expirationDate.setFullYear(expirationDate.getFullYear() + 1);
      
      // Store in Firestore
      await createOrUpdateSubscription({
        customerId: customer.id,
        email: customer.email,
        purchaseDate: purchaseDate.toISOString(),
        expirationDate: expirationDate.toISOString(),
        active: true
      });
      
      console.log(`Subscription created for ${customer.email}, expires on ${expirationDate.toDateString()}`);
    } catch (error) {
      console.error('Error processing subscription:', error);
      return new NextResponse(`Error processing subscription: ${error}`, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}