import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { rateLimiters } from '@/lib/rate-limit';

export async function GET(req: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await rateLimiters.api(req);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ hasAccess: false, error: 'Email required' }, { status: 400 });
    }

    // Check Stripe for successful payments (since we're using one-time payments, not subscriptions)
    const payments = await stripe.paymentIntents.list({
      limit: 10,
    });

    // Find payments from this customer's email
    let hasAccess = false;
    let latestPayment = null;

    // Check checkout sessions for this email
    const sessions = await stripe.checkout.sessions.list({
      limit: 20,
    });

    for (const session of sessions.data) {
      if (session.customer_details?.email === email && session.payment_status === 'paid') {
        hasAccess = true;
        latestPayment = session;
        break;
      }
    }

    return NextResponse.json({ 
      hasAccess,
      payment: latestPayment,
      reason: hasAccess ? 'Payment found' : 'No completed payment found'
    });

  } catch (error: any) {
    console.error('Error checking payment access:', error);
    return NextResponse.json({ hasAccess: false, error: 'Internal error' }, { status: 500 });
  }
}
