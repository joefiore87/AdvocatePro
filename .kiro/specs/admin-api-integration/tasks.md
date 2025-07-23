# Implementation Plan

- [x] 1. Create individual content item update API endpoint
  - Create new API route at `src/app/api/admin/content/[categoryId]/[itemId]/route.ts`
  - Implement PUT handler with admin authentication and rate limiting
  - Add input validation for content value updates
  - Include proper error handling and response formatting
  - _Requirements: 1.2, 1.3, 1.4_

- [x] 2. Update admin content page to use server APIs
  - Remove direct Firestore imports from `src/app/admin/content/page.tsx`
  - Replace `getAllContent()` call with fetch to `/api/admin/content`
  - Replace `updateContentItem()` call with fetch to new individual update endpoint
  - Add proper error handling for API responses with user-friendly messages
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 3. Create server-only content service for API routes
  - Create new file `src/lib/server/content-service.ts` with server-side Firestore operations
  - Move all Firestore database operations from client-side service to server-side
  - Update existing API routes to use new server-side content service
  - Ensure proper error handling and logging in server-side operations
  - _Requirements: 3.1, 3.2, 3.3_

- [x] 4. Refactor client-side content service to use HTTP requests only
  - Remove all Firestore imports from `src/lib/content-service.ts`
  - Replace direct database operations with HTTP API calls
  - Implement proper error handling and response parsing
  - Add TypeScript interfaces for API request/response types
  - _Requirements: 3.1, 3.2, 3.4_

- [x] 5. Update purchase page to use dynamic checkout API
  - Remove hardcoded Stripe payment link from `src/app/purchase/page.tsx`
  - Add function to call `/api/stripe/create-checkout-session` endpoint
  - Implement loading state during checkout session creation
  - Add error handling for checkout session creation failures
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 6. Enhance checkout flow with proper redirect handling
  - Update checkout success handling to validate session on success page
  - Ensure proper error messages are displayed for checkout failures
  - Add retry mechanism for failed checkout session creation
  - Test and verify success/cancel redirect URLs work correctly
  - _Requirements: 2.3, 2.4_

- [x] 7. Verify and strengthen admin layout role checking
  - Review `src/app/admin/layout.tsx` authentication and authorization logic
  - Ensure `isAdmin` flag is properly validated against server-side roles
  - Test unauthorized access scenarios and verify proper redirects
  - Add additional security logging for admin access attempts
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 8. Remove all remaining client-side Firestore operations
  - Audit entire codebase for any remaining direct Firestore client imports
  - Update any components or services still using client-side database operations
  - Ensure all data access goes through authenticated API endpoints
  - Remove unused Firestore client dependencies where possible
  - _Requirements: 3.4_

- [x] 9. Add comprehensive error handling and loading states
  - Implement consistent error handling patterns across all updated components
  - Add loading skeletons and indicators for all API operations
  - Create reusable error boundary components for API failures
  - Test error scenarios and ensure user-friendly error messages
  - _Requirements: 1.3, 2.3_

- [x] 10. Perform system integration testing and review
  - Test complete admin content management workflow end-to-end
  - Verify purchase flow works correctly with dynamic checkout
  - Test authentication and authorization flows for all user types
  - Perform security review to ensure no unauthorized access paths
  - _Requirements: 5.1, 5.2, 5.3, 5.4_