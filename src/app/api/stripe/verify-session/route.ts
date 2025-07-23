import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { verifyAuthToken } from '@/lib/auth-middleware';
import { rateLimiters } from '@/lib/rate-limit';

export async function GET(req: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = await rateLimiters.api(req);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  // Get session ID from query params
  const url = new URL(req.url);
  const sessionId = url.searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json(
      { success: false, error: 'Session ID is required' },
      { status: 400 }
    );
  }

  try {
    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    // Check if the session is valid
    const isValid = session.payment_status === 'paid';
    
    return NextResponse.json({
      success: isValid,
      status: session.payment_status,
      customer: session.customer,
      customerId: session.customer,
      customerEmail: session.customer_details?.email
    });
  } catch (error: any) {
    console.error('Error verifying Stripe session:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to verify session'
      },
      { status: 500 }
    );
  }
}