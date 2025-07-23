'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { checkUserAccess } from '@/lib/subscription';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function checkAccess() {
      if (user?.email) {
        const access = await checkUserAccess(user.email);
        setHasAccess(access);
        
        if (!access) {
          router.push('/purchase');
        }
      }
    }

    if (!authLoading && user) {
      checkAccess();
    } else if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading || hasAccess === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary/50">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return hasAccess ? <>{children}</> : null;
}