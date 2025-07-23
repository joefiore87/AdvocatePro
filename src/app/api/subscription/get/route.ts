import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/auth-middleware';
import { getUserSubscription } from '@/lib/server/subscription-service';
import { rateLimiters } from '@/lib/rate-limit';

export async function GET(req: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = await rateLimiters.api(req);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    // Verify authentication
    const user = await verifyAuthToken(req);
    if (!user || !user.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    // Get user subscription
    const subscription = await getUserSubscription(user.email);
    
    if (!subscription) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    }
    
    return NextResponse.json({ subscription });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch subscription' },
      { status: 500 }
    );
  }
}