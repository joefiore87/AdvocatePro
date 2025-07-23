---
inclusion: always
---

# Special Education Advocacy Toolkit Guidelines

## Product Overview
The Special Education Advocacy Toolkit helps parents advocate for children with special education needs through letter generation, profile management, and educational resources.

## Technical Stack
- **Framework**: Next.js 15.3.3 (App Router) with React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom theme
- **Backend**: Firebase (Authentication, Firestore)
- **Payment**: Stripe integration
- **AI**: Genkit for AI features

## Code Conventions

### Architecture Patterns
- Follow Next.js App Router conventions
- Use server components where appropriate
- Keep API routes in `src/app/api/` directory
- Implement server-side code for sensitive operations
- Use React context for state management

### Component Structure
- Components should have a single responsibility
- Place shared UI components in `components/ui/`
- Feature-specific components in appropriate subdirectories
- Use custom hooks for shared logic
- Implement proper TypeScript typing

### Styling Guidelines
- Use Tailwind CSS classes exclusively
- Follow design tokens in `tailwind.config.ts`
- Maintain consistent spacing and layout patterns
- Ensure responsive design for all components
- Implement WCAG AA accessibility standards

### Data Handling
- Store sensitive user data locally when possible
- Use Firebase for authentication and cloud storage
- Implement proper data validation with Zod
- Follow data privacy best practices
- Provide data export/import functionality

## Product Conventions

### Language & Tone
- Use person-first language (e.g., "children with disabilities" not "disabled children")
- Maintain supportive, empowering tone in all content
- Avoid educational jargon without explanation
- Be clear, concise, and direct in all interfaces

### Feature Implementation
- Profile Management: Store user profiles securely
- Letter Generation: Use templates with profile data
- Educational Content: Organize in timeline-based curriculum
- Authentication: Implement Firebase auth flows
- Payment: Follow Stripe best practices

### UI/UX Guidelines
- Progressive disclosure for complex features
- Consistent navigation patterns
- Clear feedback for all user actions
- Full accessibility compliance
- Mobile-responsive design

## Development Workflow
- Use `npm run dev` for local development
- Run `npm run lint` and `npm run typecheck` before commits
- Deploy with `firebase deploy`
- Test Stripe integrations in test mode
- Document API changes in `docs/API_DOCUMENTATION.md`

## Required Environment Variables
- `STRIPE_SECRET_KEY`: For payment processing
- `NEXT_PUBLIC_FIREBASE_*`: Firebase configuration
- `GENKIT_API_KEY`: For AI features

## Content Guidelines
- Educational content must be factually accurate
- Letter templates should follow advocacy best practices
- All content should be reviewed for clarity and sensitivity
- Avoid making legal claims or providing legal advice