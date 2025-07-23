# Admin Setup Guide

This guide will help you set up the admin functionality for the Special Education Advocacy Toolkit.

## Prerequisites

- Firebase project with Firestore enabled
- Firebase Admin SDK service account key
- Node.js and npm installed

## Step 1: Environment Configuration

1. Copy `.env.local.example` to `.env.local`
2. Fill in all the required environment variables:

### Firebase Configuration
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```

### Firebase Admin SDK Configuration
```bash
FIREBASE_ADMIN_PROJECT_ID=your_firebase_project_id
FIREBASE_ADMIN_CLIENT_EMAIL=your_service_account_email
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----"
```

### Stripe Configuration
```bash
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
STRIPE_PRODUCT_ID=your_stripe_product_id
STRIPE_PRICE_ID=your_stripe_price_id
```

## Step 2: Firebase Admin SDK Setup

1. Go to your Firebase Console
2. Navigate to Project Settings > Service Accounts
3. Click "Generate new private key"
4. Download the JSON file
5. Extract the following values and add them to your `.env.local`:
   - `project_id` → `FIREBASE_ADMIN_PROJECT_ID`
   - `client_email` → `FIREBASE_ADMIN_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_ADMIN_PRIVATE_KEY`

## Step 3: Initialize Content

Run the content initialization script:

```bash
npm run init-content
```

This will create the default content structure in Firestore.

## Step 4: Create First Admin User

1. Create a user account through the normal signup process
2. Run the admin initialization script:

```bash
npm run init-admin
```

3. Enter the email address of the user you want to make an admin

## Step 5: Access Admin Panel

1. Sign in with your admin account
2. Navigate to `/admin` to access the admin panel
3. You can now manage content and view analytics

## Admin Features

### Content Management
- Edit homepage content
- Manage feature lists
- Update pricing information
- Real-time content updates

### User Management
- View user roles
- Promote users to admin
- Monitor user activity

### Security Features
- Role-based access control
- Rate limiting on API endpoints
- Authentication middleware
- Error boundaries

## Troubleshooting

### Common Issues

1. **"Unauthorized" error when accessing admin panel**
   - Verify your user has admin role in Firestore
   - Check Firebase Admin SDK configuration
   - Ensure you're signed in with the correct account

2. **Content not loading**
   - Run `npm run init-content` to initialize default content
   - Check Firestore security rules
   - Verify Firebase configuration

3. **Rate limiting errors**
   - Admin endpoints: 100 requests per 15 minutes
   - Public endpoints: 1000 requests per 15 minutes
   - Wait for the rate limit window to reset

### Support

For additional support, check the project documentation or contact the development team.