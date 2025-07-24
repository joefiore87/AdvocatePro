import { NextRequest, NextResponse } from 'next/server';
import { getTransformedContent } from '@/lib/server/content-service';
import { requireAdminAuth } from '@/lib/auth-middleware';
import { rateLimiters } from '@/lib/rate-limit';
import { getAuthAdmin } from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
  // TEMPORARILY DISABLED - Firebase Admin not configured
  return NextResponse.json({ error: 'Admin features temporarily disabled' }, { status: 503 });
}
