import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/auth-middleware';
import { getUserRole } from '@/lib/server/roles-service';
import { rateLimiters } from '@/lib/rate-limit';
import { getAuthAdmin } from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
  // Apply rate limiting
  const limited = await rateLimiters.api(req);
  if (limited) return limited;

  // Verify Firebase ID token
  const user = await verifyAuthToken(req);
  if (!user || !user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch role from custom claims
  const role = await getUserRole(user.email);

  return NextResponse.json({ role }, { status: 200 });
}
