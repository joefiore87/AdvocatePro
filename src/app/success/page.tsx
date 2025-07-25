'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { AppLogo } from '@/components/icons';
import Link from 'next/link';
import { CheckCircle2, Loader2, AlertCircle, Clock } from 'lucide-react';

interface AccessStatus {
  hasAccess: boolean;
  subscriptionStatus: string;
  expiresAt?: number;
  email: string;
  lastUpdated: number;
}

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, refreshUserClaims } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accessGranted, setAccessGranted] = useState(false);
  const [pollingAttempts, setPollingAttempts] = useState(0);
  const [sessionVerified, setSessionVerified] = useState(false);

  const MAX_POLLING_ATTEMPTS = 30; // 30 attempts = 60 seconds max
  const POLLING_INTERVAL = 2000; // 2 seconds

  useEffect(() => {
    const processSuccess = async () => {
      const sessionId = searchParams.get('session_id');
      
      if (!sessionId) {
        router.push('/');
        return;
      }

      // First verify the Stripe session
      try {
        const response = await fetch(`/api/stripe/verify-session?session_id=${sessionId}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to verify session');
        }

        const { success } = await response.json();
        
        if (!success) {
          throw new Error('Payment was not successful');
        }

        setSessionVerified(true);
        
        // Start polling for access
        if (user) {
          startAccessPolling();
        }
        
      } catch (error) {
        console.error('Error verifying session:', error);
        setError(error instanceof Error ? error.message : 'Failed to verify payment session');
        setLoading(false);
      }
    };

    processSuccess();
  }, [searchParams, router, user]);

  const checkAccessStatus = async (): Promise<AccessStatus | null> => {
    if (!user) return null;
    
    try {
      const token = await user.getIdToken(true); // Force refresh
      const response = await fetch('/api/auth/status', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to check access status');
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking access:', error);
      return null;
    }
  };

  const startAccessPolling = async () => {
    const pollForAccess = async (attempt: number): Promise<void> => {
      setPollingAttempts(attempt);

      if (attempt >= MAX_POLLING_ATTEMPTS) {
        setError('Access verification timed out. Please contact support if you continue to have issues.');
        setLoading(false);
        return;
      }

      const status = await checkAccessStatus();
      
      if (status?.hasAccess) {
        // Access granted! Refresh the auth context and show success
        await refreshUserClaims();
        setAccessGranted(true);
        setLoading(false);
        return;
      }

      // Wait and try again
      setTimeout(() => {
        pollForAccess(attempt + 1);
      }, POLLING_INTERVAL);
    };

    await pollForAccess(1);
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setPollingAttempts(0);
    if (user && sessionVerified) {
      startAccessPolling();
    }
  };

  if (loading) {
    const estimatedSeconds = Math.max(1, Math.ceil((pollingAttempts * POLLING_INTERVAL) / 1000));
    
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg text-center">
          <AppLogo className="h-12 w-12 text-primary mx-auto" />
          <div className="space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <h1 className="text-2xl font-bold">
              {sessionVerified ? 'Setting Up Your Access...' : 'Verifying Payment...'}
            </h1>
            <p className="text-muted-foreground">
              {sessionVerified 
                ? `We're activating your premium features. This usually takes just a few seconds.`
                : 'Please wait while we confirm your payment with Stripe.'
              }
            </p>
            {sessionVerified && pollingAttempts > 0 && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Checking access... ({estimatedSeconds}s)</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
        <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg">
          <div className="flex flex-col items-center space-y-4 text-center">
            <AppLogo className="h-12 w-12 text-primary" />
            <AlertCircle className="h-16 w-16 text-red-500" />
            <h1 className="text-2xl font-bold">Access Setup Issue</h1>
            <p className="text-red-600 font-medium">{error}</p>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>Your payment was successful, but we're having trouble activating your access.</p>
              <p>This usually resolves within a few minutes. You can:</p>
            </div>
          </div>

          <div className="flex flex-col space-y-3 pt-4">
            <Button onClick={handleRetry} className="w-full">
              Try Again
            </Button>
            
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard">
                Go to Dashboard Anyway
              </Link>
            </Button>
            
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Still having issues? Contact{' '}
                <a href="mailto:support@advocatepro.com" className="underline text-primary">
                  support@advocatepro.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg">
        <div className="flex flex-col items-center space-y-6 text-center">
          <AppLogo className="h-12 w-12 text-primary" />
          <CheckCircle2 className="h-20 w-20 text-green-500" />
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Welcome to AdvocatePro!</h1>
            <p className="text-lg text-green-600 font-semibold">
              ✓ Payment Successful • ✓ Access Granted
            </p>
          </div>
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">
              You now have premium access to:
            </p>
            <ul className="text-sm text-left space-y-1 text-gray-700">
              <li>• 20+ professional letter templates</li>
              <li>• Student profile builder</li>
              <li>• Educational modules</li>
              <li>• Letter generator</li>
              <li>• One year of access</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col space-y-3 pt-4">
          <Button asChild className="w-full bg-green-600 hover:bg-green-700">
            <Link href="/dashboard">
              Start Using Your Toolkit
            </Link>
          </Button>

          <Button asChild variant="outline" className="w-full">
            <Link href="/letter-generator">
              Generate Your First Letter
            </Link>
          </Button>
        </div>

        <div className="pt-4 text-center">
          <p className="text-xs text-muted-foreground">
            Need help? Contact{' '}
            <a href="mailto:support@advocatepro.com" className="underline">
              support@advocatepro.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SuccessPageContent />
    </Suspense>
  );
}
