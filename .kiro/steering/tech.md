# Technology Stack

## Core Framework
- **Next.js 15.3.3** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety throughout the codebase
- **Tailwind CSS** - Utility-first CSS framework

## Backend & Database
- **Firebase** - Authentication, Firestore database, hosting
- **Firebase Admin SDK** - Server-side operations
- **Stripe** - Payment processing and subscription management

## UI Components & Styling
- **Radix UI** - Headless component primitives
- **shadcn/ui** - Pre-built component library
- **Lucide React** - Icon library
- **Framer Motion** - Animation library
- **class-variance-authority (CVA)** - Component variant management

## Development Tools
- **Genkit** - AI integration framework
- **Zod** - Schema validation
- **React Hook Form** - Form management
- **tsx** - TypeScript execution for scripts

## Common Commands

### Development
```bash
npm run dev              # Start development server on port 9002 with Turbopack
npm run genkit:dev       # Start Genkit AI development server
npm run genkit:watch     # Start Genkit with file watching
```

### Build & Deploy
```bash
npm run build           # Build production application
npm run start           # Start production server
npm run typecheck       # Run TypeScript type checking
npm run lint            # Run ESLint
```

### Database & Setup
```bash
npm run init-content    # Initialize content in database
npm run init-admin      # Initialize admin user
```

### Firebase Deployment
```bash
firebase deploy                    # Deploy all services
firebase deploy --only hosting    # Deploy hosting only
firebase deploy --only functions  # Deploy functions only
scripts/deploy-all.sh             # Full deployment script
```

## Environment Variables
- Firebase configuration (NEXT_PUBLIC_FIREBASE_*)
- Stripe keys (STRIPE_SECRET_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
- Service account credentials for Firebase Admin