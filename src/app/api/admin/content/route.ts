import { NextRequest, NextResponse } from 'next/server';
import { getTransformedContent } from '@/lib/server/content-service';
import { verifyAdminAccess } from '@/lib/auth-middleware';
import { rateLimiters } from '@/lib/rate-limit';

export async function GET(req: NextRequest) {
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