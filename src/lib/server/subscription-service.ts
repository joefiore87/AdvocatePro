import { getFirestore, doc, getDoc, setDoc } from 'firebase-admin/firestore';
import { getApp } from 'firebase-admin/app';

// Use the admin app initialized in auth-middleware.ts
const db = getFirestore(getApp());

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
    
    const subscriptionDoc = await getDoc(doc(db, 'subscriptions', email));
    
    if (!subscriptionDoc.exists()) {
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
    
    const docRef = doc(db, 'subscriptions', email);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
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
    await setDoc(doc(db, 'subscriptions', data.email), data);
  } catch (error) {
    console.error('Error saving subscription:', error);
    throw error;
  }
}