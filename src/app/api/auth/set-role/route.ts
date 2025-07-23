import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAccess } from '@/lib/auth-middleware';
import { setUserRole } from '@/lib/server/roles-service';
import { rateLimiters } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = await rateLimiters.auth(req);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    // Verify admin access
    const user = await verifyAdminAccess(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse request body
    const body = await req.json();
    const { email, role } = body;
    
    // Validate request
    if (!email || !role) {
      return NextResponse.json(
        { error: 'Email and role are required' },
        { status: 400 }
      );
    }
    
    if (role !== 'admin' && role !== 'customer') {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }
    
    // Set user role
    const success = await setUserRole(email, role);
    
    return NextResponse.json({ success });
  } catch (error) {
    console.error('Error setting user role:', error);
    
    return NextResponse.json(
      { error: 'Failed to set user role' },
      { status: 500 }
    );
  }
}