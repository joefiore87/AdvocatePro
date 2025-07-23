'use client';

import { ContentCategory, ContentItem, DEFAULT_CONTENT } from './content-types';
import { getAuth } from 'firebase/auth';

/**
 * Get all content for the homepage
 * Client-side function that uses API
 */
export async function getHomeContent(): Promise<Record<string, string>> {
  try {
    const response = await fetch('/api/content');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch content: ${response.status}`);
    }
    
    const data = await response.json();
    return data.content || {};
  } catch (error) {
    console.error('Error fetching home content:', error);
    
    // Return default content as fallback
    return {
      'homepage-hero': "You know your child better than anyone. Now get the tools to help schools see it too.",
      'homepage-description': "Create clear, professional advocacy letters using what you already know about your child. Everything stays private on your computer—no uploading personal information anywhere.",
      'annual-pricing': "$29.99/year",
      'whats-included-title': "What's Included",
      'features-list': "20 letter templates for different situations (evaluation requests, meeting requests, follow-ups, etc.)\\n7 learning modules explaining special education processes and parent rights\\nWorks offline - install once, use anywhere\\nUpdates included when new templates are added"
    };
  }
}

/**
 * Get all content categories with their items
 * Client-side function that uses API
 */
export async function getAllContent(): Promise<Record<string, ContentCategory>> {
  try {
    // Get current user
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Get auth token
    const token = await user.getIdToken();
    
    const response = await fetch('/api/admin/content/raw', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch content: ${response.status}`);
    }
    
    const data = await response.json();
    return data.content || {};
  } catch (error) {
    console.error('Error getting content:', error);
    // Return default content as fallback
    return DEFAULT_CONTENT;
  }
}

/**
 * Get a specific content category
 * Client-side function that uses API
 */
export async function getContentCategory(categoryId: string): Promise<ContentCategory | null> {
  try {
    // Get current user
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Get auth token
    const token = await user.getIdToken();
    
    const response = await fetch(`/api/admin/content/category/${categoryId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch category: ${response.status}`);
    }
    
    const data = await response.json();
    return data.category || null;
  } catch (error) {
    console.error(`Error getting content category ${categoryId}:`, error);
    // Return default content as fallback
    return DEFAULT_CONTENT[categoryId as keyof typeof DEFAULT_CONTENT] || null;
  }
}

/**
 * Update a content item
 * Client-side function that uses API
 */
export async function updateContentItem(categoryId: string, itemId: string, value: string, updatedBy?: string): Promise<boolean> {
  try {
    // Get current user
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Get auth token
    const token = await user.getIdToken();
    
    const response = await fetch(`/api/admin/content/${categoryId}/${itemId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ value })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update content: ${response.status}`);
    }
    
    const result = await response.json();
    return result.success || false;
  } catch (error) {
    console.error(`Error updating content item ${categoryId}/${itemId}:`, error);
    return false;
  }
}

/**
 * Initialize content
 * Client-side function that sets up initial content structures
 */
export async function initializeContent(): Promise<void> {
  // Implementation for initializing content
  // This could involve fetching initial data or setting up content structures
  console.log('Initializing content');
  // Add actual initialization logic here as needed
}