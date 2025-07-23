import { NextRequest, NextResponse } from 'next/server';
import { getTransformedContent } from '@/lib/server/content-service';
import { rateLimiters } from '@/lib/rate-limit';

export async function GET(req: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = await rateLimiters.public(req);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const transformedContent = await getTransformedContent();
    return NextResponse.json({ content: transformedContent });
  } catch (error) {
    console.error('Error fetching content:', error);
    
    // Return default content as fallback
    const defaultContent = {
      'homepage-hero': "You know your child better than anyone. Now get the tools to help schools see it too.",
      'homepage-description': "Create clear, professional advocacy letters using what you already know about your child. Everything stays private on your computer—no uploading personal information anywhere.",
      'annual-pricing': "$29.99/year",
      'whats-included-title': "What's Included",
      'features-list': "20 letter templates for different situations (evaluation requests, meeting requests, follow-ups, etc.)\\n7 learning modules explaining special education processes and parent rights\\nWorks offline - install once, use anywhere\\nUpdates included when new templates are added"
    };
    
    return NextResponse.json({ content: defaultContent });
  }
}