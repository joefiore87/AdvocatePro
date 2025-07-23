import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuth } from './firebase-admin-config';

interface AuthUser {
  uid: string;
  email: string;
}

/**
 * Verify the Firebase ID token from the request
 */
export async function verifyAuthToken(req: NextRequest): Promise<AuthUser | null> {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    
    const token = authHeader.split('Bearer ')[1];
    if (!token) return null;
    
    const auth = getAdminAuth();
    if (!auth) {
      console.error('Firebase Admin not initialized');
      return null;
    }
    
    // Verify the token
    const decodedToken = await auth.verifyIdToken(token);
    
    return {
      uid: decodedToken.uid,
      email: decodedToken.email || ''
    };
  } catch (error) {
    console.error('Error verifying auth token:', error);
    return null;
  }
}

/**
 * Verify that the user is an admin
 */
export async function verifyAdminAccess(req: NextRequest): Promise<AuthUser | null> {
  const user = await verifyAuthToken(req);
  
  if (!user || !user.email) {
    return null;
  }
  
  const auth = getAdminAuth();
  if (!auth) {
    console.error('Firebase Admin not initialized');
    return null;
  }
  
  try {
    const adminUser = await auth.getUser(user.uid);
    const isUserAdmin = adminUser.customClaims?.role === 'admin';
    
    return isUserAdmin ? user : null;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return null;
  }
}

/**
 * Middleware to protect admin routes
 */
export async function adminAuthMiddleware(req: NextRequest) {
  const user = await verifyAdminAccess(req);
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  return NextResponse.next();
}
