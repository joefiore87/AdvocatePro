---
inclusion: always
---

# Special Education Advocacy Toolkit - Product Guidelines

## Product Context
A Next.js web application helping parents advocate for children with special education needs through letter generation, profile management, and educational resources.

## Core Architecture Principles
- **Privacy-First**: Store sensitive user data locally (localStorage/IndexedDB), never transmit without explicit consent
- **Progressive Enhancement**: Core features work without JavaScript, enhanced with React
- **Accessibility-First**: WCAG AA compliance required for all components
- **Mobile-Responsive**: Design for mobile-first, enhance for desktop

## Language & Content Conventions
- **Person-First Language**: Always use "children with disabilities" not "disabled children"
- **Tone**: Supportive, empowering, professional but approachable
- **Terminology**: Explain special education jargon, use plain language
- **Legal Boundaries**: Provide information, never legal advice or guarantees

## Feature Implementation Rules

### Profile Management
- Store profiles in localStorage with encryption
- Implement data export (JSON/PDF) and import functionality
- Never auto-save sensitive data to cloud without explicit user action
- Validate all profile data with Zod schemas

### Letter Generation
- Use template system in `src/lib/templates.ts`
- Merge profile data with templates client-side only
- Provide preview before generation
- Support PDF export with proper formatting

### Authentication & Payments
- Firebase Auth for user accounts (non-sensitive data only)
- Stripe for subscription management
- Separate authenticated features from core advocacy tools
- Graceful degradation when not authenticated

## UI/UX Implementation Standards
- Use shadcn/ui components consistently
- Implement loading states for all async operations
- Provide clear error messages with actionable next steps
- Use progressive disclosure for complex forms
- Ensure keyboard navigation works throughout

## Code Style Requirements
- TypeScript strict mode enabled
- Use React Server Components where appropriate
- Implement proper error boundaries
- Follow Next.js App Router patterns
- Use Tailwind CSS classes, avoid inline styles

## Data Security Rules
- Never log sensitive user data
- Use HTTPS for all external requests
- Implement proper input validation and sanitization
- Store minimal data in Firebase (user ID, subscription status only)
- Provide clear data deletion options

## Content Creation Guidelines
- Educational content must be factually accurate
- Cite authoritative sources (IDEA, state regulations)
- Review all templates with special education professionals
- Use inclusive language throughout
- Avoid making promises about outcomes