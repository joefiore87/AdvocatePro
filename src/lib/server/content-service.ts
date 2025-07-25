import { getFirestoreAdmin } from '../firebase-admin';
import { ContentCategory, ContentItem, DEFAULT_CONTENT } from '../content-types';

/**
 * Initialize content in Firestore if it doesn't exist
 * Server-side only function
 */
export async function initializeContent(): Promise<boolean> {
  try {
    const db = await getFirestoreAdmin();
    if (!db) {
      console.error('Firestore admin not available');
      return false;
    }

    // Check if content already exists
    const contentRef = db.collection('system').doc('content');
    const contentSnap = await contentRef.get();
    
    if (!contentSnap.exists) {
      // Initialize with default content
      await contentRef.set({ initialized: true, lastUpdated: new Date().toISOString() });
      
      // Create each content category
      for (const [key, category] of Object.entries(DEFAULT_CONTENT)) {
        await db.collection('content').doc(category.id).set({
          id: category.id,
          name: category.name,
          description: category.description
        });
        
        // Create each content item
        for (const item of category.items) {
          await db.collection('content').doc(category.id).collection('items').doc(item.id).set({
            ...item,
            lastUpdated: new Date().toISOString()
          });
        }
      }
      
      console.log('Content initialized successfully');
      return true;
    }
    
    console.log('Content already initialized');
    return false;
  } catch (error) {
    console.error('Error initializing content:', error);
    throw error;
  }
}

/**
 * Get all content categories with their items
 * Server-side only function
 */
export async function getAllContent(limit = 10): Promise<Record<string, ContentCategory>> {
  try {
    const db = await getFirestoreAdmin();
    if (!db) {
      console.error('Firestore admin not available');
      // Return default content as fallback
      return DEFAULT_CONTENT;
    }

    const categoriesRef = db.collection('content').limit(limit);
    const categoriesSnap = await categoriesRef.get();
    
    const content: Record<string, ContentCategory> = {};
    
    for (const categoryDoc of categoriesSnap.docs) {
      const categoryData = categoryDoc.data() as Omit<ContentCategory, 'items'>;
      
      // Get items for this category
      const itemsRef = db.collection('content').doc(categoryDoc.id).collection('items').limit(limit);
      const itemsSnap = await itemsRef.get();
      
      const items: ContentItem[] = itemsSnap.docs.map(itemDoc => itemDoc.data() as ContentItem);
      
      content[categoryDoc.id] = {
        ...categoryData,
        items
      };
    }
    
    return content;
  } catch (error) {
    console.error('Error getting content:', error);
    // Return default content as fallback
    return DEFAULT_CONTENT;
  }
}

/**
 * Get a specific content category
 * Server-side only function
 */
export async function getContentCategory(categoryId: string): Promise<ContentCategory | null> {
  try {
    const db = await getFirestoreAdmin();
    if (!db) {
      console.error('Firestore admin not available');
      // Return default content as fallback
      return DEFAULT_CONTENT[categoryId as keyof typeof DEFAULT_CONTENT] || null;
    }

    const categoryRef = db.collection('content').doc(categoryId);
    const categorySnap = await categoryRef.get();
    
    if (!categorySnap.exists) {
      return null;
    }
    
    const categoryData = categorySnap.data() as Omit<ContentCategory, 'items'>;
    
    // Get items for this category
    const itemsRef = db.collection('content').doc(categoryId).collection('items');
    const itemsSnap = await itemsRef.get();
    
    const items: ContentItem[] = itemsSnap.docs.map(itemDoc => itemDoc.data() as ContentItem);
    
    return {
      ...categoryData,
      items
    };
  } catch (error) {
    console.error(`Error getting content category ${categoryId}:`, error);
    // Return default content as fallback
    return DEFAULT_CONTENT[categoryId as keyof typeof DEFAULT_CONTENT] || null;
  }
}

/**
 * Update a content item
 * Server-side only function
 */
export async function updateContentItem(categoryId: string, itemId: string, value: string, updatedBy?: string): Promise<ContentItem | null> {
  try {
    const db = await getFirestoreAdmin();
    if (!db) {
      console.error('Firestore admin not available');
      return null;
    }

    const itemRef = db.collection('content').doc(categoryId).collection('items').doc(itemId);
    const itemSnap = await itemRef.get();
    
    if (!itemSnap.exists) {
      console.error(`Content item ${categoryId}/${itemId} not found`);
      return null;
    }
    
    const currentItem = itemSnap.data() as ContentItem;

    const updatedItem: ContentItem = {
      ...currentItem,
      value,
      lastUpdated: new Date().toISOString(),
      updatedBy: updatedBy || 'system'
    };
    
    await itemRef.set(updatedItem);
    
    return updatedItem;
  } catch (error) {
    console.error(`Error updating content item ${categoryId}/${itemId}:`, error);
    return null;
  }
}

/**
 * Get transformed content for homepage
 * Server-side only function
 */
export async function getTransformedContent(): Promise<Record<string, string>> {
  try {
    const allContent = await getAllContent();
    
    // Transform the content structure to match what the homepage expects
    const transformedContent: Record<string, string> = {};
    
    // Process page content
    if (allContent.pageContent) {
      const heroTitle = allContent.pageContent.items.find(item => item.id === 'heroTitle');
      if (heroTitle) {
        transformedContent['homepage-hero'] = heroTitle.value;
      }
      
      const heroDescription = allContent.pageContent.items.find(item => item.id === 'heroDescription');
      if (heroDescription) {
        transformedContent['homepage-description'] = heroDescription.value;
      }
      
      const pricingAmount = allContent.pageContent.items.find(item => item.id === 'pricingAmount');
      if (pricingAmount) {
        transformedContent['annual-pricing'] = pricingAmount.value;
      }
    }
    
    // Process features
    if (allContent.features) {
      transformedContent['whats-included-title'] = "What's Included";
      
      const featuresList = allContent.features.items.map(item => item.value);
      transformedContent['features-list'] = featuresList.join('\n');
    }
    
    return transformedContent;
  } catch (error) {
    console.error('Error getting transformed content:', error);
    
    // Return default content as fallback
    const defaultContent: Record<string, string> = {
      'homepage-hero': "You know your child better than anyone. Now get the tools to help schools see it too.",
      'homepage-description': "Create clear, professional advocacy letters using what you already know about your child. Everything stays private on your computer—no uploading personal information anywhere.",
      'annual-pricing': "$29.99/year",
      'whats-included-title': "What's Included",
      'features-list': "20 letter templates for different situations (evaluation requests, meeting requests, follow-ups, etc.)\n7 learning modules explaining special education processes and parent rights\nWorks offline - install once, use anywhere\nUpdates included when new templates are added"
    };
    
    return defaultContent;
  }
}