import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAuth } from 'firebase-admin/auth';
import { initializeFirebaseAdmin } from './firebase-admin-init';
import { isAdmin, logAdminAccessAttempt } from './server/roles-service';

initializeFirebaseAdmin();

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
    
    // Verify the token
    const decodedToken = await getAuth().verifyIdToken(token);
    
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
    // Log failed access attempt (no user)
    const ip = (req.headers.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0];
    await logAdminAccessAttempt('unknown', false, ip);
    return null;
  }
  
  const isUserAdmin = await isAdmin(user.email);
  
  // Log access attempt for security monitoring
  const ip = (req.headers.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0];
  await logAdminAccessAttempt(user.email, isUserAdmin, ip);
  
  return isUserAdmin ? user : null;
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