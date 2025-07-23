import admin from 'firebase-admin';

let adminApp: admin.app.App | null = null;

export function initializeFirebaseAdmin() {
  if (!adminApp && !admin.apps.length) {
    try {
      // Check if we have service account JSON file
      const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
      
      if (serviceAccountPath) {
        // Use service account JSON file
        const serviceAccount = require(serviceAccountPath);
        adminApp = admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
        console.log('Firebase Admin initialized with service account file');
      } else if (
        process.env.FIREBASE_ADMIN_PROJECT_ID &&
        process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
        process.env.FIREBASE_ADMIN_PRIVATE_KEY
      ) {
        // Use environment variables
        adminApp = admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
            clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
          }),
        });
        console.log('Firebase Admin initialized with environment variables');
      } else {
        console.error('Firebase Admin SDK credentials not found');
        return null;
      }
    } catch (error) {
      console.error('Error initializing Firebase Admin:', error);
      return null;
    }
  }
  
  return adminApp || admin.apps[0];
}

// Get the initialized admin app
export function getAdminApp() {
  if (!adminApp && !admin.apps.length) {
    return initializeFirebaseAdmin();
  }
  return adminApp || admin.apps[0];
}

// Export commonly used admin services
export function getAdminAuth() {
  const app = getAdminApp();
  return app ? app.auth() : null;
}

export function getAdminFirestore() {
  const app = getAdminApp();
  return app ? app.firestore() : null;
}
