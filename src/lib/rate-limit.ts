import { NextRequest, NextResponse } from 'next/server';

interface RateLimitOptions {
  limit: number;
  windowMs: number;
  keyGenerator?: (req: NextRequest) => string;
}

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting
const rateLimitStore = new Map<string, RateLimitRecord>();

/**
 * Rate limiting middleware
 */
export function rateLimit(options: RateLimitOptions) {
  const { limit, windowMs, keyGenerator = defaultKeyGenerator } = options;

  return async function rateLimitMiddleware(req: NextRequest): Promise<NextResponse | null> {
    const key = keyGenerator(req);
    const now = Date.now();
    
    // Clean up expired entries
    cleanupExpiredEntries(now);
    
    const record = rateLimitStore.get(key);
    
    if (!record) {
      // First request from this key
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      return null; // Allow request
    }
    
    if (now > record.resetTime) {
      // Window has expired, reset
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      return null; // Allow request
    }
    
    if (record.count >= limit) {
      // Rate limit exceeded
      return NextResponse.json(
        { 
          error: 'Too many requests',
          retryAfter: Math.ceil((record.resetTime - now) / 1000)
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((record.resetTime - now) / 1000).toString(),
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(record.resetTime).toISOString()
          }
        }
      );
    }
    
    // Increment count
    record.count++;
    rateLimitStore.set(key, record);
    
    return null; // Allow request
  };
}

/**
 * Default key generator using IP address
 */
function defaultKeyGenerator(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : req.ip || 'unknown';
  return `rate_limit:${ip}`;
}

/**
 * Clean up expired entries from the store
 */
function cleanupExpiredEntries(now: number): void {
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Predefined rate limiters for common use cases
 */
export const rateLimiters = {
  // Strict rate limiting for admin operations
  admin: rateLimit({
    limit: 10,
    windowMs: 60 * 1000, // 1 minute
  }),
  
  // Moderate rate limiting for API endpoints
  api: rateLimit({
    limit: 100,
    windowMs: 60 * 1000, // 1 minute
  }),
  
  // Lenient rate limiting for public content
  public: rateLimit({
    limit: 1000,
    windowMs: 60 * 1000, // 1 minute
  }),
  
  // Very strict rate limiting for authentication
  auth: rateLimit({
    limit: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
  })
};