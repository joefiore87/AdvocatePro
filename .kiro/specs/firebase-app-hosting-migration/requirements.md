# Requirements Document

## Introduction

The project currently has two live Firebase deployments: a working but accidental site on classic Firebase Hosting (advocate-empower.web.app) and a broken but intended site on modern Firebase App Hosting (iepturboparentpro--...). The goal is to fix the modern App Hosting deployment and establish it as the official production site, while properly handling the transition from the classic hosting setup.

## Requirements

### Requirement 1

**User Story:** As a project maintainer, I want to fix the broken Firebase App Hosting deployment so that the modern hosting infrastructure works correctly.

#### Acceptance Criteria

1. WHEN the App Hosting deployment is triggered THEN the build process SHALL complete successfully without errors
2. WHEN the App Hosting site is accessed THEN it SHALL serve the application correctly with all functionality working
3. WHEN environment variables are needed THEN they SHALL be properly configured in the App Hosting environment
4. WHEN the deployment completes THEN the site SHALL be accessible at the intended App Hosting URL

### Requirement 2

**User Story:** As a project maintainer, I want to ensure the App Hosting deployment uses the correct Firebase project configuration so that all services work properly.

#### Acceptance Criteria

1. WHEN the App Hosting deployment runs THEN it SHALL use the correct Firebase project ID and configuration
2. WHEN Firestore operations are performed THEN they SHALL connect to the correct database instance
3. WHEN authentication is used THEN it SHALL work with the proper Firebase Auth configuration
4. WHEN the application initializes THEN all Firebase services SHALL be properly connected

### Requirement 3

**User Story:** As a project maintainer, I want to migrate any necessary configuration from the classic hosting setup to App Hosting so that no functionality is lost.

#### Acceptance Criteria

1. WHEN comparing configurations THEN all necessary environment variables SHALL be identified and migrated
2. WHEN the App Hosting site runs THEN it SHALL have the same functionality as the working classic hosting site
3. WHEN external integrations (Stripe, etc.) are tested THEN they SHALL work correctly with the new deployment
4. IF custom domains exist THEN they SHALL be properly configured for App Hosting

### Requirement 4

**User Story:** As a project maintainer, I want to establish proper deployment processes for the App Hosting site so that future deployments are reliable.

#### Acceptance Criteria

1. WHEN deployment scripts are run THEN they SHALL target the App Hosting backend correctly
2. WHEN the build process runs THEN it SHALL use the correct build configuration for App Hosting
3. WHEN deployments are triggered THEN they SHALL follow a consistent and documented process
4. WHEN deployment issues occur THEN there SHALL be clear debugging and rollback procedures

### Requirement 5

**User Story:** As a project maintainer, I want to properly handle the transition from classic hosting to App Hosting so that there's no service disruption.

#### Acceptance Criteria

1. WHEN the App Hosting site is confirmed working THEN a plan SHALL exist for handling the classic hosting site
2. WHEN users access the old classic hosting URL THEN they SHALL be appropriately redirected or informed
3. WHEN the transition is complete THEN the App Hosting site SHALL be the primary production deployment
4. WHEN documentation is updated THEN it SHALL reflect the new App Hosting deployment process