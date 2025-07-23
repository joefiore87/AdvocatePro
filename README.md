# Special Education Advocacy Toolkit

A web application designed to help parents advocate for their children with special education needs. It provides tools for creating professional advocacy letters, managing profiles, and accessing educational resources about the special education process.

## Features

- **Profile Management**: Create and manage detailed advocacy profiles for children
- **Letter Generation**: Generate professional advocacy letters using templates and profile data
- **Educational Content**: Access a timeline-based curriculum about the special education process
- **Data Privacy**: All user data remains local, with import/export functionality for data portability
- **One-Time Payment**: $29.99 for one year of access (non-renewing)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase account
- Stripe account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Add your Stripe and Firebase credentials

4. Run the development server:
   ```bash
   npm run dev
   ```

### Stripe Setup

1. Create a product in Stripe called "Special Education Advocacy Toolkit - 1 Year Access"
2. Create a price for this product at $29.99 USD (one-time)
3. Create a payment link for this price
4. Set up a webhook in Stripe Dashboard:
   - Endpoint: `https://your-domain.com/api/stripe/webhook`
   - Events: `checkout.session.completed`
5. Add the webhook secret to your `.env.local` file

### Firebase Setup

1. Create a Firebase project
2. Enable Authentication with email/password
3. Create a Firestore database
4. Add your Firebase configuration to `src/lib/firebase.ts`

## Deployment

Deploy to Firebase:

```bash
npm run build
firebase deploy
```

## License

This project is proprietary and not licensed for public use.

## Documentation

For more information, see the documentation in the `docs` folder:
- [Stripe Setup](docs/stripe-setup.md)