import { NextRequest, NextResponse } from 'next/server';
import { getAllContent } from '@/lib/server/content-service';
import { requireAdminAuth } from '@/lib/auth-middleware';
import { rateLimiters } from '@/lib/rate-limit';
import { getAuthAdmin } from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
    // Rate limit
  const limited = await rateLimiters.admin(req);
  if (limited) return limited;

  // Ensure Firebase Admin initialized
  const auth = await getAuthAdmin();
  if (!auth) {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }

  // Verify admin token
  const authResp = await requireAdminAuth(req);
  if (authResp) return authResp;

  const content = await getAllContent();
  return NextResponse.json({ content });
}
