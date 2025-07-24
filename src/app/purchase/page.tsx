'use client';

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { AppLogo } from "@/components/icons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { checkUserAccess } from "@/lib/subscription";
import { AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton-loader";

function PurchasePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    async function checkAccess() {
      if (user?.email) {
        const access = await checkUserAccess(user.email);
        setHasAccess(access);
        setCheckingAccess(false);
        
        if (access) {
          router.push('/toolkit');
        }
      } else {
        setCheckingAccess(false);
      }
    }

    if (!loading) {
      checkAccess();
    }
  }, [user, loading, router]);

  if (loading || checkingAccess) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <AppLogo className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Advocacy Toolkit</h1>
          </div>
        </header>

        <main className="flex-grow">
          <section className="py-16 bg-secondary/50">
            <div className="container mx-auto px-4 text-center">
              <Skeleton className="h-8 w-64 mx-auto mb-4" />
              <Skeleton className="h-12 w-32 mx-auto mb-4" />
              <Skeleton className="h-4 w-72 mx-auto mb-8" />
              <Skeleton className="h-10 w-40 mx-auto" />
            </div>
          </section>

          <section className="py-16">
            <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <Skeleton className="h-8 w-48 mb-6" />
                <div className="space-y-3">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                </div>
              </div>
              <div className="bg-muted p-8 rounded-lg">
                <Skeleton className="h-24 w-full mb-4" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
          </section>
        </main>

        <footer className="py-6 border-t">
          <div className="container mx-auto px-4 text-center">
            <Skeleton className="h-4 w-64 mx-auto" />
          </div>
        </footer>
      </div>
    );
  }

  const handlePurchase = async () => {
    if (!user) {
      // Redirect to login if not authenticated
      router.push('/login?redirect=/purchase');
      return;
    }

    try {
      setIsCreatingCheckout(true);
      setCheckoutError(null);
      
      // Create checkout session with user info
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.uid,
          email: user.email
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to create checkout session');
      }
      
      const { url } = await response.json();
      
      if (!url) {
        throw new Error('No checkout URL received');
      }
      
      // Redirect to checkout
      window.location.href = url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setCheckoutError(error instanceof Error ? error.message : 'Failed to create checkout session');
    } finally {
      setIsCreatingCheckout(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <AppLogo className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-bold text-foreground">Advocacy Toolkit</h1>
        </div>
      </header>

      <main className="flex-grow">
        <section className="py-16 bg-secondary/50">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-3xl font-bold text-foreground">The Advocacy Toolkit</h3>
            <p className="mt-4 text-5xl font-bold text-primary">$29.99</p>
            <p className="mt-4 text-muted-foreground">One year of access to all features. Non-renewing.</p>
            <Button 
              size="lg" 
              className="mt-8" 
              onClick={handlePurchase}
              disabled={isCreatingCheckout}
            >
              {isCreatingCheckout ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating checkout...
                </>
              ) : (
                'Get the toolkit'
              )}
            </Button>
            {checkoutError && (
              <p className="mt-4 text-sm text-red-500">
                {checkoutError}. Please try again or contact support.
              </p>
            )}
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-foreground">What's Included</h3>
              <ul className="mt-6 space-y-3 text-muted-foreground text-lg">
                <li>20 letter templates for different situations (evaluation requests, meeting requests, follow-ups, etc.)</li>
                <li>7 learning modules explaining special education processes and parent rights</li>
                <li>Works offline - install once, use anywhere</li>
                <li>Updates included when new templates are added</li>
              </ul>
            </div>
            <div className="bg-muted p-8 rounded-lg">
              <blockquote className="text-lg text-foreground italic">
                "This gave me the words I couldn't find on my own. The school actually responded within the required timeframe for the first time."
              </blockquote>
              <p className="mt-4 font-semibold text-muted-foreground">— Parent from Michigan</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-6 border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          &copy; {new Date().getFullYear()} Advocate Empower. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}

// Wrap the component with error boundary
export default function PurchasePageWithErrorBoundary() {
  return (
    <ErrorBoundary
      fallback={
        <div className="flex flex-col min-h-screen bg-background">
          <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <AppLogo className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold text-foreground">Advocacy Toolkit</h1>
            </div>
          </header>

          <main className="flex-grow">
            <div className="container mx-auto py-16 px-4">
              <Alert variant="destructive" className="mb-6 max-w-lg mx-auto">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  There was an error loading the purchase page.
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="ml-2"
                    onClick={() => window.location.reload()}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Retry
                  </Button>
                </AlertDescription>
              </Alert>
            </div>
          </main>

          <footer className="py-6 border-t">
            <div className="container mx-auto px-4 text-center text-muted-foreground">
              &copy; {new Date().getFullYear()} Advocate Empower. All Rights Reserved.
            </div>
          </footer>
        </div>
      }
    >
      <PurchasePage />
    </ErrorBoundary>
  );
}