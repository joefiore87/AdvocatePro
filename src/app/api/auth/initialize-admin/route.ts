import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/auth-middleware';
import { getUserRole, setUserRole } from '@/lib/server/roles-service';
// import { getFirestore } from 'firebase-admin/firestore';
// import { getApp } from 'firebase-admin/app';
import { rateLimiters } from '@/lib/rate-limit';
import { getAuthAdmin } from '@/lib/firebase-admin';

// Use the admin app initialized in auth-middleware.ts
// const db = getFirestore(getApp());

// Ensure Firebase Admin is initialized
export async function GET(request: NextRequest) {
  const limited = await rateLimiters.admin(request);
  if (limited) return limited;

  const auth = await getAuthAdmin();
  if (!auth) {
    return NextResponse.json({ error: 'Firebase Admin not configured' }, { status: 503 });
  }
  return NextResponse.json({ ok: true }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const limited = await rateLimiters.admin(req);
  if (limited) return limited;

  // Only an existing admin can set another admin role
  const caller = await verifyAuthToken(req);
  if (!caller) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const callerRole = await getUserRole(caller.email);
  if (callerRole !== 'admin') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  const { email, role } = await req.json();
  if (!email || !role) {
    return NextResponse.json({ error: 'email and role required' }, { status: 400 });
  }

  try {
    await setUserRole(email, role);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to set role' }, { status: 500 });
  }
}