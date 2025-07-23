import { NextRequest, NextResponse } from 'next/server';
import { getContentCategory } from '@/lib/server/content-service';
import { verifyAdminAccess } from '@/lib/auth-middleware';
import { rateLimiters } from '@/lib/rate-limit';

export async function GET(
  req: NextRequest,
  { params }: { params: { categoryId: string } }
) {
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
    const { categoryId } = params;
    
    if (!categoryId) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }

    const category = await getContentCategory(categoryId);
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ category });
  } catch (error) {
    console.error(`Error fetching category ${params.categoryId}:`, error);
    
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}