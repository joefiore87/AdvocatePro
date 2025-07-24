import { NextRequest, NextResponse } from 'next/server';
import { getContentCategory } from '@/lib/server/content-service';
import { requireAdminAuth } from '@/lib/auth-middleware';
import { rateLimiters } from '@/lib/rate-limit';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  const { categoryId } = await params;
  // Rate-limit first
  const limited = await rateLimiters.admin(req);
  if (limited) return limited;

  // Ensure Firebase Admin is ready
  const auth = await (await import('@/lib/firebase-admin')).getAuthAdmin();
  if (!auth) {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }

  // Verify token and admin role
  const authResp = await requireAdminAuth(req);
  if (authResp) return authResp;

  const category = await getContentCategory(categoryId);
  if (!category) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ category });
}
