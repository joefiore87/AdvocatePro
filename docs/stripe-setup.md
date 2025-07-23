# Stripe One-Time Payment Setup

This document explains how the one-time payment system is set up for the Special Education Advocacy Toolkit.

## Overview

The toolkit uses a one-time payment model where users pay $29.99 for one year of access. The payment is non-renewing, meaning users will need to manually purchase again after their access expires.

## Implementation Details

### 1. Stripe Configuration

- **Product**: "Special Education Advocacy Toolkit - 1 Year Access"
- **Price**: $29.99 USD (one-time)
- **Payment Link**: https://buy.stripe.com/8x2eVc0zQ06ldSMcChffy01

### 2. User Flow

1. User creates an account or logs in
2. If the user doesn't have an active subscription, they are redirected to the purchase page
3. User completes payment via Stripe
4. Stripe webhook notifies our application of the successful payment
5. Application records the purchase and sets an expiration date one year from purchase
6. User gains access to the toolkit for one year

### 3. Access Control

- Each time a user accesses the toolkit, we check if they have an active subscription
- If their subscription has expired, they are redirected to the purchase page
- A subscription status component shows users how many days they have remaining

### 4. Webhook Setup

To set up the webhook:

1. Go to the [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Enter your webhook URL: `https://your-domain.com/api/stripe/webhook`
4. Select the `checkout.session.completed` event
5. Copy the signing secret and add it to your `.env.local` file as `STRIPE_WEBHOOK_SECRET`

### 5. Testing

To test the payment flow:

1. Use Stripe's test cards (e.g., 4242 4242 4242 4242)
2. Complete a test purchase
3. Verify that the webhook receives the event
4. Check that the user's subscription is recorded in Firestore
5. Verify that the user can access the toolkit

## Important Files

- `src/app/api/stripe/webhook/route.ts`: Handles Stripe webhook events
- `src/lib/subscription.ts`: Utilities for checking subscription status
- `src/components/protected-route.tsx`: Protects routes based on subscription status
- `src/components/subscription-status.tsx`: Shows subscription details to users
- `src/app/purchase/page.tsx`: Purchase page with payment link