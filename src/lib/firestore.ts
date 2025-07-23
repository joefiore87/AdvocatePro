import { getAuth } from 'firebase/auth';

export interface SubscriptionData {
  customerId: string;
  email: string;
  purchaseDate: string;
  expirationDate: string;
  active: boolean;
}

export async function getUserSubscription(email: string): Promise<SubscriptionData | null> {
  try {
    if (!email) return null;
    
    // Get current user
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Get auth token
    const token = await user.getIdToken();
    
    // Call API to get subscription
    const response = await fetch('/api/subscription/get', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch subscription: ${response.status}`);
    }
    
    const { subscription } = await response.json();
    return subscription;
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }
}

// This function is only used by the webhook handler, which is server-side
// It should not be called from client-side code
export async function createOrUpdateSubscription(data: SubscriptionData): Promise<void> {
  throw new Error('This function should not be called from client-side code');
}