import { getAuthAdmin } from '@/lib/firebase-admin';

export async function setUserRole(email: string, role: string) {
  const auth = await getAuthAdmin();
  if (!auth) {
    console.error('Firebase Admin not initialized');
    return null;
  }

  try {
    // Get user by email
    const user = await auth.getUserByEmail(email);
    
    // Set custom claims
    await auth.setCustomUserClaims(user.uid, { role });
    
    console.log(`Set role ${role} for user ${email}`);
    return { success: true, uid: user.uid };
  } catch (error) {
    console.error('Error setting user role:', error);
    throw error;
  }
}

export async function getUserRole(email: string): Promise<string | null> {
  const auth = await getAuthAdmin();
  if (!auth) {
    console.error('Firebase Admin not initialized');
    return null;
  }

  try {
    const user = await auth.getUserByEmail(email);
    return user.customClaims?.role || null;
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
}
