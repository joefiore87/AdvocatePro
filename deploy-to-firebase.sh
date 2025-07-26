#!/bin/bash

echo "🚀 Deploying to Firebase App Hosting"
echo "==================================="
echo ""

# Check if we have Firebase CLI
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Please install it:"
    echo "npm install -g firebase-tools"
    exit 1
fi

# Check if service account key exists
if [ -f "service-account-key.json" ]; then
    echo "✅ Found service-account-key.json"
    echo "⚠️  Note: Service account key will NOT be deployed"
    echo "   You need to set environment variables in Firebase App Hosting"
    echo ""
fi

echo "📝 Environment variables needed in Firebase App Hosting:"
echo ""
echo "1. Go to Firebase Console > App Hosting > Your backend > Settings"
echo "2. Add these environment variables:"
echo ""
echo "STRIPE_SECRET_KEY=sk_live_..."
echo "STRIPE_WEBHOOK_SECRET=whsec_..."
echo "STRIPE_PRODUCT_ID=prod_..."
echo "STRIPE_PRICE_ID=price_..."
echo ""

if [ -f "service-account-key.json" ]; then
    echo "For Firebase Admin SDK, add ONE of these options:"
    echo ""
    echo "Option 1 - Environment variables (extract from service-account-key.json):"
    echo "FIREBASE_ADMIN_PROJECT_ID=advocate-empower"
    echo "FIREBASE_ADMIN_CLIENT_EMAIL=<from service account json>"
    echo "FIREBASE_ADMIN_PRIVATE_KEY=<from service account json>"
    echo ""
    echo "Option 2 - Use Google Cloud default credentials (recommended for production)"
    echo "Firebase App Hosting can use default credentials automatically"
fi

echo ""
echo "Press Enter to continue with deployment..."
read

# Deploy to Firebase App Hosting
echo "🔄 Starting deployment..."
firebase deploy --only apphosting

echo ""
echo "✅ Deployment initiated!"
echo ""
echo "Monitor deployment at:"
echo "https://console.firebase.google.com/project/advocate-empower/apphosting"
echo ""
