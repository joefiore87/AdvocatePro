'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const [initializing, setInitializing] = useState(false);
  const { toast } = useToast();

  const handleInitializeContent = async () => {
    setInitializing(true);
    
    try {
      const response = await fetch('/api/admin/content/init', {
        method: 'POST',
      });
      
      const result = await response.json();
      
      toast({
        title: result.success ? 'Content initialized' : 'Already initialized',
        description: result.message,
      });
    } catch (error) {
      console.error('Error initializing content:', error);
      toast({
        title: 'Initialization failed',
        description: 'There was a problem initializing the content. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setInitializing(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Content Management</CardTitle>
            <CardDescription>Initialize or reset content</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              Initialize the content management system with default content. This will not overwrite existing content if already initialized.
            </p>
            <Button onClick={handleInitializeContent} disabled={initializing}>
              {initializing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Initializing...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Initialize Content
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}