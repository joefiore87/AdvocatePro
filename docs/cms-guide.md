# Content Management System Guide

This guide explains how to use the Content Management System (CMS) to edit website content.

## Accessing the Admin Dashboard

1. Go to: http://localhost:9002/admin/content (in development) or https://advocate-empower.web.app/admin/content (in production)
2. Log in with your admin credentials
3. Click on the "Content" tab in the sidebar

## Editing Content

The CMS organizes content into categories:

### Page Content
- **heroTitle**: Main headline on the homepage
- **heroDescription**: Subtitle text on the homepage
- **pricingAmount**: Price display (e.g., "$29.99/year")
- **pricingDescription**: Text below the pricing

### Features
- List of features included in the toolkit
- Each feature is a separate item that can be edited

### Letter Templates
- Templates for advocacy letters
- Each template can be edited with full formatting

### Educational Modules
- Learning content about special education
- Each module can be edited with markdown formatting

## How to Edit

1. Select the category tab you want to edit
2. Find the specific content item
3. Make your changes in the text field
4. Click "Save Changes"
5. The website will update immediately with your changes

## Initializing Content

If you need to reset or initialize the content:

1. Go to the Settings page in the admin dashboard
2. Click "Initialize Content"
3. This will add default content if none exists

Alternatively, you can run the initialization script:

```bash
npm run init-content
```

## Technical Details

- Content is stored in Firebase Firestore
- Changes are immediately reflected on the website
- The system includes fallbacks if Firebase is unavailable
- Content is organized by categories and items

## Troubleshooting

If you encounter issues:

1. Check that you're logged in with admin credentials
2. Ensure Firebase is properly configured
3. Try initializing content from the Settings page
4. Check the browser console for any errors