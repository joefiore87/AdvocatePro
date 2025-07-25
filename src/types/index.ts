// User Management Types
export interface User {
  uid: string;
  email: string;
  displayName: string;
  createdAt: Date;
  lastLoginAt: Date;
  subscriptionStatus: 'none' | 'active' | 'expired' | 'cancelled';
  trialUsed: boolean;
  customClaims: {
    hasAccess: boolean;
    role: 'user' | 'admin';
  };
}

// Student Profile Types
export interface StudentProfile {
  id: string;
  studentName: string;
  grade: string;
  school: string;
  studentId?: string;
  parentName?: string;
  concerns: string[];
  accommodations: string[];
  disabilities?: string[];
  currentServices?: string[];
  goals?: string[];
  createdAt: Date;
  updatedAt: Date;
  userEmail: string;
}

// Letter Generation Types
export interface GeneratedLetter {
  id: string;
  templateId: string;
  studentProfileId: string;
  content: string;
  subject: string;
  generatedAt: Date;
  customizations?: Record<string, string>;
  userEmail: string;
}

export interface LetterTemplate {
  id: string;
  title: string;
  description: string;
  value: string; // Template content
  category: string;
  type: 'textarea' | 'text';
  placeholders: string[]; // List of available placeholders
  lastUpdated: string;
  isPremium: boolean;
}

// Subscription Types
export interface Subscription {
  customerId: string;
  email: string;
  subscriptionId: string;
  status: 'active' | 'past_due' | 'canceled' | 'incomplete';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  priceId: string;
  planType: 'annual' | 'monthly';
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  customerId: string;
  email: string;
  sessionId: string;
  paymentIntentId?: string;
  paymentStatus: 'succeeded' | 'pending' | 'failed';
  amount: number; // in cents
  currency: string;
  purchaseDate: Date;
  expirationDate: Date;
  firebaseUid?: string;
}

// Content Management Types
export interface ContentItem {
  id: string;
  type: 'text' | 'textarea' | 'html';
  value: string;
  lastUpdated: string;
  updatedBy?: string;
  category: string;
  isPremium?: boolean;
  isSample?: boolean;
}

export interface ContentCategory {
  id: string;
  name: string;
  description: string;
  items: ContentItem[];
  isPremium?: boolean;
}

// Premium Content Types
export interface PremiumContent {
  letterTemplates: ContentCategory;
  educationalModules: ContentCategory;
  profileTemplates: ContentCategory;
  resources: ContentCategory;
}

// Educational Module Types
export interface EducationalModule {
  id: string;
  title: string;
  description: string;
  content: string;
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  topics: string[];
  lastUpdated: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

// Form Types
export interface StudentProfileForm {
  studentName: string;
  grade: string;
  school: string;
  studentId?: string;
  parentName?: string;
  concerns: string[];
  accommodations: string[];
  disabilities?: string[];
  currentServices?: string[];
  goals?: string[];
}

export interface LetterGenerationForm {
  templateId: string;
  studentProfileId: string;
  customizations?: Record<string, string>;
  customSubject?: string;
}

// Auth Types
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
}

export interface UserClaims {
  role: 'user' | 'admin';
  hasAccess: boolean;
  subscriptionStatus: 'active' | 'expired' | 'cancelled' | 'none';
  expiresAt?: number;
}

// System Types
export interface SystemConfig {
  initialized: boolean;
  lastUpdated: string;
  version: string;
  features: {
    templateGenerator: boolean;
    profileBuilder: boolean;
    educationalModules: boolean;
  };
  maintenance: {
    enabled: boolean;
    message?: string;
  };
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

// Analytics Types
export interface UserAnalytics {
  userId: string;
  email: string;
  lastLogin: Date;
  profilesCreated: number;
  lettersGenerated: number;
  modulesCompleted: number;
  subscriptionStart: Date;
  planType: string;
}

export interface SystemAnalytics {
  totalUsers: number;
  activeSubscriptions: number;
  lettersGenerated: number;
  profilesCreated: number;
  revenue: number;
  conversionRate: number;
}
