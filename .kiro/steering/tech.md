---
inclusion: always
---

# Special Education Advocacy Toolkit - Technical Guidelines

## 🚨 CRITICAL: Authentication Bug Fix Required
All protected API routes currently have a bug - they expect `email` parameter but receive `Authorization` header. Use this exact pattern:

```typescript
const token = request.headers.get('authorization')?.replace('Bearer ', '');
const decodedToken = await admin.auth().verifyIdToken(token);
const userEmail = decodedToken.email;
```

## Required Tech Stack
- **Next.js 15.3.3**: App Router only, server components by default
- **TypeScript**: Strict mode with complete typing
- **Tailwind CSS**: Only styling method (no inline styles/CSS modules)
- **Firebase**: Auth + Firestore (`src/lib/firebase.ts`)
- **Stripe**: Payments (`src/app/api/stripe/`)
- **shadcn/ui**: UI components (`src/components/ui/`)
- **Zod**: All API validation required

## Privacy-First Architecture (NON-NEGOTIABLE)
- **Sensitive Data**: localStorage only, never transmit without explicit consent
- **Cloud Storage**: Firebase stores ONLY user ID + subscription status  
- **Letter Generation**: Client-side only using localStorage profile data
- **Profile Data**: Never send to server without user consent

## Mandatory Code Patterns

### API Route Template
```typescript
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { admin } from '@/lib/firebase-admin';

const schema = z.object({ /* define schema */ });

export async function POST(request: Request) {
  try {
    // CRITICAL: Use authentication pattern above for protected routes
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userEmail = decodedToken.email;
    
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
// Server component (default) - fully typed interfaces
interface ComponentProps {
  children: React.ReactNode;
  data: UserProfile;
}

export default function Component({ children, data }: ComponentProps) {
  return <div className="space-y-4">{children}</div>;
}

// Client component only when needed
"use client";
```

### Import Order (Enforced)
```typescript
// 1. React/Next.js imports
import { NextResponse } from 'next/server';
// 2. Third-party libraries  
import { z } from 'zod';
// 3. Internal imports (use @/ absolute paths)
import { auth } from '@/lib/firebase';
import type { UserProfile } from '@/lib/types';
```

## File Organization (Strict)
- **Components**: `src/components/ui/` (primitives), `src/components/` (features), `src/components/admin/` (admin only)
- **API Routes**: `src/app/api/[feature]/route.ts` 
- **Pages**: `src/app/[route]/page.tsx`
- **Types**: `src/lib/types.ts` (centralized) or co-located when feature-specific
- **Hooks**: `src/hooks/use-[feature].tsx`

## Content & Language Rules
- **Person-First Language**: "children with disabilities" NOT "disabled children" (mandatory)
- **Tone**: Supportive, empowering, professional but approachable
- **Legal Boundaries**: Provide information, NEVER legal advice
- **Accessibility**: WCAG AA compliance required for all components

## Security & Validation (Required)
- **Input Validation**: All API inputs must use Zod schemas
- **Authentication**: Firebase Auth with proper token verification (use pattern above)
- **Error Handling**: Never expose sensitive information in responses
- **Data Sanitization**: All user inputs before storage or processing

## Development Workflow
```bash
npm run dev          # Local development
npm run typecheck    # Required before commits  
npm run lint         # Code quality check
firebase deploy      # Production deployment
```

## Action Priority for AI Assistant
1. **FIRST**: Fix authentication bug in protected API routes (use pattern above)
2. **THEN**: Enhance existing architecture (never rebuild from scratch)
3. **ALWAYS**: Maintain privacy-first data handling
4. **NEVER**: Store sensitive user data in cloud without explicit consent