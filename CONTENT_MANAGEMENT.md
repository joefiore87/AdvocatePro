# Content Management System

This admin dashboard includes a powerful Content Management System (CMS) that allows you to edit all text and content across your website in real-time.

## 🚀 How It Works

### 1. **Content Categories**
The CMS organizes content into four main categories:

- **Pages**: Homepage content, pricing, descriptions
- **Templates**: Letter templates for advocacy
- **Modules**: Learning and training content  
- **Notifications**: Email templates and system messages

### 2. **Real-time Updates**
When you edit content in the admin dashboard:
1. Changes are immediately saved to Firebase Firestore
2. Your website automatically fetches the updated content
3. Visitors see the changes without any page refresh needed

### 3. **Version Control**
- Every content change is tracked with timestamps
- You can see who made changes and when
- Version numbers increment with each edit

## 📝 Getting Started

### Step 1: Initialize Content
First, set up your Firebase config and initialize default content:

```bash
# Add your Firebase config to scripts/init-content.ts
npm run tsx scripts/init-content.ts
```

### Step 2: Access the Admin Dashboard
Navigate to: `http://localhost:9002/admin/content`

### Step 3: Edit Content
1. Select a content category (Pages, Templates, etc.)
2. Click on any content item to edit it
3. Make your changes in the editor
4. Click "Save Changes"
5. See the preview update instantly

## 🔧 Technical Implementation

### Firebase Structure
Content is stored in Firestore with this structure:
```
site_content/
├── {documentId}/
│   ├── title: "Homepage Hero"
│   ├── content: "Your text content here"
│   ├── type: "heading" | "paragraph" | "price" | etc.
│   ├── category: "pages" | "templates" | "modules" | "notifications"
│   ├── published: true
│   ├── lastModified: timestamp
│   └── version: 1
```

### API Endpoints
- `GET /api/admin/content?category=pages` - Fetch content by category
- `GET /api/admin/content/[id]` - Get specific content item
- `PUT /api/admin/content/[id]` - Update content item
- `POST /api/admin/content` - Create new content item

### Frontend Integration
Your homepage (and other pages) automatically fetch content:

```typescript
// Automatic content loading
useEffect(() => {
  fetch('/api/admin/content')
    .then(res => res.json())
    .then(data => setContent(data.content))
}, []);

// Use content in your JSX
<h1>{content['homepage-hero'] || 'Default text'}</h1>
```

## 🎯 Content Types

### Page Content IDs
These IDs are used to reference content on your website:

- `homepage-hero` - Main hero title
- `homepage-description` - Hero description  
- `annual-pricing` - Price display
- `whats-included-title` - Features section title
- `features-list` - List of features (newline separated)

### Letter Templates
- `iep-request` - IEP meeting request template
- `eval-request` - Evaluation request template
- `accommodation-request` - Accommodation request template
- (Add more as needed)

## 📱 Admin Dashboard Features

### Content Editor
- **Live Preview**: See changes as you type
- **Character Count**: Track content length
- **Auto-save Indicators**: Visual feedback when saving
- **Error Handling**: Graceful error messages
- **Refresh Button**: Reload content from Firebase

### User Experience
- **Responsive Design**: Works on desktop, tablet, mobile
- **Loading States**: Smooth loading animations
- **Toast Notifications**: Success/error feedback
- **Keyboard Shortcuts**: Efficient editing workflow

## 🔒 Security & Permissions

### Admin Access
Currently, the admin dashboard is open. For production, add:

```typescript
// Add to admin layout
import { useAuth } from '@/hooks/use-auth';

export default function AdminLayout() {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  if (!user?.isAdmin) return <Unauthorized />;
  
  return <AdminDashboard />;
}
```

### Content Validation
Content updates include validation:
- Required fields checking
- Content length limits
- XSS protection (sanitization)
- Rate limiting on API calls

## 🚀 Deployment

### Production Setup
1. **Environment Variables**:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
   ```

2. **Firebase Security Rules**:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /site_content/{document} {
         allow read: if true; // Public content
         allow write: if request.auth != null && 
           request.auth.token.admin == true; // Admin only
       }
     }
   }
   ```

3. **Caching Strategy**:
   - Content is cached on the client
   - API responses include cache headers
   - Consider adding Redis for server-side caching

## 📊 Analytics & Monitoring

### Content Analytics
Track content performance:
- View counts per content item
- Edit frequency and patterns
- User engagement with different content
- A/B testing capabilities

### Monitoring
- Content change logs
- API response times
- Error tracking and alerts
- User activity monitoring

## 🛠 Customization

### Adding New Content Types
1. Update the `ContentItem` interface
2. Add new content categories
3. Create specialized editors
4. Update the API validation

### Custom Fields
Extend content items with:
- SEO metadata
- Publication dates
- Content tags
- Media attachments
- Multi-language support

## 📝 Best Practices

### Content Strategy
- Use descriptive, unique content IDs
- Keep content focused and scannable
- Test changes on staging first
- Back up content regularly

### Performance
- Minimize API calls with caching
- Use debounced auto-save
- Optimize images and media
- Monitor bundle size

### Accessibility
- Maintain semantic HTML structure
- Provide alt text for images
- Ensure keyboard navigation
- Test with screen readers

## 🔧 Troubleshooting

### Common Issues
1. **Content not updating**: Check Firebase connection and permissions
2. **Save failures**: Verify API routes and error logs
3. **Loading issues**: Check network tab for failed requests
4. **Permission errors**: Verify admin access and Firebase rules

### Debug Mode
Enable detailed logging:
```typescript
// Add to your admin components
const DEBUG = process.env.NODE_ENV === 'development';
if (DEBUG) console.log('Content operation:', operation);
```

This Content Management System gives you complete control over your website's text and messaging, with a professional admin interface that's both powerful and easy to use!