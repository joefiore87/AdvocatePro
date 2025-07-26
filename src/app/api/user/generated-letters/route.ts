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

    if (!user.hasAccess) {
      return NextResponse.json({ error: 'Premium access required' }, { status: 403 });
    }

    const db = await getFirestoreAdmin();
    if (!db) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
    }

    // Get user's generated letters
    const lettersRef = db.collection('userProfiles').doc(user.uid).collection('generatedLetters');
    const lettersSnap = await lettersRef.orderBy('generatedAt', 'desc').get();
    
    const letters = lettersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json({ letters });

  } catch (error) {
    console.error('Error fetching generated letters:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
