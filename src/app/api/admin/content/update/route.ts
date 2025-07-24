import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/auth-middleware';
import { rateLimiters } from '@/lib/rate-limit';
import { updateContentItem, getContentCategory } from '@/lib/server/content-service';
import { getAuthAdmin } from '@/lib/firebase-admin';

interface UpdateBody { categoryId: string; itemId: string; value: string }

export async function PUT(req: NextRequest) {
  // Rate-limit
  const limited = await rateLimiters.admin(req);
  if (limited) return limited;

  // Ensure Firebase Admin ready
  const auth = await getAuthAdmin();
  if (!auth) return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });

  // Verify admin auth
  const authResp = await requireAdminAuth(req);
  if (authResp) return authResp;

  // Parse body
  let body: UpdateBody;
  try {
    body = await req.json();
    if (!body.categoryId || !body.itemId || !body.value) throw new Error('Missing fields');
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const success = await updateContentItem(body.categoryId, body.itemId, body.value, 'admin');
  if (!success) return NextResponse.json({ error: 'Update failed' }, { status: 500 });

  const category = await getContentCategory(body.categoryId);
  const updatedItem = category?.items.find(i => i.id === body.itemId);

  return NextResponse.json({ success: true, item: updatedItem }, { status: 200 });
}
