import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/auth-middleware';
import { checkUserAccess } from '@/lib/server/subscription-service';
import { rateLimiters } from '@/lib/rate-limit';
import { LRUCache } from 'lru-cache';

const cache = new LRUCache<string, boolean>({
  max: 100,
  ttl: 1000 * 60 * 5, // 5 minutes
});

export async function GET(req: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = await rateLimiters.api(req);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    // Verify authentication
    const user = await verifyAuthToken(req);
    if (!user || !user.email) {
      return NextResponse.json({ hasAccess: false }, { status: 401 });
    }
    
    // Check cache first
    const cachedAccess = cache.get(user.email);
    if (cachedAccess !== undefined) {
      return NextResponse.json({ hasAccess: cachedAccess });
    }

    // Check user access
    const hasAccess = await checkUserAccess(user.email);
    
    // Cache the result
    cache.set(user.email, hasAccess);

    return NextResponse.json({ hasAccess });
  } catch (error) {
    console.error('Error checking access:', error);
    
    return NextResponse.json(
      { error: 'Failed to check access' },
      { status: 500 }
    );
  }
}