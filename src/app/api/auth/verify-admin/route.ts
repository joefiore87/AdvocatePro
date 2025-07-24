import { NextRequest, NextResponse } from 'next/server';
import { getAuthAdmin } from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ isAdmin: false, error: 'No auth token' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const auth = await getAuthAdmin();
    
    if (!auth) {
      console.error('Firebase Admin not initialized');
      return NextResponse.json({ isAdmin: false, error: 'Service temporarily unavailable' }, { status: 503 });
    }

    try {
      const decodedToken = await auth.verifyIdToken(token);
      const user = await auth.getUser(decodedToken.uid);
      
      // Check custom claims for admin role
      const isAdmin = user.customClaims?.role === 'admin';
      
      return NextResponse.json({ 
        isAdmin, 
        uid: user.uid,
        email: user.email 
      });
    } catch (error) {
      console.error('Error verifying token:', error);
      return NextResponse.json({ isAdmin: false, error: 'Invalid token' }, { status: 401 });
    }
  } catch (error) {
    console.error('Error in verify-admin:', error);
    return NextResponse.json({ isAdmin: false, error: 'Internal error' }, { status: 500 });
  }
}
