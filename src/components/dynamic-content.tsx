'use client';

import { useState, useEffect } from 'react';
import { getAllContent } from '@/lib/content-service';
import { ContentCategory, DEFAULT_CONTENT } from '@/lib/content-types';

interface DynamicContentProps {
  categoryId: string;
  itemId: string;
  fallback?: string;
}

export function DynamicContent({ categoryId, itemId, fallback }: DynamicContentProps) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContent() {
      try {
        const allContent = await getAllContent();
        const category = allContent[categoryId];
        
        if (category) {
          const item = category.items.find(item => item.id === itemId);
          if (item) {
            setContent(item.value);
          }
        }
      } catch (error) {
        console.error(`Error loading content ${categoryId}/${itemId}:`, error);
        // Try to get fallback from DEFAULT_CONTENT
        try {
          const defaultCategory = DEFAULT_CONTENT[categoryId as keyof typeof DEFAULT_CONTENT];
          if (defaultCategory) {
            const defaultItem = defaultCategory.items.find(item => item.id === itemId);
            if (defaultItem) {
              setContent(defaultItem.value);
            }
          }
        } catch (e) {
          // Use provided fallback or null
          setContent(fallback || null);
        }
      } finally {
        setLoading(false);
      }
    }

    loadContent();
  }, [categoryId, itemId, fallback]);

  if (loading) {
    return <span className="opacity-70">{fallback || '...'}</span>;
  }

  if (content === null) {
    return <span>{fallback || ''}</span>;
  }

  return <>{content}</>;
}