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

    // Get user's student profiles
    const profilesRef = db.collection('userProfiles').doc(user.email).collection('studentProfiles');
    const profilesSnap = await profilesRef.orderBy('createdAt', 'desc').get();
    
    const profiles = profilesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json({ profiles });

  } catch (error) {
    console.error('Error fetching student profiles:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
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

    const profileData = await req.json();
    
    // Validate required fields
    if (!profileData.studentName || !profileData.grade) {
      return NextResponse.json({ 
        error: 'Student name and grade are required' 
      }, { status: 400 });
    }

    const db = await getFirestoreAdmin();
    if (!db) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
    }

    // Create student profile
    const newProfile = {
      ...profileData,
      createdAt: new Date(),
      updatedAt: new Date(),
      userEmail: user.email
    };

    const profileRef = await db
      .collection('userProfiles')
      .doc(user.email)
      .collection('studentProfiles')
      .add(newProfile);

    return NextResponse.json({ 
      success: true, 
      profileId: profileRef.id,
      profile: { id: profileRef.id, ...newProfile }
    });

  } catch (error) {
    console.error('Error creating student profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
