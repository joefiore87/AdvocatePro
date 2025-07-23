# API Documentation

## Overview

This document provides documentation for the server-side API endpoints used in the application. All protected endpoints require authentication via Firebase ID token in the `Authorization` header.

## Authentication

### Headers

All protected endpoints require the following header:

```
Authorization: Bearer <firebase-id-token>
```

### Endpoints

#### GET /api/auth/get-role

Get the role of the authenticated user.

**Authentication Required**: Yes

**Response**:
```json
{
  "role": "admin" | "customer" | null
}
```

#### POST /api/auth/set-role

Set the role of a user. Requires admin access.

**Authentication Required**: Yes (Admin)

**Request Body**:
```json
{
  "email": "user@example.com",
  "role": "admin" | "customer"
}
```

**Response**:
```json
{
  "success": true
}
```

#### POST /api/auth/initialize-admin

Initialize the first admin user. If no admin exists, any authenticated user can call this. Otherwise, only admins can call it.

**Authentication Required**: Yes

**Request Body**:
```json
{
  "email": "admin@example.com"
}
```

**Response**:
```json
{
  "success": true
}
```

#### GET /api/auth/verify-admin

Verify if the authenticated user is an admin.

**Authentication Required**: Yes

**Response**:
```json
{
  "isAdmin": true | false
}
```

## Content Management

#### GET /api/admin/content

Get transformed content for the homepage. Requires admin access.

**Authentication Required**: Yes (Admin)

**Response**:
```json
{
  "content": {
    "homepage-hero": "...",
    "homepage-description": "...",
    "annual-pricing": "...",
    "whats-included-title": "...",
    "features-list": "..."
  }
}
```

#### GET /api/admin/content/raw

Get raw content structure. Requires admin access.

**Authentication Required**: Yes (Admin)

**Response**:
```json
{
  "content": {
    "pageContent": {
      "id": "pageContent",
      "name": "Page Content",
      "description": "Main website text and headings",
      "items": [
        {
          "id": "heroTitle",
          "type": "text",
          "value": "...",
          "lastUpdated": "...",
          "category": "pageContent"
        },
        // ...
      ]
    },
    // ...
  }
}
```

#### GET /api/admin/content/category/:categoryId

Get a specific content category. Requires admin access.

**Authentication Required**: Yes (Admin)

**Path Parameters**:
- `categoryId`: ID of the content category

**Response**:
```json
{
  "category": {
    "id": "pageContent",
    "name": "Page Content",
    "description": "Main website text and headings",
    "items": [
      {
        "id": "heroTitle",
        "type": "text",
        "value": "...",
        "lastUpdated": "...",
        "category": "pageContent"
      },
      // ...
    ]
  }
}
```

#### PUT /api/admin/content/:categoryId/:itemId

Update a specific content item. Requires admin access.

**Authentication Required**: Yes (Admin)

**Path Parameters**:
- `categoryId`: ID of the content category
- `itemId`: ID of the content item

**Request Body**:
```json
{
  "value": "New content value"
}
```

**Response**:
```json
{
  "success": true,
  "item": {
    "id": "heroTitle",
    "type": "text",
    "value": "New content value",
    "lastUpdated": "...",
    "category": "pageContent",
    "updatedBy": "admin@example.com"
  }
}
```

## Subscription Management

#### GET /api/subscription/check-access

Check if the authenticated user has access to the toolkit.

**Authentication Required**: Yes

**Response**:
```json
{
  "hasAccess": true | false
}
```

#### GET /api/subscription/get

Get the subscription details for the authenticated user.

**Authentication Required**: Yes

**Response**:
```json
{
  "subscription": {
    "customerId": "cus_...",
    "email": "user@example.com",
    "purchaseDate": "...",
    "expirationDate": "...",
    "active": true
  }
}
```

## Stripe Integration

#### POST /api/stripe/create-checkout-session

Create a Stripe checkout session for purchasing the toolkit.

**Authentication Required**: Yes

**Response**:
```json
{
  "url": "https://checkout.stripe.com/..."
}
```

#### GET /api/stripe/verify-session

Verify a Stripe checkout session.

**Authentication Required**: No

**Query Parameters**:
- `session_id`: ID of the Stripe checkout session

**Response**:
```json
{
  "success": true,
  "status": "paid",
  "customer": "cus_...",
  "customerId": "cus_...",
  "customerEmail": "user@example.com"
}
```

## Public Content

#### GET /api/content

Get public content for the homepage.

**Authentication Required**: No

**Response**:
```json
{
  "content": {
    "homepage-hero": "...",
    "homepage-description": "...",
    "annual-pricing": "...",
    "whats-included-title": "...",
    "features-list": "..."
  }
}
```