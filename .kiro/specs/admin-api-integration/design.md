# Design Document

## Overview

This design outlines the migration from client-side Firestore operations to a proper server-side API architecture for the admin content management system and purchase flow. The current implementation has security vulnerabilities due to direct client-side database access and uses hardcoded Stripe payment links instead of dynamic checkout sessions.

## Architecture

### Current State Issues
- Admin content page directly imports and uses Firestore client SDK
- Purchase page uses hardcoded Stripe payment links
- Content service performs client-side database operations
- Mixed authentication patterns between client and server

### Target Architecture
- All data operations routed through authenticated API endpoints
- Dynamic Stripe checkout session creation
- Centralized authentication middleware
- Consistent error handling and validation

## Components and Interfaces

### 1. Admin Content API Enhancement

**Existing API Routes:**
- `GET /api/admin/content` - Already exists, returns transformed content
- `PUT /api/admin/content/update` - Needs creation for content updates

**New API Routes Needed:**
- `PUT /api/admin/content/[categoryId]/[itemId]` - Update individual content items

**Client-Side Changes:**
- Remove direct Firestore imports from admin content page
- Replace `getAllContent()` and `updateContentItem()` calls with fetch requests
- Add proper error handling for API responses

### 2. Purchase Flow API Integration

**Existing API Routes:**
- `POST /api/stripe/create-checkout-session` - Already exists, creates dynamic sessions

**Client-Side Changes:**
- Replace hardcoded Stripe payment link with API call to create checkout session
- Add loading states and error handling for checkout creation
- Implement proper redirect handling

### 3. Content Service Refactoring

**Current Issues:**
- Direct Firestore client SDK usage
- Client-side database operations
- Mixed server/client code patterns

**Target Design:**
- Remove all Firestore imports from client-side content service
- Create server-only content service for API routes
- Implement client-side service that only makes HTTP requests

### 4. Authentication and Authorization

**Admin Layout Verification:**
- Current implementation uses `useAuth` hook with role checking
- Verify `isAdmin` flag is properly validated
- Ensure unauthorized access redirects work correctly

**API Middleware:**
- Existing `verifyAdminAccess` middleware for admin routes
- Existing `verifyAuthToken` middleware for authenticated routes
- Rate limiting already implemented

## Data Models

### Content API Request/Response Models

```typescript
// GET /api/admin/content response
interface ContentResponse {
  content: Record<string, ContentCategory>;
}

// PUT /api/admin/content/[categoryId]/[itemId] request
interface UpdateContentRequest {
  value: string;
}

// PUT /api/admin/content/[categoryId]/[itemId] response
interface UpdateContentResponse {
  success: boolean;
  item?: ContentItem;
  error?: string;
}
```

### Checkout API Models

```typescript
// POST /api/stripe/create-checkout-session response
interface CheckoutSessionResponse {
  url: string;
}

// Error response format
interface ApiErrorResponse {
  error: string;
}
```

## Error Handling

### Client-Side Error Handling
- Network errors (connection issues, timeouts)
- Authentication errors (401 Unauthorized)
- Authorization errors (403 Forbidden)
- Validation errors (400 Bad Request)
- Server errors (500 Internal Server Error)

### Server-Side Error Handling
- Input validation using existing patterns
- Database operation failures
- Stripe API errors
- Authentication token verification failures

### Error Response Format
All API endpoints will return consistent error responses:
```typescript
{
  error: string;
  details?: any; // Optional additional error context
}
```

## Testing Strategy

### Unit Tests
- API route handlers for content operations
- Client-side service functions
- Authentication middleware
- Error handling scenarios

### Integration Tests
- End-to-end admin content management flow
- Purchase flow with dynamic checkout
- Authentication and authorization flows
- Error recovery scenarios

### Manual Testing Checklist
- Admin content page loads and displays content via API
- Content updates save successfully through API
- Purchase page creates dynamic checkout sessions
- Unauthorized users cannot access admin functions
- Error states display appropriate messages
- Loading states work correctly

## Implementation Phases

### Phase 1: Content API Migration
1. Create new API route for individual content item updates
2. Update admin content page to use API calls instead of direct Firestore
3. Remove Firestore imports from client-side content service
4. Test content management functionality

### Phase 2: Purchase Flow Enhancement
1. Update purchase page to call checkout session API
2. Add loading and error states for checkout creation
3. Test purchase flow end-to-end
4. Verify success/cancel redirects work correctly

### Phase 3: Content Service Refactoring
1. Create server-only content service for API routes
2. Update client-side content service to only make HTTP requests
3. Remove all client-side Firestore operations
4. Update any remaining direct Firestore usage

### Phase 4: System Integration Review
1. Verify admin layout role checking works correctly
2. Test all authentication and authorization flows
3. Ensure no client-side Firestore operations remain
4. Performance and security review

## Security Considerations

### Authentication
- All admin API routes protected by `verifyAdminAccess` middleware
- Checkout API protected by `verifyAuthToken` middleware
- Client-side role checking backed by server-side validation

### Data Validation
- Input sanitization for content updates
- Rate limiting on all API endpoints
- Proper error messages that don't leak sensitive information

### Authorization
- Admin-only access to content management APIs
- User-specific checkout session creation
- Proper redirect handling to prevent unauthorized access

## Performance Considerations

### Caching
- Content data caching at API level
- Client-side caching of content data
- Proper cache invalidation on updates

### Loading States
- Skeleton loading for content management page
- Loading indicators for save operations
- Progressive loading for large content sets

### Error Recovery
- Retry mechanisms for failed API calls
- Graceful degradation when APIs are unavailable
- Offline handling where appropriate