'use client';

import { Button } from "@/components/ui/button";
import { AppLogo } from "@/components/icons";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary/20 p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-background p-6 shadow-lg">
        <div className="flex flex-col items-center space-y-2 text-center">
          <AppLogo className="h-12 w-12 text-primary" />
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground">
            You don't have permission to access this page.
          </p>
        </div>

        <div className="flex flex-col space-y-4">
          <Button asChild variant="outline">
            <Link href="/">
              Return to Homepage
            </Link>
          </Button>
          
          {user && (
            <Button variant="ghost" onClick={handleSignOut}>
              Sign Out
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}