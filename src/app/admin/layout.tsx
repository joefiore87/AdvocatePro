'use client';
import { useState } from 'react';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AppLogo } from '@/components/icons';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileText, Home, LogOut, Settings } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, userRole, isAdmin, roleLoading, signOut } = useAuth();
  const router = useRouter();

  const [verifyingAdmin, setVerifyingAdmin] = useState(false);
  const [serverVerifiedAdmin, setServerVerifiedAdmin] = useState<boolean | null>(null);

  // First check with client-side auth
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (!roleLoading && !isAdmin) {
        router.push('/unauthorized');
      }
    }
  }, [user, loading, roleLoading, isAdmin, router]);

  // Then verify with server-side check for additional security
  useEffect(() => {
    async function verifyAdminWithServer() {
      if (!user || loading || roleLoading || !isAdmin) {
        return;
      }

      try {
        setVerifyingAdmin(true);
        
        // Get auth token
        const token = await user.getIdToken();
        
        // Verify admin status with server
        const response = await fetch('/api/auth/verify-admin', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to verify admin status');
        }
        
        const { isAdmin: serverIsAdmin } = await response.json();
        setServerVerifiedAdmin(serverIsAdmin);
        
        // If server says not admin, redirect
        if (!serverIsAdmin) {
          console.error('Server verification failed: User is not an admin');
          router.push('/unauthorized');
        }
      } catch (error) {
        console.error('Error verifying admin status with server:', error);
        setServerVerifiedAdmin(false);
        router.push('/unauthorized');
      } finally {
        setVerifyingAdmin(false);
      }
    }
    
    verifyAdminWithServer();
  }, [user, loading, roleLoading, isAdmin, router]);

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  if (loading || roleLoading || verifyingAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !isAdmin || serverVerifiedAdmin === false) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex min-h-screen bg-secondary/20">
      {/* Sidebar */}
      <div className="w-64 bg-background border-r">
        <div className="p-4 flex items-center gap-2">
          <AppLogo className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
        </div>
        
        <nav className="mt-6 px-2">
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/admin">
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/admin/content">
                <FileText className="mr-2 h-4 w-4" />
                Content
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/admin/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </Button>
          </div>
          
          <div className="mt-8">
            <Button variant="ghost" className="w-full justify-start text-red-500" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </nav>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-background border-b p-4 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Admin Panel</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Logged in as {user.email}
              </span>
            </div>
          </div>
        </header>
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}