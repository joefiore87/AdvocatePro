import { useEffect, useState } from 'react';
import { contentManager, ContentItem } from './content-manager';

export function useContent(category?: string) {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContent() {
      try {
        setLoading(true);
        const data = category 
          ? await contentManager.getContentByCategory(category)
          : await contentManager.getPublicContent();
        setContent(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch content');
      } finally {
        setLoading(false);
      }
    }

    fetchContent();
  }, [category]);

  const updateContent = async (id: string, newContent: string): Promise<boolean> => {
    try {
      const success = await contentManager.updateContent(id, newContent);
      if (success && category) {
        // Refresh the content list
        const updatedData = await contentManager.getContentByCategory(category);
        setContent(updatedData);
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update content');
      return false;
    }
  };

  return {
    content,
    loading,
    error,
    updateContent,
    refresh: () => {
      if (category) {
        contentManager.getContentByCategory(category).then(setContent);
      }
    }
  };
}

// Hook to get specific content by ID for public pages
export function usePublicContent(contentId: string) {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      try {
        const item = await contentManager.getContentItem(contentId);
        setContent(item?.content || '');
      } catch (err) {
        console.error('Error fetching content:', err);
      } finally {
        setLoading(false);
      }
    }

    if (contentId) {
      fetchContent();
    }
  }, [contentId]);

  return { content, loading };
}