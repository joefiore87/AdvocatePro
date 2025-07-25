import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/auth-middleware';
import { getFirestoreAdmin } from '@/lib/firebase-admin';
import { rateLimiters } from '@/lib/rate-limit';

export async function GET(req: NextRequest) {
  try {
    // Apply rate limiting
    const limited = await rateLimiters.api(req);
    if (limited) return limited;

    // Verify Firebase ID token and check access
    const user = await verifyAuthToken(req);
    if (!user || !user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has access via custom claims
    if (!user.hasAccess) {
      return NextResponse.json({ 
        error: 'Premium access required',
        hasAccess: false 
      }, { status: 403 });
    }

    const db = await getFirestoreAdmin();
    if (!db) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
    }

    // Get premium content from premiumContent collection
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '10');

    let content: Record<string, any> = {};

    if (category) {
      // Get specific category
      const categoryRef = db.collection('premiumContent').doc(category);
      const categorySnap = await categoryRef.get();
      
      if (categorySnap.exists) {
        const categoryData = categorySnap.data();
        
        // Get items for this category
        const itemsRef = categoryRef.collection('items').limit(limit);
        const itemsSnap = await itemsRef.get();
        
        const items = itemsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        content[category] = {
          ...categoryData,
          items
        };
      }
    } else {
      // Get all premium content categories
      const categoriesRef = db.collection('premiumContent').limit(limit);
      const categoriesSnap = await categoriesRef.get();
      
      for (const categoryDoc of categoriesSnap.docs) {
        const categoryData = categoryDoc.data();
        
        // Get items for each category
        const itemsRef = categoryDoc.ref.collection('items').limit(limit);
        const itemsSnap = await itemsRef.get();
        
        const items = itemsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        content[categoryDoc.id] = {
          ...categoryData,
          items
        };
      }
    }

    return NextResponse.json({ content, hasAccess: true });

  } catch (error) {
    console.error('Error fetching premium content:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
