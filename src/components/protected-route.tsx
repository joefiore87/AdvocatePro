'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Loader2, Lock, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresPremium?: boolean;
  fallbackPath?: string;
}

export default function ProtectedRoute({ 
  children, 
  requiresPremium = false,
  fallbackPath
}: ProtectedRouteProps) {
  const { user, loading: authLoading, hasAccess, roleLoading } = useAuth();
  const [showContent, setShowContent] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (authLoading || roleLoading) {
      return; // Still loading
    }

    if (!user) {
      // Not authenticated - redirect to login
      router.push('/login');
      return;
    }

    if (requiresPremium && !hasAccess) {
      // Needs premium access but doesn't have it
      if (fallbackPath) {
        router.push(fallbackPath);
      } else {
        router.push('/purchase');
      }
      return;
    }

    // All checks passed
    setShowContent(true);
  }, [user, authLoading, hasAccess, roleLoading, requiresPremium, router, fallbackPath]);

  // Loading states
  if (authLoading || roleLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center max-w-md mx-auto p-8">
          <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to access this content.</p>
          <Button onClick={() => router.push('/login')} className="w-full">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  // Needs premium access
  if (requiresPremium && !hasAccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center max-w-md mx-auto p-8">
          <CreditCard className="h-16 w-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Premium Access Required</h2>
          <p className="text-gray-600 mb-6">
            This content is part of our premium toolkit. Upgrade to access all features including:
          </p>
          <ul className="text-left text-gray-600 mb-6 space-y-2">
            <li>• 20+ letter templates</li>
            <li>• Educational modules</li>
            <li>• Student profile builder</li>
            <li>• Letter generator</li>
          </ul>
          <div className="space-y-3">
            <Button onClick={() => router.push('/purchase')} className="w-full">
              Upgrade Now - $29.99/year
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.push('/')}
              className="w-full"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show protected content
  return showContent ? <>{children}</> : null;
}

// Convenience components for common protection levels
export function PremiumRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiresPremium={true}>
      {children}
    </ProtectedRoute>
  );
}

export function AuthRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiresPremium={false}>
      {children}
    </ProtectedRoute>
  );
}
