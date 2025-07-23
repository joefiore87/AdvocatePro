import { NextRequest, NextResponse } from 'next/server';
import { getTransformedContent } from '@/lib/server/content-service';
import { verifyAdminAccess } from '@/lib/auth-middleware';
import { rateLimiters } from '@/lib/rate-limit';
import { getAuthAdmin } from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
  // Ensure Firebase Admin is initialized
  const authAdmin = await getAuthAdmin();
  if (!authAdmin) {
    return NextResponse.json({ error: 'Firebase Admin initialization failed' }, { status: 500 });
  }

  // Apply rate limiting
  const rateLimitResponse = await rateLimiters.admin(req);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  // Verify admin access
  const user = await verifyAdminAccess(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const transformedContent = await getTransformedContent();
    return NextResponse.json({ content: transformedContent });
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}