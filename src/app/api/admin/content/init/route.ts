import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAccess } from '@/lib/auth-middleware';
import { contentInitSchema } from '@/lib/validation';
import { rateLimiters } from '@/lib/rate-limit';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { DEFAULT_CONTENT } from '@/lib/content-types';

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
    const { force = false } = contentInitSchema.parse(body);
    
    // Check if content already exists
    const contentRef = doc(db, 'system', 'content');
    const contentSnap = await getDoc(contentRef);
    
    if (contentSnap.exists() && !force) {
      return NextResponse.json(
        { message: 'Content already initialized', initialized: false },
        { status: 200 }
      );
    }
    
    // Initialize with default content
    await setDoc(contentRef, { initialized: true, lastUpdated: new Date().toISOString() });
    
    // Create each content category
    for (const [key, category] of Object.entries(DEFAULT_CONTENT)) {
      await setDoc(doc(db, 'content', category.id), {
        id: category.id,
        name: category.name,
        description: category.description
      });
      
      // Create each content item
      for (const item of category.items) {
        await setDoc(doc(db, 'content', category.id, 'items', item.id), {
          ...item,
          lastUpdated: new Date().toISOString(),
          updatedBy: user.email
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Content initialized successfully',
      initialized: true
    });
  } catch (error: any) {
    console.error('Error initializing content:', error);
    
    // Handle validation errors
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to initialize content' },
      { status: 500 }
    );
  }
}