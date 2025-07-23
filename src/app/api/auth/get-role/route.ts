import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/auth-middleware';
import { getUserRole } from '@/lib/server/roles-service';
import { rateLimiters } from '@/lib/rate-limit';
import { getAuthAdmin } from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
  // TEMPORARILY DISABLED - Firebase Admin not configured
  return NextResponse.json({ role: null }, { status: 200 });
}
