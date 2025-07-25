#!/bin/bash

echo "🚀 Deploying AdvocatePro Database & Security Updates..."

# Check if we're in the right directory
if [ ! -f "firebase.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check if user is logged in to Firebase
if ! firebase projects:list >/dev/null 2>&1; then
    echo "❌ Error: Please login to Firebase CLI first"
    echo "Run: firebase login"
    exit 1
fi

echo "1️⃣ Migrating content to premium structure..."
node scripts/migrate-premium-content.js

echo "2️⃣ Deploying Firestore security rules..."
firebase deploy --only firestore:rules

echo "3️⃣ Deploying Firestore indexes..."
firebase deploy --only firestore:indexes

echo "4️⃣ Deploying functions and hosting..."
firebase deploy --only functions,hosting

echo "✅ Deployment completed successfully!"
echo ""
echo "📋 What was deployed:"
echo "• ✅ Premium content structure (letterTemplates, educationalModules moved to premiumContent)"
echo "• ✅ Sample templates created for public access"
echo "• ✅ Enhanced security rules with custom claims support"
echo "• ✅ Compound indexes for optimal performance"
echo "• ✅ Updated webhook for subscription management"
echo ""
echo "🔄 Next steps:"
echo "1. Test the authentication flow"
echo "2. Test subscription purchase and access"
echo "3. Verify premium content protection"
echo "4. Test student profile and letter generation"
echo ""
echo "🎉 Your AdvocatePro system is now fully upgraded!"
