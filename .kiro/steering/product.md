---
inclusion: always
---

# Special Education Advocacy Toolkit - AI Assistant Guidelines

## 🚨 CRITICAL AUTHENTICATION BUG - PRIORITY FIX
**Issue**: API routes expect `email` parameter but client sends `Authorization` header with Firebase token

**Required Fix Pattern for ALL Protected API Routes:**
```typescript
const token = request.headers.get('authorization')?.replace('Bearer ', '');
const decodedToken = await admin.auth().verifyIdToken(token);
const userEmail = decodedToken.email;
```

## Product Context
Next.js application for special education advocacy with letter generation, profile management, and educational resources. **CRITICAL**: Use person-first language ("children with disabilities" not "disabled children") and never provide legal advice.

## Required Tech Stack
- **Next.js 15.3.3**: App Router only, server components by default
- **TypeScript**: Strict mode - all code must be fully typed
- **Tailwind CSS**: ONLY styling method - never use inline styles or CSS modules
- **Firebase**: Auth + Firestore (`src/lib/firebase.ts`)
- **Stripe**: Payments (`src/app/api/stripe/`)
- **shadcn/ui**: UI components (`src/components/ui/`)
- **Zod**: All API validation required

## Privacy-First Rules (NON-NEGOTIABLE)
- **Sensitive Data**: Store user profiles in localStorage only, never transmit without explicit consent
- **Cloud Storage**: Firebase stores ONLY user ID and subscription status
- **Processing**: Letter generation and profile merging must be client-side only
- **Encryption**: Encrypt sensitive data in localStorage

## Mandatory Code Patterns

### API Route Structure
```typescript
import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({ /* define schema */ });

export async function POST(request: Request) {
  try {
    // Authentication for protected routes
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    const body = await request.json();
    const data = schema.parse(body);
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: "Message" }, { status: 400 });
  }
}
```

### Component Structure
```typescript
// Server component (default)
interface ComponentProps {
  children: React.ReactNode;
  data: UserProfile;
}

export default function Component({ children, data }: ComponentProps) {
  return <div className="space-y-4">{children}</div>;
}

// Client component (when needed)
"use client";
```

### File Organization
- **Components**: `src/components/ui/` (primitives), `src/components/` (features)
- **API Routes**: `src/app/api/[feature]/route.ts`
- **Pages**: `src/app/[route]/page.tsx`
- **Hooks**: `src/hooks/use-[feature].tsx`
- **Types**: `src/lib/types.ts`

## Content & Language Rules
- **Person-First Language**: "children with disabilities" NOT "disabled children"
- **Tone**: Supportive, empowering, professional but approachable
- **Legal Boundaries**: Provide information, NEVER legal advice
- **Accessibility**: WCAG AA compliance required for all components

## Security & Validation
- **Input Validation**: All API inputs use Zod schemas
- **Authentication**: Firebase Auth with proper token verification
- **Error Handling**: Never expose sensitive information in responses
- **Data Sanitization**: All user inputs before storage

## Development Commands
```bash
npm run dev          # Local development
npm run typecheck    # Required before commits
npm run lint         # Code quality check
firebase deploy      # Production deployment
```

**CRITICAL**: Fix authentication bug first, then maintain existing high-quality architecture. Do NOT rebuild - enhance existing structure.