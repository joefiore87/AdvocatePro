import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ hasAccess: false, error: 'Email required' }, { status: 400 });
    }

    // Check Stripe for active subscriptions
    const customers = await stripe.customers.list({
      email: email,
      limit: 1
    });

    if (customers.data.length === 0) {
      return NextResponse.json({ hasAccess: false, reason: 'No customer found' });
    }

    const customer = customers.data[0];
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active',
      limit: 1
    });

    const hasAccess = subscriptions.data.length > 0;

    return NextResponse.json({ 
      hasAccess,
      subscription: hasAccess ? subscriptions.data[0] : null 
    });

  } catch (error: any) {
    console.error('Error checking subscription access:', error);
    return NextResponse.json({ hasAccess: false, error: 'Internal error' }, { status: 500 });
  }
}
