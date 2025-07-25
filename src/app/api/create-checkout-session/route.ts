import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';
import { requireValidEnv } from '@/lib/env-validation';

export async function POST(req: Request) {
  try {
    const { userId, email } = await req.json();
    
    // Validate environment variables
    const env = requireValidEnv();

    if (!userId || !email) {
      return NextResponse.json({ error: { message: 'Missing userId or email' } }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'payment', // One-time purchase
      success_url: `${env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.NEXT_PUBLIC_APP_URL}/purchase`,
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
