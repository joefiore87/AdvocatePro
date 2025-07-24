import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/auth-middleware';
import { rateLimiters } from '@/lib/rate-limit';
import { initializeContent } from '@/lib/server/content-service';
import { getAuthAdmin } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  // Rate-limit
  const limited = await rateLimiters.admin(req);
  if (limited) return limited;

  // Ensure Firebase Admin ready
  const auth = await getAuthAdmin();
  if (!auth) {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }

  // Verify token and admin role
  const authResp = await requireAdminAuth(req);
  if (authResp) return authResp;

  try {
    const initialized = await initializeContent();
    return NextResponse.json({ initialized }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to initialize content' }, { status: 500 });
  }
}
