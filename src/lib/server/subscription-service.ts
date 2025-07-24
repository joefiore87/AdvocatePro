// Subscription service utilities leveraging consolidated Firebase Admin SDK
import { getFirestoreAdmin } from '@/lib/firebase-admin';

export interface SubscriptionData {
  customerId: string;
  email: string;
  subscriptionId: string;
  status: string; // e.g. active, canceled, past_due
  currentPeriodEnd: Date;
  priceId: string;
}

/**
 * Check if a user has active access
 * Server-side only function
 */
export async function hasValidSubscription(email: string): Promise<boolean> {
  try {
    if (!email) return false;
    
    const db = await getFirestoreAdmin();
    if (!db) {
      console.error('Firebase Admin not initialized');
      return false;
    }
    
    const subscriptionDoc = await db.collection('subscriptions').doc(email).get();
    
    if (!subscriptionDoc.exists) {
      return false;
    }
    
    const sub = subscriptionDoc.data() as SubscriptionData;
    const now = new Date();
    const periodEnd = sub.currentPeriodEnd instanceof Date
      ? sub.currentPeriodEnd
      : (sub.currentPeriodEnd as any).toDate?.() ?? new Date(sub.currentPeriodEnd);
    
    return sub.status === 'active' && periodEnd > now;
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
    
    const db = await getFirestoreAdmin();
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
    const db = await getFirestoreAdmin();
    if (!db) {
      throw new Error('Firebase Admin not initialized');
    }
    
    await db.collection('subscriptions').doc(data.email).set(data);
  } catch (error) {
    console.error('Error saving subscription:', error);
    throw error;
  }
}
