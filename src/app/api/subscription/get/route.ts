import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ subscription: null, error: 'Email required' }, { status: 400 });
    }

    // Get customer from Stripe
    const customers = await stripe.customers.list({
      email: email,
      limit: 1
    });

    if (customers.data.length === 0) {
      return NextResponse.json({ subscription: null });
    }

    const customer = customers.data[0];
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      limit: 1
    });

    const subscription = subscriptions.data.length > 0 ? subscriptions.data[0] : null;

    return NextResponse.json({ subscription });

  } catch (error: any) {
    console.error('Error getting subscription:', error);
    return NextResponse.json({ subscription: null, error: 'Internal error' }, { status: 500 });
  }
}
