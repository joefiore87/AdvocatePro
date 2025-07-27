import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth as getClientAuth } from 'firebase/auth';
import admin from 'firebase-admin';

// Firebase client app initialization for server-side rendering compatibility
let firebaseApp: FirebaseApp;
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase client app only if it hasn't been initialized
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApp();
}

// Function to get client auth
export function getAuth() {
  return getClientAuth(firebaseApp);
}

// Firebase Admin SDK initialization for server-side operations
let adminApp: admin.app.App | null = null;

// Function to initialize and get Firebase Admin
export async function getAuthAdmin() {
  // Only initialize Admin SDK in a server environment
  if (typeof window !== 'undefined') {
    console.warn('Admin SDK not available in client environment');
    return null;
  }

  // Check for required environment variables
  if (!process.env.FIREBASE_ADMIN_PROJECT_ID) {
    console.error('Firebase Admin not configured - missing FIREBASE_ADMIN_PROJECT_ID');
    return null;
  }

  if (!process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
    console.error('Firebase Admin not configured - missing FIREBASE_ADMIN_PRIVATE_KEY');
    return null;
  }

  if (!process.env.FIREBASE_ADMIN_CLIENT_EMAIL) {
    console.error('Firebase Admin not configured - missing FIREBASE_ADMIN_CLIENT_EMAIL');
    return null;
  }

  if (!adminApp) {
    try {
      // Check if an app already exists to avoid duplicate initialization
      if (admin.apps.length > 0) {
        adminApp = admin.apps[0];
      } else {
        const serviceAccount = {
          projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
          clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
        } as admin.ServiceAccount;

        adminApp = admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
          databaseURL: `https://${process.env.FIREBASE_ADMIN_PROJECT_ID}-default-rtdb.firebaseio.com/`,
        });
      }
      
      console.log('Firebase Admin initialized successfully');
    } catch (error) {
      console.error('Error initializing Firebase Admin:', error);
      return null;
    }
  }
  
  return adminApp ? adminApp.auth() : null;
}

// Helper to obtain Firestore instance (after Admin initialization)
export async function getFirestoreAdmin() {
  // Ensure Admin SDK is initialized
  const auth = await getAuthAdmin();
  if (!auth) {
    return null;
  }
  try {
    // Initialize Firestore with the specific database
    const firestore = admin.firestore();
    // For named databases, we need to use the settings
    firestore.settings({
      databaseId: 'turboparent'
    });
    return firestore;
  } catch (error) {
    console.error('Error obtaining Firestore admin instance:', error);
    return null;
  }
}

// Export a function to get db instance with proper error handling
export function getDb() {
  if (typeof window !== 'undefined') {
    throw new Error('Firebase Admin not available on client side');
  }
  
  try {
    // Initialize admin if not already done
    if (admin.apps.length === 0) {
      const serviceAccount = {
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      } as admin.ServiceAccount;

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      });
    }
    
    const firestore = admin.firestore();
    firestore.settings({
      databaseId: 'turboparent'
    });
    return firestore;
  } catch (error) {
    console.error('Error initializing db:', error);
    throw error;
  }
}

// Helper function to get db with error handling for routes
export function getDbOrThrow() {
  try {
    const database = getDb();
    if (!database) {
      throw new Error('Firebase Admin not properly configured');
    }
    return database;
  } catch (error) {
    console.error('Error getting database instance:', error);
    throw new Error('Firebase Admin not properly configured');
  }
}

// Export a function to get db instance safely
export function getDbSafe() {
  try {
    return getDb();
  } catch (error) {
    console.error('Error getting db instance:', error);
    return null;
  }
}

// Export a direct db instance for convenience (with null fallback)
export const db = (() => {
  try {
    return getDb();
  } catch (error) {
    console.warn('Firebase Admin not available during build time:', error.message);
    return null;
  }
})();

export default firebaseApp;