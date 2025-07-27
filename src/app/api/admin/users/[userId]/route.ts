import { NextRequest, NextResponse } from 'next/server';
import { getDbOrThrow, getAuthAdmin } from '@/lib/firebase-admin';
import { withAdminAuth, AdminUser } from '@/lib/admin-auth';
import { rateLimiters } from '@/lib/rate-limit';

interface RouteParams {
  userId: string;
}

async function handleGetUser(
  req: NextRequest,
  { params }: { params: RouteParams }
) {
  // Rate limit
  const limited = await rateLimiters.admin(req);
  if (limited) return limited;

  const userId = params.userId;
  
  const db = getDbOrThrow();
  // Get user document
  const userDoc = await db.collection('users').doc(userId).get();
  
  if (!userDoc.exists) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    );
  }

  const userData = userDoc.data();
  
  return NextResponse.json({
    uid: userDoc.id,
    email: userData?.email,
    displayName: userData?.displayName || '',
    subscription: {
      tier: userData?.subscriptionTier || 'none',
      status: userData?.subscriptionStatus || 'none',
      periodEnd: userData?.subscriptionPeriodEnd || '',
      lettersUsed: userData?.lettersUsed || 0,
      lettersLimit: userData?.lettersLimit || 0
    },
    createdAt: userData?.createdAt || '',
    lastLogin: userData?.lastLogin || '',
    isAdmin: userData?.role === 'admin' || userData?.admin === true
  });
}

async function handleUpdateUser(
  req: NextRequest,
  { params }: { params: RouteParams }
) {
  // Rate limit
  const limited = await rateLimiters.admin(req);
  if (limited) return limited;

  const userId = params.userId;
  const updates = await req.json();
  
  const db = getDbOrThrow();
  // Update user document
  const userRef = db.collection('users').doc(userId);
  await userRef.update({
    ...updates,
    lastModified: new Date().toISOString()
  });

  // If updating admin status, also update Firebase Auth custom claims
  if ('isAdmin' in updates) {
    const auth = await getAuthAdmin();
    if (auth) {
      await auth.setCustomUserClaims(userId, {
        role: updates.isAdmin ? 'admin' : 'user',
        admin: updates.isAdmin
      });
    }
  }

  return NextResponse.json({ success: true });
}

export const GET = withAdminAuth(async (req: NextRequest, adminUser: AdminUser) => {
  const url = new URL(req.url);
  const userId = url.pathname.split('/').pop();
  return handleGetUser(req, { params: { userId: userId! } });
});

export const PATCH = withAdminAuth(async (req: NextRequest, adminUser: AdminUser) => {
  const url = new URL(req.url);
  const userId = url.pathname.split('/').pop();
  return handleUpdateUser(req, { params: { userId: userId! } });
});
