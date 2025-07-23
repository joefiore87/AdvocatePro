import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // TEMPORARILY DISABLED - Firebase Admin not configured
  return NextResponse.json({ error: 'Admin features temporarily disabled' }, { status: 503 });
}
