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
  // TEMPORARILY DISABLED - Firebase Admin not configured
  return NextResponse.json({ error: 'Admin features temporarily disabled' }, { status: 503 });
}

export async function POST(req: NextRequest) {
  // TEMPORARILY DISABLED - Firebase Admin not configured
  return NextResponse.json({ error: 'Admin features temporarily disabled' }, { status: 503 });
}