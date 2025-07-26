#!/usr/bin/env tsx

/**
 * Reset User Custom Claims Script
 * 
 * This script resets a user's Firebase custom claims to remove any premium access
 * left over from the Firebase Stripe Extension.
 * 
 * Usage: tsx scripts/reset-user-claims.ts <user-email>
 */

import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { credential } from 'firebase-admin';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function resetUserClaims(userEmail: string) {
  try {
    // Initialize Firebase Admin if not already initialized
    if (!getApps().length) {
      const serviceAccount = {
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY!.replace(/\\n/g, '\n'),
      };

      initializeApp({
        credential: credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID!,
      });
    }

    const auth = getAuth();
    
    // Get user by email
    const user = await auth.getUserByEmail(userEmail);
    
    console.log(`\n📧 User: ${userEmail}`);
    console.log(`🆔 UID: ${user.uid}`);
    console.log(`📋 Current custom claims:`, user.customClaims || {});
    
    // Reset to default claims (no premium access)
    const newClaims = {
      hasAccess: false,
      role: 'user',
      subscriptionStatus: 'none',
      updatedAt: Date.now()
    };
    
    await auth.setCustomUserClaims(user.uid, newClaims);
    
    console.log(`\n✅ Successfully reset custom claims for ${userEmail}`);
    console.log(`📋 New custom claims:`, newClaims);
    console.log(`\n🎯 User will now need to complete purchase to gain access.`);
    
  } catch (error) {
    console.error('❌ Error resetting user claims:', error);
    process.exit(1);
  }
}

// Get user email from command line arguments
const userEmail = process.argv[2];

if (!userEmail) {
  console.error('❌ Please provide a user email as an argument');
  console.log('Usage: tsx scripts/reset-user-claims.ts <user-email>');
  process.exit(1);
}

// Validate email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(userEmail)) {
  console.error('❌ Please provide a valid email address');
  process.exit(1);
}

console.log(`🔄 Resetting custom claims for: ${userEmail}`);
resetUserClaims(userEmail);
