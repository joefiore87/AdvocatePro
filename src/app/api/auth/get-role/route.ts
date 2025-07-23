import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/auth-middleware';
import { getUserRole } from '@/lib/server/roles-service';
import { rateLimiters } from '@/lib/rate-limit';
import { getAuthAdmin } from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
  // Ensure Firebase Admin is initialized
  const authAdmin = await getAuthAdmin();
  if (!authAdmin) {
    return NextResponse.json({ error: 'Firebase Admin initialization failed' }, { status: 500 });
  }

  // Apply rate limiting
  const rateLimitResponse = await rateLimiters.auth(req);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    // Verify authentication
    const user = await verifyAuthToken(req);
    if (!user || !user.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    // Get user role
    const role = await getUserRole(user.email);
    
    return NextResponse.json({ role });
  } catch (error) {
    console.error('Error getting user role:', error);
    
    return NextResponse.json(
      { error: 'Failed to get user role' },
      { status: 500 }
    );
  }
}