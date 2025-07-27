# Project Structure

## Root Directory
- **src/** - Main application source code
- **scripts/** - Utility scripts for setup and deployment
- **docs/** - Project documentation
- **dataconnect/** - Firebase Data Connect configuration
- **.firebase/** - Firebase deployment artifacts
- **firebase.json** - Firebase project configuration
- **firestore.rules** - Firestore security rules

## Source Code Organization (`src/`)

### Application Routes (`src/app/`)
- **app/** - Next.js App Router pages and layouts
  - **admin/** - Admin dashboard and management
  - **api/** - API routes for backend functionality
  - **dashboard/** - User dashboard
  - **login/, signup/** - Authentication pages
  - **purchase/, success/** - Payment flow
  - **toolkit/** - Main application features

### Components (`src/components/`)
- **ui/** - Reusable UI components (shadcn/ui based)
- **admin/** - Admin-specific components
- **advocacy-toolkit.tsx** - Main toolkit component
- **profile-form.tsx** - Student profile management
- **letter-library.tsx** - Letter template management

### Library Code (`src/lib/`)
- **firebase.ts, firebase-admin.ts** - Firebase configuration
- **stripe.ts, stripe-client.ts** - Stripe integration
- **types.ts** - TypeScript type definitions
- **auth-middleware.ts** - Authentication middleware
- **content-service.ts** - Content management
- **validation.ts** - Zod schemas and validation

### Hooks (`src/hooks/`)
- **use-auth.tsx** - Authentication state management
- **use-profile.tsx** - Profile data management
- **use-toast.ts** - Toast notifications

## Key Conventions

### File Naming
- React components: PascalCase (e.g., `ProfileForm.tsx`)
- Utility files: kebab-case (e.g., `auth-middleware.ts`)
- API routes: lowercase (e.g., `route.ts`)

### Import Aliases
- `@/` - Points to `src/` directory
- Use absolute imports with `@/` prefix for all internal imports

### Component Structure
- UI components follow shadcn/ui patterns with CVA for variants
- Components use forwardRef for proper ref handling
- TypeScript interfaces for all component props

### API Routes
- Located in `src/app/api/`
- Follow REST conventions
- Use middleware for authentication and validation
- Separate admin routes under `api/admin/`

### Database Structure
- Firestore collections: users, profiles, letterTemplates, premiumContent
- Use TypeScript interfaces for all data models
- Validation with Zod schemas

### Authentication Flow
- Firebase Auth for user management
- Custom claims for role-based access (admin, premium)
- Protected routes with middleware
- Stripe integration for subscription management