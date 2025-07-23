import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/auth-middleware';
import { isAdmin } from '@/lib/server/roles-service';
import { rateLimiters } from '@/lib/rate-limit';

export async function GET(req: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = await rateLimiters.auth(req);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    // Verify authentication
    const user = await verifyAuthToken(req);
    if (!user || !user.email) {
      return NextResponse.json({ isAdmin: false }, { status: 401 });
    }
    
    // Check if user is admin
    const userIsAdmin = await isAdmin(user.email);
    
    return NextResponse.json({ isAdmin: userIsAdmin });
  } catch (error) {
    console.error('Error verifying admin status:', error);
    
    return NextResponse.json(
      { error: 'Failed to verify admin status' },
      { status: 500 }
    );
  }
}