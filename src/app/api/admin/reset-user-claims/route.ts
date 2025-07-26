import { NextRequest, NextResponse } from 'next/server';
import { getAuthAdmin } from '@/lib/firebase-admin';
import { requireAdminAuth } from '@/lib/auth-middleware';

export async function POST(req: NextRequest) {
  try {
    // Require admin authentication
    const authError = await requireAdminAuth(req);
    if (authError) return authError;

    const { userEmail, resetToDefaults = true } = await req.json();

    if (!userEmail) {
      return NextResponse.json({ error: 'userEmail is required' }, { status: 400 });
    }

    const auth = await getAuthAdmin();
    if (!auth) {
      return NextResponse.json({ error: 'Firebase Admin not available' }, { status: 500 });
    }

    // Get user by email
    const user = await auth.getUserByEmail(userEmail);
    
    // Log current custom claims
    console.log(`Current custom claims for ${userEmail}:`, user.customClaims);

    if (resetToDefaults) {
      // Reset to default claims (no premium access)
      await auth.setCustomUserClaims(user.uid, {
        hasAccess: false,
        role: 'user',
        subscriptionStatus: 'none',
        updatedAt: Date.now()
      });

      console.log(`✅ Reset custom claims for ${userEmail} (UID: ${user.uid})`);
      
      return NextResponse.json({
        success: true,
        message: `Custom claims reset for ${userEmail}`,
        uid: user.uid,
        previousClaims: user.customClaims,
        newClaims: {
          hasAccess: false,
          role: 'user',
          subscriptionStatus: 'none',
          updatedAt: Date.now()
        }
      });
    } else {
      // Just return current claims without changing them
      return NextResponse.json({
        success: true,
        userEmail,
        uid: user.uid,
        currentClaims: user.customClaims || {}
      });
    }

  } catch (error) {
    console.error('Error managing user claims:', error);
    return NextResponse.json(
      { error: 'Failed to manage user claims' },
      { status: 500 }
    );
  }
}
