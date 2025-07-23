import { NextRequest, NextResponse } from 'next/server';
import { getAllContent } from '@/lib/server/content-service';
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
    const allContent = await getAllContent();
    
    return NextResponse.json({ content: allContent });
  } catch (error) {
    console.error('Error fetching raw content:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}