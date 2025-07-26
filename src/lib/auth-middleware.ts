import { NextRequest, NextResponse } from 'next/server';
import { getAuthAdmin } from './firebase-admin';

interface AuthUser {
  uid: string;
  email: string;
  hasAccess?: boolean;
  role?: string;
  subscriptionStatus?: string;
  expiresAt?: number;
}

/**
 * Verify the Firebase ID token from the request and return user with custom claims
 * Returns the decoded token with claims if valid, null otherwise
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
      email: decodedToken.email || '',
      hasAccess: decodedToken.hasAccess || false,
      role: decodedToken.role || 'user',
      subscriptionStatus: decodedToken.subscriptionStatus || 'none',
      expiresAt: decodedToken.expiresAt || null
    };
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}

/**
 * Check if the user has admin role via custom claims
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
 * Middleware to protect premium routes - requires hasAccess custom claim
 */
export async function requirePremiumAuth(req: NextRequest): Promise<NextResponse | null> {
  const user = await verifyAuthToken(req);
  
  if (!user) {
    return NextResponse.json(
      { error: 'Authentication required' }, 
      { status: 401 }
    );
  }

  if (!user.hasAccess) {
    return NextResponse.json(
      { error: 'Premium access required. Please complete your purchase.' }, 
      { status: 403 }
    );
  }

  return null;
}

/**
 * Middleware to protect admin routes
 */
export async function requireAdminAuth(req: NextRequest): Promise<NextResponse | null> {
  const user = await verifyAuthToken(req);
  
  if (!user) {
    return NextResponse.json(
      { error: 'Authentication required' }, 
      { status: 401 }
    );
  }

  if (user.role !== 'admin') {
    return NextResponse.json(
      { error: 'Admin access required' }, 
      { status: 403 }
    );
  }

  return null;
}

/**
 * Middleware to require basic authentication (any logged-in user)
 */
export async function requireAuth(req: NextRequest): Promise<NextResponse | null> {
  const user = await verifyAuthToken(req);
  
  if (!user) {
    return NextResponse.json(
      { error: 'Authentication required' }, 
      { status: 401 }
    );
  }

  return null;
}
