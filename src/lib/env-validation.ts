/**
 * Environment Variables Validation
 * Validates all required environment variables at startup
 * Fails fast with clear error messages if any are missing
 */

interface RequiredEnvVars {
  // Firebase
  FIREBASE_PROJECT_ID: string;
  FIREBASE_CLIENT_EMAIL: string;
  FIREBASE_PRIVATE_KEY: string;
  
  // Stripe
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  STRIPE_PRICE_ID: string;
  
  // App
  NEXT_PUBLIC_APP_URL: string;
  NEXTAUTH_SECRET?: string;
  
  // Migration (optional)
  MIGRATION_SECRET_KEY?: string;
}

interface OptionalEnvVars {
  NODE_ENV: string;
  VERCEL_ENV?: string;
}

type AllEnvVars = RequiredEnvVars & OptionalEnvVars;

class EnvironmentValidationError extends Error {
  constructor(message: string, public missingVars: string[]) {
    super(message);
    this.name = 'EnvironmentValidationError';
  }
}

export function validateEnvironmentVariables(): AllEnvVars {
  const missingVars: string[] = [];
  const envVars = {} as AllEnvVars;

  // Required variables
  const requiredVars: (keyof RequiredEnvVars)[] = [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_CLIENT_EMAIL', 
    'FIREBASE_PRIVATE_KEY',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'STRIPE_PRICE_ID',
    'NEXT_PUBLIC_APP_URL'
  ];

  // Check required variables
  for (const varName of requiredVars) {
    const value = process.env[varName];
    if (!value || value.trim() === '') {
      missingVars.push(varName);
    } else {
      (envVars as any)[varName] = value.trim();
    }
  }

  // Optional variables with defaults
  envVars.NODE_ENV = process.env.NODE_ENV || 'development';
  envVars.VERCEL_ENV = process.env.VERCEL_ENV;
  envVars.NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;
  envVars.MIGRATION_SECRET_KEY = process.env.MIGRATION_SECRET_KEY;

  // Validate specific formats
  if (envVars.NEXT_PUBLIC_APP_URL && !envVars.NEXT_PUBLIC_APP_URL.startsWith('http')) {
    missingVars.push('NEXT_PUBLIC_APP_URL (must start with http:// or https://)');
  }

  if (envVars.STRIPE_SECRET_KEY && !envVars.STRIPE_SECRET_KEY.startsWith('sk_')) {
    missingVars.push('STRIPE_SECRET_KEY (must start with sk_)');
  }

  if (envVars.STRIPE_WEBHOOK_SECRET && !envVars.STRIPE_WEBHOOK_SECRET.startsWith('whsec_')) {
    missingVars.push('STRIPE_WEBHOOK_SECRET (must start with whsec_)');
  }

  // Throw error if any variables are missing or invalid
  if (missingVars.length > 0) {
    const errorMessage = `
❌ Missing or invalid environment variables:

${missingVars.map(v => `  - ${v}`).join('\n')}

Please ensure all required environment variables are set in your .env.local file.

Required variables:
${requiredVars.map(v => `  - ${v}`).join('\n')}

Optional variables:
  - NEXTAUTH_SECRET (recommended for production)
  - MIGRATION_SECRET_KEY (for data migration)
`;

    throw new EnvironmentValidationError(errorMessage, missingVars);
  }

  return envVars;
}

// Validate environment on module load (for server startup)
let validatedEnv: AllEnvVars | null = null;

export function getValidatedEnv(): AllEnvVars {
  if (!validatedEnv) {
    validatedEnv = validateEnvironmentVariables();
  }
  return validatedEnv;
}

// For use in API routes and middleware
export function requireValidEnv(): AllEnvVars {
  try {
    return getValidatedEnv();
  } catch (error) {
    if (error instanceof EnvironmentValidationError) {
      console.error('Environment validation failed:', error.message);
      throw error;
    }
    throw new Error('Failed to validate environment variables');
  }
}
