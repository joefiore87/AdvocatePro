import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAccess } from '@/lib/auth-middleware';
import { rateLimiters } from '@/lib/rate-limit';
import { updateContentItem, getContentCategory } from '@/lib/server/content-service';
import { ContentItem } from '@/lib/content-types';

interface UpdateContentRequest {
  value: string;
}

interface UpdateContentResponse {
  success: boolean;
  item?: ContentItem;
  error?: string;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { categoryId: string; itemId: string } }
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
    const { categoryId, itemId } = params;
    
    // Validate parameters
    if (!categoryId || !itemId) {
      return NextResponse.json(
        { error: 'Category ID and Item ID are required' },
        { status: 400 }
      );
    }

    // Parse request body
    let body: UpdateContentRequest;
    try {
      body = await req.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // Validate request body
    if (!body.value && body.value !== '') {
      return NextResponse.json(
        { error: 'Value is required' },
        { status: 400 }
      );
    }

    // Validate value length (reasonable limit)
    if (body.value.length > 50000) {
      return NextResponse.json(
        { error: 'Content value is too long (max 50,000 characters)' },
        { status: 400 }
      );
    }

    // Update the content item
    const success = await updateContentItem(
      categoryId,
      itemId,
      body.value,
      user.email
    );

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update content item. Item may not exist.' },
        { status: 404 }
      );
    }

    // Get the updated item to return in response
    const category = await getContentCategory(categoryId);
    const updatedItem = category?.items.find(item => item.id === itemId);

    const response: UpdateContentResponse = {
      success: true,
      item: updatedItem
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error updating content item:', error);
    
    const response: UpdateContentResponse = {
      success: false,
      error: 'Internal server error'
    };
    
    return NextResponse.json(response, { status: 500 });
  }
}