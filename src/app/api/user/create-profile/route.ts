import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, verifyAuthToken } from '@/lib/auth-middleware';
import { getFirestoreAdmin } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    // Verify authentication and get user info
    const user = await verifyAuthToken(req);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get additional data from request
    const { displayName } = await req.json();

    const db = await getFirestoreAdmin();
    if (!db) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
    }

    // Create user profile document using UID as document ID
    const userProfile = {
      uid: user.uid,
      email: user.email,
      displayName: displayName || null,
      subscriptionStatus: 'none',
      hasAccess: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: new Date()
    };

    // Use UID as document ID, merge to avoid overwriting existing data
    await db.collection('users').doc(user.uid).set(userProfile, { merge: true });

    console.log(`✅ User profile created/updated for: ${user.email} (UID: ${user.uid})`);

    return NextResponse.json({ 
      success: true, 
      message: 'User profile created successfully',
      uid: user.uid
    });

  } catch (error) {
    console.error('Error creating user profile:', error);
    return NextResponse.json(
      { error: 'Failed to create user profile' },
      { status: 500 }
    );
  }
}
