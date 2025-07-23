import { db } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  getDocs, 
  query, 
  where,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';

export interface ContentItem {
  id: string;
  title: string;
  content: string;
  type: 'heading' | 'paragraph' | 'price' | 'button' | 'meta' | 'letter' | 'module' | 'email';
  category: 'pages' | 'templates' | 'modules' | 'notifications';
  lastModified: Date;
  modifiedBy?: string;
  published: boolean;
  version: number;
}

class ContentManager {
  private collectionName = 'site_content';

  // Get all content items by category
  async getContentByCategory(category: string): Promise<ContentItem[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('category', '==', category),
        where('published', '==', true),
        orderBy('lastModified', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as ContentItem));
    } catch (error) {
      console.error('Error fetching content:', error);
      return [];
    }
  }

  // Get specific content item
  async getContentItem(id: string): Promise<ContentItem | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as ContentItem;
      }
      return null;
    } catch (error) {
      console.error('Error fetching content item:', error);
      return null;
    }
  }

  // Update content item
  async updateContent(id: string, content: string, modifiedBy?: string): Promise<boolean> {
    try {
      const docRef = doc(db, this.collectionName, id);
      
      // Get current item to increment version
      const currentDoc = await getDoc(docRef);
      const currentVersion = currentDoc.exists() ? currentDoc.data().version || 1 : 1;
      
      await updateDoc(docRef, {
        content,
        lastModified: serverTimestamp(),
        modifiedBy: modifiedBy || 'admin',
        version: currentVersion + 1
      });
      
      return true;
    } catch (error) {
      console.error('Error updating content:', error);
      return false;
    }
  }

  // Create new content item
  async createContent(contentItem: Omit<ContentItem, 'id' | 'lastModified' | 'version'>): Promise<string | null> {
    try {
      const docRef = doc(collection(db, this.collectionName));
      
      await setDoc(docRef, {
        ...contentItem,
        lastModified: serverTimestamp(),
        version: 1
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating content:', error);
      return null;
    }
  }

  // Get content for public website (cached version)
  async getPublicContent(): Promise<Record<string, string>> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('published', '==', true)
      );
      
      const querySnapshot = await getDocs(q);
      const contentMap: Record<string, string> = {};
      
      querySnapshot.docs.forEach(doc => {
        const data = doc.data();
        contentMap[doc.id] = data.content;
      });
      
      return contentMap;
    } catch (error) {
      console.error('Error fetching public content:', error);
      return {};
    }
  }

  // Initialize default content (run once)
  async initializeDefaultContent(): Promise<void> {
    const defaultContent: Omit<ContentItem, 'id' | 'lastModified' | 'version'>[] = [
      {
        title: "Homepage Hero Title",
        content: "You know your child better than anyone. Now get the tools to help schools see it too.",
        type: "heading",
        category: "pages",
        published: true
      },
      {
        title: "Homepage Description",
        content: "Create clear, professional advocacy letters using what you already know about your child. Everything stays private on your computer—no uploading personal information anywhere.",
        type: "paragraph",
        category: "pages",
        published: true
      },
      {
        title: "Annual Pricing",
        content: "$29.99/year",
        type: "price",
        category: "pages",
        published: true
      },
      {
        title: "What's Included Title",
        content: "What's Included",
        type: "heading",
        category: "pages",
        published: true
      },
      {
        title: "Features List",
        content: "20 letter templates for different situations (evaluation requests, meeting requests, follow-ups, etc.)\n7 learning modules explaining special education processes and parent rights\nWorks offline - install once, use anywhere\nUpdates included when new templates are added",
        type: "paragraph",
        category: "pages",
        published: true
      },
      {
        title: "IEP Meeting Request Template",
        content: "Dear [School Official Name],\n\nI am writing to formally request an IEP meeting for my child, [Child's Name], who is currently enrolled in [Grade/Class] at [School Name].\n\n[Your specific concerns and reasons for the meeting]\n\nI would like to schedule this meeting within the next 30 days as required by IDEA. Please let me know your available dates and times.\n\nThank you for your attention to this matter.\n\nSincerely,\n[Your Name]\n[Date]",
        type: "letter",
        category: "templates",
        published: true
      },
      {
        title: "Evaluation Request Template",
        content: "Dear [School Official Name],\n\nI am formally requesting a comprehensive evaluation for my child, [Child's Name], who is currently in [Grade/Class] at [School Name].\n\n[Describe your concerns and observations]\n\nI believe my child may be eligible for special education services and would benefit from a thorough evaluation. Please begin this process within the required timeframe under IDEA.\n\nI look forward to working together to support my child's educational needs.\n\nSincerely,\n[Your Name]\n[Date]",
        type: "letter",
        category: "templates",
        published: true
      }
    ];

    for (const item of defaultContent) {
      await this.createContent(item);
    }
  }
}

export const contentManager = new ContentManager();