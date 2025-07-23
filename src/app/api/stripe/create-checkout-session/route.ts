import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { verifyAuthToken } from '@/lib/auth-middleware';
import { rateLimiters } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = await rateLimiters.api(req);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  // Verify authentication
  const user = await verifyAuthToken(req);
  if (!user || !user.email) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }
  
  try {
    const { priceId } = await req.json();

    if (!priceId) {
      return NextResponse.json({ error: 'Price ID is required' }, { status: 400 });
    }

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      customer_email: user.email,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/purchase`,
      metadata: {
        userId: user.uid,
        userEmail: user.email
      }
    });
    
    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}