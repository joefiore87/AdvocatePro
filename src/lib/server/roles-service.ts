import { getFirestore, doc, getDoc, setDoc } from 'firebase-admin/firestore';
import { getApp } from 'firebase-admin/app';

// Use the admin app initialized in auth-middleware.ts
const db = getFirestore(getApp());

export type UserRole = 'admin' | 'customer' | null;

/**
 * Get the role of a user by email
 * Server-side only function
 */
export async function getUserRole(email: string): Promise<UserRole> {
  if (!email) return null;
  
  try {
    const userDoc = await getDoc(doc(db, 'users', email));
    
    if (!userDoc.exists()) {
      return null;
    }
    
    const userData = userDoc.data();
    return (userData.role as UserRole) || 'customer';
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
}

/**
 * Set the role for a user
 * Server-side only function
 */
export async function setUserRole(email: string, role: 'admin' | 'customer'): Promise<boolean> {
  if (!email) return false;
  
  try {
    await setDoc(doc(db, 'users', email), { role }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error setting user role:', error);
    return false;
  }
}

/**
 * Check if a user is an admin
 * Server-side only function
 */
export async function isAdmin(email: string): Promise<boolean> {
  const role = await getUserRole(email);
  return role === 'admin';
}

/**
 * Log admin access attempts for security monitoring
 * Server-side only function
 */
export async function logAdminAccessAttempt(email: string, success: boolean, ip?: string): Promise<void> {
  try {
    await setDoc(doc(db, 'adminAccessLogs', `${Date.now()}_${email}`), {
      email,
      timestamp: new Date().toISOString(),
      success,
      ip: ip || 'unknown',
    });
  } catch (error) {
    console.error('Error logging admin access attempt:', error);
  }
}