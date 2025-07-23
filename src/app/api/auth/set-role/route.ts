import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAccess } from '@/lib/auth-middleware';
import { setUserRole } from '@/lib/server/roles-service';

export async function POST(req: NextRequest) {
  try {
    // Verify admin access
    const admin = await verifyAdminAccess(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get request body
    const { email, role } = await req.json();
    
    if (!email || !role) {
      return NextResponse.json({ error: 'Email and role required' }, { status: 400 });
    }

    // Validate role
    const validRoles = ['user', 'admin'];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Set the role
    const result = await setUserRole(email, role);
    
    return NextResponse.json({ 
      success: true, 
      message: `Role ${role} set for ${email}`,
      uid: result.uid 
    });

  } catch (error: any) {
    console.error('Error setting role:', error);
    
    if (error.code === 'auth/user-not-found') {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to set role',
      details: error.message 
    }, { status: 500 });
  }
}
