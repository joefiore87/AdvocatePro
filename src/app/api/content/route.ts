import { NextRequest, NextResponse } from 'next/server';
import { rateLimiters } from '@/lib/rate-limit';

export async function GET(req: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = await rateLimiters.public(req);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    // Return default content as fallback while Firebase Admin is disabled
    const defaultContent = {
      'homepage-hero': "You know your child better than anyone. Now get the tools to help schools see it too.",
      'homepage-description': "A comprehensive toolkit designed to empower parents in special education advocacy.",
      'annual-pricing': "$97",
      'whats-included-title': "What's Included",
      'whats-included-description': "Everything you need to advocate effectively for your child."
    };
    
    return NextResponse.json({ content: defaultContent });
  } catch (error) {
    console.error('Error fetching content:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}
