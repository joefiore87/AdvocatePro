import { NextRequest, NextResponse } from 'next/server';
import { getAuthAdmin } from '@/lib/firebase-admin';
import { withAdminAuth } from '@/lib/admin-auth';

async function handleResetUserClaims(req: NextRequest) {
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
}

export const POST = withAdminAuth(handleResetUserClaims);
