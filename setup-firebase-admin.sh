#!/bin/bash

echo "🔐 Firebase Admin SDK Setup Script"
echo "================================="
echo ""

# Check if service account file exists
if [ ! -f "service-account-key.json" ]; then
    echo "❌ Error: service-account-key.json not found!"
    echo ""
    echo "Please follow these steps:"
    echo "1. Go to Firebase Console: https://console.firebase.google.com/project/advocate-empower/settings/serviceaccounts/adminsdk"
    echo "2. Click 'Generate new private key'"
    echo "3. Save the file as 'service-account-key.json' in this directory"
    echo ""
    exit 1
fi

echo "✅ Found service-account-key.json"
echo ""

# Extract values from the JSON file
CLIENT_EMAIL=$(cat service-account-key.json | grep -o '"client_email": "[^"]*' | grep -o '[^"]*$')
PRIVATE_KEY=$(cat service-account-key.json | grep -o '"private_key": "[^"]*' | sed 's/"private_key": "//g')

echo "📝 Add these to your .env.local file:"
echo ""
echo "# Firebase Admin SDK Configuration"
echo "FIREBASE_ADMIN_PROJECT_ID=advocate-empower"
echo "FIREBASE_ADMIN_CLIENT_EMAIL=$CLIENT_EMAIL"
echo "FIREBASE_ADMIN_PRIVATE_KEY=\"$PRIVATE_KEY\""
echo ""
echo "Or use the service account file directly by adding:"
echo "FIREBASE_SERVICE_ACCOUNT_PATH=./service-account-key.json"
echo ""
echo "⚠️  IMPORTANT: Add service-account-key.json to .gitignore!"
echo ""

# Check if it's already in .gitignore
if ! grep -q "service-account-key.json" .gitignore; then
    echo "Adding service-account-key.json to .gitignore..."
    echo -e "\n# Firebase service account key\nservice-account-key.json" >> .gitignore
    echo "✅ Added to .gitignore"
fi

echo ""
echo "🚀 Next steps:"
echo "1. Copy the environment variables above to your .env.local"
echo "2. Restart your development server"
echo "3. Test the webhook at: POST /api/stripe/webhook"
echo ""
