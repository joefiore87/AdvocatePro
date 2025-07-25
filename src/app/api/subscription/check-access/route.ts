import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { rateLimiters } from '@/lib/rate-limit';
import { getAuthAdmin } from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await rateLimiters.api(req);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    // Get Firebase token from Authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ hasAccess: false, error: 'Authentication required' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    
    // Verify Firebase token and get user email
    let email: string;
    try {
      const adminAuth = await getAuthAdmin();
      if (!adminAuth) {
        return NextResponse.json({ hasAccess: false, error: 'Firebase Admin not configured' }, { status: 500 });
      }
      
      const decodedToken = await adminAuth.verifyIdToken(token);
      email = decodedToken.email || '';
      
      if (!email) {
        return NextResponse.json({ hasAccess: false, error: 'Email not found in token' }, { status: 400 });
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.json({ hasAccess: false, error: 'Invalid authentication token' }, { status: 401 });
    }

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
