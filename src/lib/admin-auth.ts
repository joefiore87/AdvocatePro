import { NextRequest, NextResponse } from 'next/server';
import { getAuthAdmin } from './firebase-admin';

export interface AdminUser {
  uid: string;
  email: string;
  role: string;
}

/**
 * Centralized admin authentication for API endpoints
 */
export async function verifyAdminToken(req: NextRequest): Promise<AdminUser | null> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  try {
    const token = authHeader.split('Bearer ')[1];
    const auth = await getAuthAdmin();
    
    if (!auth) {
      console.error('Firebase Admin not initialized');
      return null;
    }

    const decodedToken = await auth.verifyIdToken(token);
    const userEmail = decodedToken.email || '';
    
    // Admin access: joejfiore@gmail.com always has full access
    const isOwner = userEmail === 'joejfiore@gmail.com';
    
    // Check if user has admin role via custom claims OR is the owner
    const isAdmin = isOwner || decodedToken.role === 'admin' || decodedToken.admin === true;
    
    if (!isAdmin) {
      return null;
    }
    
    return {
      uid: decodedToken.uid,
      email: userEmail,
      role: isOwner ? 'owner' : 'admin'
    };
  } catch (error) {
    console.error('Admin token verification failed:', error);
    return null;
  }
}

/**
 * Higher-order function for admin auth with HTTP method handlers
 * Usage: export const GET = withAdminAuth(async (req) => { ... });
 */
export function withAdminAuth<T extends unknown[]>(
  handler: (req: NextRequest, ...context: T) => Promise<NextResponse>
) {
  return async (req: NextRequest, ...context: T): Promise<NextResponse> => {
    try {
      const adminUser = await verifyAdminToken(req);
      
      if (!adminUser) {
        return NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 }
        );
      }
      
      return await handler(req, ...context);
    } catch (error) {
      console.error('Admin endpoint error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}
