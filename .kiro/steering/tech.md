---
inclusion: always
---

# Special Education Advocacy Toolkit - Development Guidelines

## Product Context
A Next.js web application helping parents advocate for children with special education needs through letter generation, profile management, and educational resources.

## Core Technical Stack
- **Next.js 15.3.3**: App Router only, server components by default
- **TypeScript**: Strict mode enabled, all code must be typed
- **Tailwind CSS**: Only styling method - no inline styles or CSS modules
- **Firebase**: Authentication (`src/lib/firebase.ts`) and Firestore
- **Stripe**: Payment processing in `src/app/api/stripe/`
- **shadcn/ui**: UI components from `src/components/ui/`
- **Genkit**: AI features in `src/ai/`

## Privacy-First Architecture
- **Sensitive Data**: Store user profiles in localStorage with encryption, never transmit without explicit consent
- **Cloud Storage**: Firebase only for user ID and subscription status
- **Data Export**: Implement JSON/PDF export functionality
- **Local Processing**: Letter generation and profile merging client-side only

## Mandatory Code Patterns

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
import { useState } from 'react';
```

### API Route Standards
```typescript
import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  // Define schema
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = schema.parse(body);
    // Implementation
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: "Message" }, { status: 400 });
  }
}
```

### File Organization
- **Components**: `src/components/ui/` (primitives), `src/components/` (features), `src/components/admin/` (admin)
- **API Routes**: `src/app/api/[feature]/route.ts`
- **Pages**: `src/app/[route]/page.tsx`
- **Types**: `src/lib/types.ts` or co-located
- **Hooks**: `src/hooks/use-[feature].tsx`

### Import Order
```typescript
// 1. React/Next.js
import { NextResponse } from 'next/server';
// 2. Third-party
import { z } from 'zod';
// 3. Internal (absolute paths)
import { auth } from '@/lib/firebase';
import type { UserProfile } from '@/lib/types';
```

## Content & Language Guidelines
- **Person-First Language**: "children with disabilities" not "disabled children"
- **Tone**: Supportive, empowering, professional but approachable
- **Legal Boundaries**: Provide information, never legal advice
- **Accessibility**: WCAG AA compliance required

## Security & Validation
- **Input Validation**: All API inputs use Zod schemas
- **Authentication**: Firebase Auth with middleware protection
- **Rate Limiting**: All public API endpoints
- **Data Sanitization**: All user inputs before storage
- **Stripe Security**: Webhook signature verification required

## Error Handling
- **API Routes**: Consistent JSON error format with proper status codes
- **Components**: Error boundaries with fallback UI
- **Async Operations**: Loading and error states for all operations
- **User Feedback**: Toast notifications via `src/hooks/use-toast.ts`

## State Management
- **Global State**: React Context (see `src/hooks/use-auth.tsx`)
- **Local State**: Custom hooks in `src/hooks/`
- **Persistence**: localStorage for preferences, Firebase for minimal user data
- **Sensitive Data**: Never store in client state or cloud without encryption

## Development Commands
```bash
npm run dev          # Local development
npm run typecheck    # Required before commits
npm run lint         # Code quality check
firebase deploy      # Production deployment
```

## Required Environment Variables
```
STRIPE_SECRET_KEY
NEXT_PUBLIC_FIREBASE_*
GENKIT_API_KEY
```