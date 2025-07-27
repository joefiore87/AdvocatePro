import { NextRequest, NextResponse } from 'next/server';
import { getDbOrThrow } from '@/lib/firebase-admin';
import { withAdminAuth } from '@/lib/admin-auth';
import { rateLimiters } from '@/lib/rate-limit';

async function handleGetUsers(req: NextRequest) {
  // Rate limit
  const limited = await rateLimiters.admin(req);
  if (limited) return limited;

  const db = getDbOrThrow();
  const usersSnapshot = await db.collection('users').get();
  const users: any[] = [];

  usersSnapshot.forEach(doc => {
    const userData = doc.data();
    users.push({
      uid: doc.id,
      email: userData.email,
      displayName: userData.displayName || '',
      subscription: {
        tier: userData.subscriptionTier || 'none',
        status: userData.subscriptionStatus || 'none',
        periodEnd: userData.subscriptionPeriodEnd || '',
        lettersUsed: userData.lettersUsed || 0,
        lettersLimit: userData.lettersLimit || 0
      },
      createdAt: userData.createdAt || '',
      lastLogin: userData.lastLogin || '',
      isAdmin: userData.role === 'admin' || userData.admin === true
    });
  });

  // Sort by creation date (newest first)
  users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return NextResponse.json({ users });
}

export const GET = withAdminAuth(handleGetUsers);
