import { NextRequest, NextResponse } from 'next/server';
import { getContentCategory } from '@/lib/server/content-service';
import { requireAdminAuth } from '@/lib/auth-middleware';
import { rateLimiters } from '@/lib/rate-limit';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  // TEMPORARILY DISABLED - Firebase Admin not configured
  return NextResponse.json({ error: 'Admin features temporarily disabled' }, { status: 503 });
}
