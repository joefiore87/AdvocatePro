import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { userId, email } = await req.json();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!userId || !email) {
      return NextResponse.json({ error: { message: 'Missing userId or email' } }, { status: 400 });
    }
    
    if (!appUrl) {
      throw new Error('NEXT_PUBLIC_APP_URL is not set in environment variables');
    }
    
    if (!process.env.STRIPE_PRICE_ID) {
      throw new Error('STRIPE_PRICE_ID is not set in environment variables');
    }

    const priceId = process.env.STRIPE_PRICE_ID;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment', // Changed from 'subscription' to 'payment' for one-time purchase
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/purchase`,
      customer_email: email,
      client_reference_id: userId,
      metadata: {
        firebaseUid: userId,
        userEmail: email
      },
      allow_promotion_codes: true,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (err: any) {
    console.error('Error creating Stripe session:', err);
    return NextResponse.json({ error: { message: err.message || 'An internal server error occurred.' } }, { status: 500 });
  }
}
