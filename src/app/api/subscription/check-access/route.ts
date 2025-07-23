import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/auth-middleware';
import { checkUserAccess } from '@/lib/server/subscription-service';
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
      return NextResponse.json({ hasAccess: false }, { status: 401 });
    }
    
    // Check user access
    const hasAccess = await checkUserAccess(user.email);
    
    return NextResponse.json({ hasAccess });
  } catch (error) {
    console.error('Error checking access:', error);
    
    return NextResponse.json(
      { error: 'Failed to check access' },
      { status: 500 }
    );
  }
}