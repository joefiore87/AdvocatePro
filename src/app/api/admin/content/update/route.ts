import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAccess } from '@/lib/auth-middleware';
import { contentUpdateSchema } from '@/lib/validation';
import { rateLimiters } from '@/lib/rate-limit';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase';

const db = getFirestore(app);

export async function POST(req: NextRequest) {
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
    // Validate request body
    const body = await req.json();
    const { categoryId, itemId, value } = contentUpdateSchema.parse(body);
    
    // Get the current item
    const itemRef = doc(db, 'content', categoryId, 'items', itemId);
    const itemSnap = await getDoc(itemRef);
    
    if (!itemSnap.exists()) {
      return NextResponse.json(
        { error: `Content item ${categoryId}/${itemId} not found` },
        { status: 404 }
      );
    }
    
    const currentItem = itemSnap.data();
    
    // Update the item
    await setDoc(itemRef, {
      ...currentItem,
      value,
      lastUpdated: new Date().toISOString(),
      updatedBy: user.email
    });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating content:', error);
    
    // Handle validation errors
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    );
  }
}