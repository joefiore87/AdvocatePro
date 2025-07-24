import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/auth-middleware';
import { setUserRole } from '@/lib/server/roles-service';

export async function POST(req: NextRequest) {
  try {
    // Verify admin access
    const authError = await requireAdminAuth(req);
    if (authError) {
      return authError;
    }

    // Get request body
    const { userId, role } = await req.json();
    
    if (!userId || !role) {
      return NextResponse.json(
        { error: 'userId and role are required' },
        { status: 400 }
      );
    }

    // Set user role
    const success = await setUserRole(userId, role);
    
    if (success) {
      return NextResponse.json({ 
        success: true, 
        message: `Role ${role} assigned to user ${userId}` 
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to set user role' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error setting user role:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
