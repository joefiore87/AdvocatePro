# Design Document

## Overview

This design outlines the approach to fix the broken Firebase App Hosting deployment and establish it as the primary production site. The current setup shows a Firebase project "advocate-empower" with App Hosting configured for backend ID "turboparentpro", but the deployment is not working correctly. The solution involves diagnosing and fixing the App Hosting configuration, ensuring proper environment setup, and establishing reliable deployment processes.

## Architecture

### Current State Analysis
- **Firebase Project**: advocate-empower
- **App Hosting Backend ID**: turboparentpro  
- **Database**: turboparent (Firestore in us-east4)
- **Working Site**: advocate-empower.web.app (classic hosting)
- **Broken Site**: iepturboparentpro--... (App Hosting)

### Target Architecture
- **Primary Deployment**: Firebase App Hosting with backend ID "turboparentpro"
- **Build System**: Next.js with Turbopack for development
- **Database**: Existing Firestore "turboparent" database
- **Authentication**: Firebase Auth with existing configuration
- **Payment Processing**: Stripe integration maintained

## Components and Interfaces

### 1. Firebase App Hosting Configuration
**Purpose**: Configure and deploy the Next.js application on Firebase App Hosting

**Key Configuration**:
- Backend ID: turboparentpro
- Root directory: ./
- Build command: npm run build
- Start command: npm start
- Node.js runtime environment

**Environment Variables Required**:
- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN  
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- NEXT_PUBLIC_FIREBASE_APP_ID
- STRIPE_SECRET_KEY
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- STRIPE_WEBHOOK_SECRET

### 2. Build Process Integration
**Purpose**: Ensure the Next.js build works correctly in the App Hosting environment

**Components**:
- Next.js configuration (next.config.ts) optimized for App Hosting
- TypeScript compilation with strict mode
- Tailwind CSS processing
- Static asset optimization

**Build Validation**:
- TypeScript type checking must pass
- ESLint validation must pass
- All dependencies must resolve correctly
- Environment variables must be available at build time

### 3. Database Connection Verification
**Purpose**: Ensure Firestore connectivity works with App Hosting deployment

**Configuration**:
- Firestore database: turboparent
- Location: us-east4
- Security rules deployment
- Index configuration deployment

### 4. Authentication Flow Validation
**Purpose**: Verify Firebase Auth works correctly with App Hosting

**Components**:
- Firebase Auth configuration
- Custom claims for role-based access
- Session management
- Protected route middleware

## Data Models

### Environment Configuration
```typescript
interface AppHostingEnvironment {
  firebaseConfig: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
  stripeConfig: {
    secretKey: string;
    publishableKey: string;
    webhookSecret: string;
  };
}
```

### Deployment Status
```typescript
interface DeploymentStatus {
  backendId: string;
  status: 'building' | 'deployed' | 'failed';
  url?: string;
  buildLogs?: string[];
  lastDeployed?: Date;
}
```

## Error Handling

### Build Failures
- **Detection**: Monitor build process exit codes and logs
- **Common Issues**: Missing environment variables, TypeScript errors, dependency issues
- **Resolution**: Provide clear error messages and debugging steps
- **Fallback**: Maintain ability to rollback to previous working deployment

### Runtime Errors
- **Database Connection**: Implement retry logic for Firestore connections
- **Authentication**: Handle auth state changes gracefully
- **Payment Processing**: Ensure Stripe webhook validation works correctly

### Deployment Issues
- **Environment Variables**: Validate all required variables are set
- **Build Configuration**: Verify Next.js config is compatible with App Hosting
- **Resource Limits**: Monitor memory and CPU usage during builds

## Testing Strategy

### Pre-Deployment Testing
1. **Local Development**: Verify application works with `npm run dev`
2. **Build Validation**: Ensure `npm run build` completes successfully
3. **Type Checking**: Run `npm run typecheck` without errors
4. **Linting**: Execute `npm run lint` and resolve issues

### Post-Deployment Testing
1. **Smoke Tests**: Verify basic application functionality
2. **Authentication Flow**: Test login/logout and protected routes
3. **Database Operations**: Verify CRUD operations work correctly
4. **Payment Integration**: Test Stripe payment flow
5. **Performance**: Monitor page load times and responsiveness

### Integration Testing
1. **Firebase Services**: Test Auth, Firestore, and hosting integration
2. **External APIs**: Verify Stripe webhook handling
3. **User Workflows**: Test complete user journeys
4. **Admin Functions**: Verify admin dashboard functionality

### Rollback Testing
1. **Deployment Rollback**: Ensure ability to revert to previous version
2. **Database Migration**: Test any schema changes can be reversed
3. **Configuration Rollback**: Verify environment variable changes can be undone