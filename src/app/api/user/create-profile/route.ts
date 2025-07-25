import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/auth-middleware';
import { getFirestoreAdmin } from '@/lib/firebase-admin';
import { rateLimiters } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    // Apply rate limiting
    const limited = await rateLimiters.api(req);
    if (limited) return limited;

    // Verify Firebase ID token
    const user = await verifyAuthToken(req);
    if (!user || !user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email, displayName, uid } = await req.json();

    // Validate email matches token
    if (email !== user.email) {
      return NextResponse.json({ error: 'Email mismatch' }, { status: 400 });
    }

    const db = await getFirestoreAdmin();
    if (!db) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
    }

    // Check if user profile already exists
    const userDoc = await db.collection('users').doc(email).get();
    
    if (!userDoc.exists) {
      // Create new user profile
      const userData = {
        uid,
        email,
        displayName: displayName || '',
        createdAt: new Date(),
        lastLoginAt: new Date(),
        subscriptionStatus: 'none',
        trialUsed: false,
        customClaims: {
          hasAccess: false,
          role: 'user'
        }
      };

      await db.collection('users').doc(email).set(userData);
      
      return NextResponse.json({ 
        success: true, 
        message: 'User profile created',
        user: userData 
      });
    } else {
      // Update last login
      await db.collection('users').doc(email).update({
        lastLoginAt: new Date()
      });
      
      return NextResponse.json({ 
        success: true, 
        message: 'User profile updated',
        user: userDoc.data() 
      });
    }

  } catch (error) {
    console.error('Error creating user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
