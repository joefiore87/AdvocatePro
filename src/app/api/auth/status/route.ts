import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, verifyAuthToken } from '@/lib/auth-middleware';

export async function GET(req: NextRequest) {
  try {
    // Verify user is authenticated
    const authError = await requireAuth(req);
    if (authError) return authError;

    // Get user data from verified token
    const user = await verifyAuthToken(req);
    if (!user) {
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }

    // Return current access status from custom claims
    return NextResponse.json({
      hasAccess: user.hasAccess || false,
      subscriptionStatus: user.subscriptionStatus || 'none',
      expiresAt: user.expiresAt || null,
      email: user.email,
      lastUpdated: Date.now()
    });

  } catch (error) {
    console.error('Error checking access status:', error);
    return NextResponse.json(
      { error: 'Failed to check access status' },
      { status: 500 }
    );
  }
}
