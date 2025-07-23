import { getAuth } from 'firebase/auth';

export type UserRole = 'admin' | 'customer' | null;

/**
 * Get the role of a user by email
 */
export async function getUserRole(email: string): Promise<UserRole> {
  if (!email) return null;
  
  try {
    // Get current user
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Get auth token
    const token = await user.getIdToken();
    
    // Call API to get role
    const response = await fetch('/api/auth/get-role', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get role: ${response.status}`);
    }
    
    const { role } = await response.json();
    return role;
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
}

/**
 * Set the role for a user
 * This should only be called from admin interfaces
 */
export async function setUserRole(email: string, role: 'admin' | 'customer'): Promise<boolean> {
  if (!email) return false;
  
  try {
    // Get current user
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Get auth token
    const token = await user.getIdToken();
    
    // Call API to set role
    const response = await fetch('/api/auth/set-role', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, role })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to set role: ${response.status}`);
    }
    
    const { success } = await response.json();
    return success;
  } catch (error) {
    console.error('Error setting user role:', error);
    return false;
  }
}

/**
 * Check if a user is an admin
 */
export async function isAdmin(email: string): Promise<boolean> {
  const role = await getUserRole(email);
  return role === 'admin';
}

/**
 * Initialize the first admin user
 * This should be called once during setup
 */
export async function initializeAdminUser(email: string): Promise<boolean> {
  if (!email) return false;
  
  try {
    // Get current user
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Get auth token
    const token = await user.getIdToken();
    
    // Call API to initialize admin
    const response = await fetch('/api/auth/initialize-admin', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to initialize admin: ${response.status}`);
    }
    
    const { success } = await response.json();
    return success;
  } catch (error) {
    console.error('Error initializing admin user:', error);
    return false;
  }
}