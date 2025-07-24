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
      return NextResponse.json({ subscription: null, error: 'Email required' }, { status: 400 });
    }

    // Check checkout sessions for successful payments (one-time purchase model)
    const sessions = await stripe.checkout.sessions.list({
      limit: 20,
    });

    let paymentSession = null;
    for (const session of sessions.data) {
      if (session.customer_details?.email === email && session.payment_status === 'paid') {
        paymentSession = session;
        break;
      }
    }

    if (!paymentSession) {
      return NextResponse.json({ subscription: null });
    }

    // Create a subscription-like object for one-time payments
    // For a $29.99/year access, we'll set expiration to 1 year from purchase
    const purchaseDate = new Date(paymentSession.created * 1000);
    const expirationDate = new Date(purchaseDate);
    expirationDate.setFullYear(expirationDate.getFullYear() + 1); // Add 1 year

    const subscriptionData = {
      customerId: paymentSession.customer?.toString() || paymentSession.client_reference_id || 'unknown',
      email: email,
      purchaseDate: purchaseDate.toISOString(),
      expirationDate: expirationDate.toISOString(),
      active: new Date() < expirationDate,
      sessionId: paymentSession.id,
      amountPaid: paymentSession.amount_total
    };

    return NextResponse.json({ subscription: subscriptionData });

  } catch (error: any) {
    console.error('Error getting payment info:', error);
    return NextResponse.json({ subscription: null, error: 'Internal error' }, { status: 500 });
  }
}
