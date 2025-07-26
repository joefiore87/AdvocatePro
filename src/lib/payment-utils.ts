/**
 * Payment utilities with disable functionality
 */

export function isPaymentsEnabled(): boolean {
  return process.env.DISABLE_PAYMENTS !== 'true';
}

export function getStripeConfig() {
  if (!isPaymentsEnabled()) {
    return null;
  }
  
  return {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    secretKey: process.env.STRIPE_SECRET_KEY,
    productId: process.env.STRIPE_PRODUCT_ID,
    priceId: process.env.STRIPE_PRICE_ID,
  };
}

export function createPaymentDisabledResponse() {
  return {
    error: 'Payments are temporarily disabled for maintenance. Please try again later.',
    disabled: true
  };
}
