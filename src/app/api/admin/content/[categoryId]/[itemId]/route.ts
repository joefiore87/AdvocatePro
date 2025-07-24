import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/auth-middleware';
import { rateLimiters } from '@/lib/rate-limit';
import { updateContentItem, getContentCategory } from '@/lib/server/content-service';
import { ContentItem } from '@/lib/content-types';
import { getAuthAdmin } from '@/lib/firebase-admin';

interface UpdateContentRequest {
  value: string;
}

interface UpdateContentResponse {
  success: boolean;
  item?: ContentItem;
  error?: string;
}

// Ensure Firebase Admin is initialized
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ categoryId: string; itemId: string }> }
) {
  const { categoryId, itemId } = await context.params;
    // Rate-limit
  const limited = await rateLimiters.admin(req);
  if (limited) return limited;

  // Ensure Firebase Admin initialized
  const auth = await getAuthAdmin();
  if (!auth) {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }

  // Verify admin token
  const authResp = await requireAdminAuth(req);
  if (authResp) return authResp;



  // Validate request body
  let body: UpdateContentRequest;
  try {
    body = await req.json();
    if (!body?.value) throw new Error('Missing value');
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const success = await updateContentItem(categoryId, itemId, body.value, 'admin');
  if (!success) {
    return NextResponse.json({ success: false }, { status: 500 });
  }

  // Return updated item for convenience
  const updatedCategory = await getContentCategory(categoryId);
  const updatedItem = updatedCategory?.items.find(i => i.id === itemId);

  const resp: UpdateContentResponse = {
    success: true,
    item: updatedItem,
  };
  return NextResponse.json(resp);
}
