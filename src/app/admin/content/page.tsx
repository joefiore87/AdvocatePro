'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { ContentCategory } from '@/lib/content-types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, Loader2, RefreshCw, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { ContentSkeleton, Skeleton } from '@/components/ui/skeleton-loader';

function ContentAdminPage() {
  const { user, loading: authLoading } = useAuth();
  const [content, setContent] = useState<Record<string, ContentCategory>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<string>('');
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function loadContent() {
      if (!user) return;
      
      try {
        setError(null);
        // Get auth token for API call
        const token = await user.getIdToken();
        
        const response = await fetch('/api/admin/content/raw', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to load content: ${response.status}`);
        }

        const data = await response.json();
        const contentData = data.content || {};
        setContent(contentData);
        
        // Set initial active tab
        if (Object.keys(contentData).length > 0 && !activeTab) {
          setActiveTab(Object.keys(contentData)[0]);
        }
      } catch (error) {
        console.error('Error loading content:', error);
        setError(error instanceof Error ? error.message : 'There was a problem loading the content');
        toast({
          title: 'Error loading content',
          description: 'There was a problem loading the content. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      loadContent();
    }
  }, [user, toast, activeTab]);

  const handleContentChange = (categoryId: string, itemId: string, value: string) => {
    setContent(prevContent => ({
      ...prevContent,
      [categoryId]: {
        ...prevContent[categoryId],
        items: prevContent[categoryId].items.map(item => 
          item.id === itemId ? { ...item, value } : item
        )
      }
    }));
  };

  const handleSaveItem = async (categoryId: string, itemId: string, value: string) => {
    setSaving(prev => ({ ...prev, [`${categoryId}-${itemId}`]: true }));
    
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Get auth token for API call
      const token = await user.getIdToken();
      
      const response = await fetch(`/api/admin/content/${categoryId}/${itemId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ value })
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        toast({
          title: 'Content updated',
          description: 'Your changes have been saved successfully.'
        });
        
        // Update the item in state with any server-side changes (like lastUpdated)
        if (result.item) {
          setContent(prevContent => ({
            ...prevContent,
            [categoryId]: {
              ...prevContent[categoryId],
              items: prevContent[categoryId].items.map(item => 
                item.id === itemId ? { ...item, ...result.item } : item
              )
            }
          }));
        }
      } else {
        toast({
          title: 'Update failed',
          description: result.error || 'There was a problem saving your changes. Please try again.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: 'Update failed',
        description: error instanceof Error ? error.message : 'There was a problem saving your changes. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setSaving(prev => ({ ...prev, [`${categoryId}-${itemId}`]: false }));
    }
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    // Force re-fetch by changing a dependency in the useEffect
    setActiveTab('');
  };

  if (authLoading || loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center mb-6">
          <Skeleton className="h-8 w-64" />
        </div>
        
        <div className="mb-6">
          <Skeleton className="h-10 w-full max-w-md" />
        </div>
        
        <ContentSkeleton />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={handleRetry}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Content Management</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          {Object.values(content).map(category => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {Object.values(content).map(category => (
          <TabsContent key={category.id} value={category.id}>
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">{category.name}</h2>
              <p className="text-muted-foreground">{category.description}</p>
              
              {category.items.map(item => (
                <Card key={item.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{item.id}</CardTitle>
                    <CardDescription>
                      Last updated: {new Date(item.lastUpdated).toLocaleString()}
                      {item.updatedBy && ` by ${item.updatedBy}`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {item.type === 'text' ? (
                        <Input
                          value={item.value}
                          onChange={(e) => handleContentChange(category.id, item.id, e.target.value)}
                        />
                      ) : (
                        <Textarea
                          value={item.value}
                          onChange={(e) => handleContentChange(category.id, item.id, e.target.value)}
                          rows={8}
                          className="font-mono text-sm"
                        />
                      )}
                      
                      <Button
                        onClick={() => handleSaveItem(category.id, item.id, item.value)}
                        disabled={saving[`${category.id}-${item.id}`]}
                      >
                        {saving[`${category.id}-${item.id}`] ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

// Wrap the component with error boundary
export default function ContentAdminPageWithErrorBoundary() {
  return (
    <ErrorBoundary
      fallback={
        <div className="container mx-auto py-8">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              There was an error loading the content management page.
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
      }
    >
      <ContentAdminPage />
    </ErrorBoundary>
  );
}