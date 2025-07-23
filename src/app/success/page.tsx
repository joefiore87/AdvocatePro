'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { AppLogo } from "@/components/icons";
import Link from "next/link";
import { CheckCircle2 } from 'lucide-react';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if we have a session ID
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId) {
      // No session ID, redirect to homepage
      router.push('/');
      return;
    }
    
    // Verify the session with the backend
    async function verifySession() {
      try {
        const response = await fetch(`/api/stripe/verify-session?session_id=${sessionId}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to verify session');
        }
        
        const { success, status } = await response.json();
        
        if (!success) {
          throw new Error(`Invalid session status: ${status}`);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error verifying session:', error);
        setError(error instanceof Error ? error.message : 'Failed to verify payment session');
        // Don't redirect immediately on error, show the error message instead
        setLoading(false);
      }
    }
    
    verifySession();
  }, [searchParams, router]);
  
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary/20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-secondary/20 p-4">
        <div className="w-full max-w-md space-y-8 rounded-lg bg-background p-6 shadow-lg">
          <div className="flex flex-col items-center space-y-4 text-center">
            <AppLogo className="h-12 w-12 text-primary" />
            <h1 className="text-2xl font-bold">Payment Verification Failed</h1>
            <p className="text-red-500">
              {error}
            </p>
            <p className="text-muted-foreground">
              There was a problem verifying your payment. If you believe this is an error, please contact support.
            </p>
          </div>

          <div className="flex flex-col space-y-4 pt-4">
            <Button asChild variant="outline">
              <Link href="/purchase">
                Try Again
              </Link>
            </Button>
            
            <Button asChild variant="outline">
              <Link href="/">
                Return to Homepage
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary/20 p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-background p-6 shadow-lg">
        <div className="flex flex-col items-center space-y-4 text-center">
          <AppLogo className="h-12 w-12 text-primary" />
          <CheckCircle2 className="h-16 w-16 text-green-500" />
          <h1 className="text-2xl font-bold">Payment Successful!</h1>
          <p className="text-muted-foreground">
            Thank you for your purchase. You now have access to the Special Education Advocacy Toolkit for one year.
          </p>
        </div>

        <div className="flex flex-col space-y-4 pt-4">
          <Button asChild>
            <Link href="/toolkit">
              Access Your Toolkit
            </Link>
          </Button>
          
          <Button asChild variant="outline">
            <Link href="/">
              Return to Homepage
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}