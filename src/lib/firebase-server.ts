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
let adminApp: admin.app.App;

// Function to initialize and get Firebase Admin (safe for builds and runtime)
export async function getAuthAdmin() {
  // Only initialize Admin SDK in a server environment (not during build time)
  if (typeof window !== 'undefined' || !process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
    console.warn('Admin SDK not initialized: Running in client or build environment');
    return null;
  }

  if (!adminApp) {
    try {
      adminApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
          clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
      console.log('Firebase Admin initialized successfully');
    } catch (error) {
      console.error('Error initializing Firebase Admin:', error);
      return null;
    }
  }
  return adminApp.auth();
}

export default firebaseApp;
