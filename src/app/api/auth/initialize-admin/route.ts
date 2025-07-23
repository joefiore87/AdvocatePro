import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/auth-middleware';
import { getUserRole, setUserRole } from '@/lib/server/roles-service';
import { getFirestore, doc, getDoc, setDoc } from 'firebase-admin/firestore';
import { getApp } from 'firebase-admin/app';
import { rateLimiters } from '@/lib/rate-limit';

// Use the admin app initialized in auth-middleware.ts
const db = getFirestore(getApp());

export async function POST(req: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = await rateLimiters.auth(req);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    // Verify authentication
    const user = await verifyAuthToken(req);
    if (!user || !user.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    // Parse request body
    const body = await req.json();
    const { email } = body;
    
    // Validate request
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    
    // Check if any admin exists
    const adminQuery = await db.collection('users').where('role', '==', 'admin').limit(1).get();
    
    if (!adminQuery.empty) {
      // Admin already exists, only existing admins can create new ones
      const currentUserRole = await getUserRole(user.email);
      
      if (currentUserRole !== 'admin') {
        return NextResponse.json(
          { error: 'Only existing admins can create new admins' },
          { status: 403 }
        );
      }
    }
    
    // Check if user exists
    const userDoc = await getDoc(doc(db, 'users', email));
    
    if (userDoc.exists()) {
      return NextResponse.json(
        { success: false, error: 'User already exists' },
        { status: 400 }
      );
    }
    
    // Create the admin user
    await setDoc(doc(db, 'users', email), {
      role: 'admin',
      createdAt: new Date().toISOString(),
      isInitialAdmin: adminQuery.empty
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error initializing admin user:', error);
    
    return NextResponse.json(
      { error: 'Failed to initialize admin user' },
      { status: 500 }
    );
  }
}