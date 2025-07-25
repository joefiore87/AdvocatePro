'use client';

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { AppLogo } from "@/components/icons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AlertCircle, Loader2, RefreshCw, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function PurchasePage() {
  const { user, loading, hasAccess, refreshUserClaims } = useAuth();
  const router = useRouter();
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    // If user has access, redirect to dashboard
    if (!loading && user && hasAccess) {
      router.push('/dashboard');
    }
  }, [user, loading, hasAccess, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Show access granted message
  if (user && hasAccess) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Access Granted!</h2>
          <p className="text-gray-600 mb-6">
            You have premium access. Redirecting to your dashboard...
          </p>
        </div>
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

  const handleRefreshAccess = async () => {
    try {
      await refreshUserClaims();
      // Access check happens automatically in useEffect
    } catch (error) {
      console.error('Error refreshing access:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <AppLogo className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-bold text-foreground">AdvocatePro</h1>
        </div>
        {user && (
          <div className="text-sm text-gray-600">
            Signed in as {user.email}
          </div>
        )}
      </header>

      <main className="flex-grow">
        <section className="py-16 bg-secondary/50">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              The Special Education Advocacy Toolkit
            </h3>
            <p className="mt-4 text-5xl font-bold text-primary">$29.99</p>
            <p className="mt-4 text-muted-foreground">One year of access • Non-renewing</p>
            
            {checkoutError && (
              <Alert variant="destructive" className="max-w-md mx-auto mt-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Payment Error</AlertTitle>
                <AlertDescription>{checkoutError}</AlertDescription>
              </Alert>
            )}

            <div className="mt-8 space-y-4">
              <Button 
                size="lg" 
                onClick={handlePurchase}
                disabled={isCreatingCheckout}
                className="px-8 py-3"
              >
                {isCreatingCheckout ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating secure checkout...
                  </>
                ) : (
                  'Get Premium Access'
                )}
              </Button>

              {user && !hasAccess && (
                <div className="pt-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Already purchased? Your access may be processing.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleRefreshAccess}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Check Access Status
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-foreground mb-6">What You Get</h3>
              <ul className="space-y-4 text-muted-foreground text-lg">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  20+ professional letter templates for every situation
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  Student profile builder for personalized letters
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  Educational modules on special education law
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  Instant letter generation with your child's info
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  One year of access with all updates included
                </li>
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

        <section className="py-16 bg-secondary/50">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-2xl font-bold mb-4">30-Day Money-Back Guarantee</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              If the toolkit doesn't help you advocate more effectively for your child, 
              we'll refund your purchase within 30 days. No questions asked.
            </p>
          </div>
        </section>
      </main>

      <footer className="py-6 border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          &copy; {new Date().getFullYear()} AdvocatePro. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}

export default PurchasePage;
