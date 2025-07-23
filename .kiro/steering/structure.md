# Project Structure

## Directory Organization

### Root Structure
- `.firebase/`: Firebase deployment artifacts
- `.next/`: Next.js build output (generated)
- `docs/`: Project documentation
- `node_modules/`: Dependencies (generated)
- `public/`: Static assets
- `src/`: Source code (main application code)

### Source Code (`src/`)
- `ai/`: AI integration with Genkit
  - `dev.ts`: Development setup for AI features
  - `genkit.ts`: Genkit configuration
- `app/`: Next.js App Router pages and API routes
  - `api/`: API endpoints including Stripe checkout
  - `login/`: Authentication pages
  - `purchase/`: Subscription purchase flow
  - `signup/`: User registration
  - `toolkit/`: Main application interface
  - `page.tsx`: Landing page
  - `layout.tsx`: Root layout
- `components/`: Reusable React components
  - `ui/`: UI primitives and base components
  - `advocacy-toolkit.tsx`: Main toolkit component
  - `educational-timeline.tsx`: Timeline curriculum component
  - `letter-library.tsx`: Letter templates component
  - `profile-form.tsx`: User profile management
- `hooks/`: Custom React hooks
  - `use-mobile.tsx`: Mobile detection
  - `use-profile.tsx`: Profile state management
  - `use-toast.ts`: Toast notifications
- `lib/`: Shared utilities and configuration
  - `curriculum.ts`: Educational content
  - `firebase.ts`: Firebase configuration
  - `stripe.ts`: Stripe integration
  - `templates.ts`: Letter templates
  - `types.ts`: TypeScript type definitions
  - `utils.ts`: Utility functions

## Code Organization Patterns

### Component Structure
- Components are organized by feature or domain
- UI components are separated from business logic
- Each component should have a single responsibility
- Shared UI components are in `components/ui/`

### Data Flow
- Firebase for authentication
- React context for state management (Profile context)
- Custom hooks for shared state and logic
- Local storage for user preferences

### Styling Approach
- Tailwind CSS for styling
- Custom theme configuration in `tailwind.config.ts`
- Component-specific styles using Tailwind classes
- Design tokens for consistent theming

### API Structure
- API routes in `app/api/` directory
- Server-side code for sensitive operations
- Client-side Firebase SDK for authentication
- Stripe integration for payments