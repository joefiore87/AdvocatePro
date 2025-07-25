import { NextRequest, NextResponse } from 'next/server';
import { requirePremiumAuth } from '@/lib/auth-middleware';
import { getFirestoreAdmin } from '@/lib/firebase-admin';
import { rateLimiters } from '@/lib/rate-limit';

export async function GET(req: NextRequest) {
  try {
    // Apply rate limiting
    const limited = await rateLimiters.api(req);
    if (limited) return limited;

    // Check premium access via custom claims
    const authError = await requirePremiumAuth(req);
    if (authError) return authError;

    // Get user from verified token (we know it's valid from requirePremiumAuth)
    const authHeader = req.headers.get('Authorization');
    const token = authHeader!.split('Bearer ')[1];
    const auth = await import('firebase-admin').then(m => m.auth());
    const decodedToken = await auth.verifyIdToken(token);
    const userEmail = decodedToken.email!;

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
