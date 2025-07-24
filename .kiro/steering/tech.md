---
inclusion: always
---

# Technical Implementation Guidelines

## Stack Requirements
- **Next.js 15.3.3**: App Router only, server components by default
- **TypeScript**: Strict mode enabled, all code must be typed
- **Tailwind CSS**: Only styling method - no inline styles or CSS modules
- **Firebase Auth**: Authentication via `src/lib/firebase.ts`
- **Stripe**: Payment processing in `src/app/api/stripe/`
- **shadcn/ui**: UI components from `src/components/ui/`

## Mandatory Code Patterns

### Component Rules
- Server components by default, add `"use client"` only when necessary
- All props must have TypeScript interfaces
- UI primitives go in `src/components/ui/`
- Feature components in `src/components/` with descriptive names
- Admin components in `src/components/admin/`
- Always implement error boundaries for complex components

### API Route Standards
```typescript
// Required pattern for all API routes
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = schema.parse(body); // Always use Zod
    // Implementation
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: "Message" }, { status: 400 });
  }
}
```

### File Naming Conventions
- API routes: `src/app/api/[feature]/route.ts`
- Pages: `src/app/[route]/page.tsx`
- Layouts: `src/app/[route]/layout.tsx`
- Types: `src/lib/types.ts` or co-located `types.ts`
- Utilities: `src/lib/utils.ts`

### State Management Rules
- Use React Context for global state (reference `src/hooks/use-auth.tsx`)
- Custom hooks in `src/hooks/` for shared logic
- localStorage only for user preferences
- Firebase for persistent user data
- Never store sensitive data in client state

### Import Organization
```typescript
// 1. React/Next.js imports
import { NextResponse } from 'next/server';
// 2. Third-party libraries
import { z } from 'zod';
// 3. Internal imports (absolute paths)
import { auth } from '@/lib/firebase';
import type { UserProfile } from '@/lib/types';
```

## Required Validations
- All API inputs must use Zod schemas
- Client-side form validation with react-hook-form
- Environment variables must be validated at startup
- All user inputs sanitized before database storage

## Error Handling Standards
- API routes: Return consistent JSON error format
- Components: Use error boundaries and fallback UI
- Async operations: Always handle loading and error states
- User feedback: Use toast notifications from `src/hooks/use-toast.ts`

## Security Requirements
- Protected routes must use authentication middleware
- Rate limiting on all public API endpoints
- Input sanitization for all user data
- HTTPS only in production
- Stripe webhooks must verify signatures

## Development Workflow
```bash
npm run dev          # Local development
npm run typecheck    # Before any commit
npm run lint         # Code quality check
firebase deploy      # Production deployment
```