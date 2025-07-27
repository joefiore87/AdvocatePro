import { NextRequest, NextResponse } from 'next/server';
import { getTransformedContent } from '@/lib/server/content-service';
import { withAdminAuth, AdminUser } from '@/lib/admin-auth';
import { rateLimiters } from '@/lib/rate-limit';

export const GET = withAdminAuth(async (req: NextRequest, adminUser: AdminUser) => {
  // Rate limit
  const limited = await rateLimiters.admin(req);
  if (limited) return limited;

  try {
    const content = await getTransformedContent();
    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
});
