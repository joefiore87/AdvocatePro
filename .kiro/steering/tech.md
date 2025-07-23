# Technical Stack & Build System

## Core Technologies
- **Framework**: Next.js 15.3.3 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom theme configuration
- **Authentication**: Firebase Authentication
- **Payment Processing**: Stripe
- **AI Integration**: Genkit for AI features
- **UI Components**: Radix UI primitives with custom styling

## Key Libraries
- **UI Components**: Radix UI components with shadcn/ui patterns
- **Forms**: React Hook Form with Zod validation
- **Data Visualization**: Recharts
- **Animation**: Framer Motion
- **File Handling**: JSZip, File-Saver
- **Date Handling**: date-fns
- **Icons**: Lucide React

## Project Structure
- Next.js App Router architecture
- Component-based UI organization
- Custom hooks for shared functionality
- Tailwind for styling with consistent design tokens

## Common Commands

### Development
```bash
# Start development server with Turbopack
npm run dev

# Start Genkit AI development
npm run genkit:dev

# Watch mode for Genkit
npm run genkit:watch
```

### Build & Deployment
```bash
# Build the application
npm run build

# Start production server
npm run start
```

### Quality & Testing
```bash
# Run linting
npm run lint

# Type checking
npm run typecheck
```

### Firebase Deployment
```bash
# Deploy to Firebase
firebase deploy
```

## Environment Variables
- `STRIPE_SECRET_KEY`: Required for Stripe integration
- Firebase configuration is stored in `src/lib/firebase.ts`