import { getAuth } from 'firebase/auth';

export interface SubscriptionData {
  customerId: string;
  email: string;
  purchaseDate: string;
  expirationDate: string;
  active: boolean;
}

export async function checkUserAccess(email: string): Promise<boolean> {
  try {
    if (!email) return false;
    
    // Get current user
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Get auth token
    const token = await user.getIdToken();
    
    // Call API to check access
    const response = await fetch('/api/subscription/check-access', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to check access: ${response.status}`);
    }
    
    const { hasAccess } = await response.json();
    return hasAccess;
  } catch (error) {
    console.error('Error checking user access:', error);
    return false;
  }
}

export function getRemainingDays(expirationDateStr: string): number {
  const now = new Date();
  const expirationDate = new Date(expirationDateStr);
  const diffTime = expirationDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}