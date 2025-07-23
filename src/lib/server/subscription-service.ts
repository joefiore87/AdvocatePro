import { getAdminFirestore } from '@/lib/firebase-admin-config';

export interface SubscriptionData {
  customerId: string;
  email: string;
  purchaseDate: string;
  expirationDate: string;
  active: boolean;
}

/**
 * Check if a user has active access
 * Server-side only function
 */
export async function checkUserAccess(email: string): Promise<boolean> {
  try {
    if (!email) return false;
    
    const db = getAdminFirestore();
    if (!db) {
      console.error('Firebase Admin not initialized');
      return false;
    }
    
    const subscriptionDoc = await db.collection('subscriptions').doc(email).get();
    
    if (!subscriptionDoc.exists) {
      return false;
    }
    
    const subscription = subscriptionDoc.data() as SubscriptionData;
    const now = new Date();
    const expirationDate = new Date(subscription.expirationDate);
    
    return subscription.active && now < expirationDate;
  } catch (error) {
    console.error('Error checking user access:', error);
    return false;
  }
}

/**
 * Get a user's subscription data
 * Server-side only function
 */
export async function getUserSubscription(email: string): Promise<SubscriptionData | null> {
  try {
    if (!email) return null;
    
    const db = getAdminFirestore();
    if (!db) {
      console.error('Firebase Admin not initialized');
      return null;
    }
    
    const docSnap = await db.collection('subscriptions').doc(email).get();
    
    if (docSnap.exists) {
      return docSnap.data() as SubscriptionData;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }
}

/**
 * Create or update a subscription
 * Server-side only function
 */
export async function createOrUpdateSubscription(data: SubscriptionData): Promise<void> {
  try {
    const db = getAdminFirestore();
    if (!db) {
      throw new Error('Firebase Admin not initialized');
    }
    
    await db.collection('subscriptions').doc(data.email).set(data);
  } catch (error) {
    console.error('Error saving subscription:', error);
    throw error;
  }
}
