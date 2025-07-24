import { NextRequest, NextResponse } from 'next/server';
import { getAuthAdmin } from './firebase-admin';

interface AuthUser {
  uid: string;
  email: string;
}

/**
 * Verify the Firebase ID token from the request
 * Returns the decoded token if valid, null otherwise
 */
export async function verifyAuthToken(req: NextRequest): Promise<AuthUser | null> {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.split('Bearer ')[1];
    const auth = await getAuthAdmin();
    
    if (!auth) {
      console.error('Firebase Admin not initialized');
      return null;
    }

    const decodedToken = await auth.verifyIdToken(token);
    
    return {
      uid: decodedToken.uid,
      email: decodedToken.email || ''
    };
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}

/**
 * Check if the user has admin role
 */
export async function isAdminUser(userId: string): Promise<boolean> {
  try {
    const auth = await getAuthAdmin();
    if (!auth) {
      console.error('Firebase Admin not initialized');
      return false;
    }

    const user = await auth.getUser(userId);
    return user.customClaims?.role === 'admin';
  } catch (error) {
    console.error('Error checking admin role:', error);
    return false;
  }
}

/**
 * Middleware to protect admin routes
 */
export async function requireAdminAuth(req: NextRequest): Promise<NextResponse | null> {
  const user = await verifyAuthToken(req);
  
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' }, 
      { status: 401 }
    );
  }

  const isAdmin = await isAdminUser(user.uid);
  if (!isAdmin) {
    return NextResponse.json(
      { error: 'Admin access required' }, 
      { status: 403 }
    );
  }

  return null;
}
