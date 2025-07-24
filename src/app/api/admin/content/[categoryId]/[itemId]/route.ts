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
  { params }: { params: Promise<{ categoryId: string; itemId: string }> }
) {
  // TEMPORARILY DISABLED - Firebase Admin not configured
  return NextResponse.json({ error: 'Admin features temporarily disabled' }, { status: 503 });
}
