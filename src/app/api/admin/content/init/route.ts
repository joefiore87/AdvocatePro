import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  return NextResponse.json({ error: 'Admin features temporarily disabled' }, { status: 503 });
}
