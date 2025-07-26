// Admin-specific types for dashboard management

export interface AdminTemplate {
  id: string;
  name: string;
  description: string;
  category: 'evaluation' | '504' | 'iep' | 'dispute' | 'records' | 'general';
  body: string;
  variables: string[]; // Extracted {{variables}}
  isActive: boolean;
  isCustom: boolean; // false for original templates, true for admin-created
  lastModified: string;
  createdBy?: string;
}

export interface AdminProfileStep {
  step: number;
  title: string;
  description?: string;
  isActive: boolean;
  fields: AdminProfileField[];
}

export interface AdminProfileField {
  id: string;
  step: number;
  label: string;
  type: 'text' | 'select' | 'checkbox' | 'textarea' | 'date' | 'multiselect';
  options?: string[]; // For select/checkbox/multiselect
  required: boolean;
  helpText?: string;
  validation?: string; // Regex pattern
  order: number;
  isActive: boolean;
  isCustom: boolean; // false for original fields, true for admin-added
}

export interface AdminAppearanceConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  layout: {
    containerWidth: string;
    spacing: 'compact' | 'normal' | 'spacious';
    borderRadius: string;
  };
  lastModified: string;
}

export interface AdminPricingConfig {
  tiers: {
    [key: string]: {
      name: string;
      price: number;
      stripeId: string;
      features: string[];
      letterLimit: number;
      isActive: boolean;
    };
  };
  lastModified: string;
}

export interface AdminUserData {
  uid: string;
  email: string;
  displayName?: string;
  subscription: {
    tier: string;
    status: 'active' | 'canceled' | 'past_due' | 'incomplete';
    periodEnd: string;
    lettersUsed: number;
    lettersLimit: number;
  };
  createdAt: string;
  lastLogin: string;
  isAdmin: boolean;
}

export interface AdminAnalytics {
  users: {
    total: number;
    active: number;
    new: number;
  };
  templates: {
    totalUsage: number;
    popularTemplates: Array<{
      id: string;
      name: string;
      usageCount: number;
    }>;
  };
  subscriptions: {
    active: number;
    canceled: number;
    revenue: number;
  };
}

// Template category definitions
export const TEMPLATE_CATEGORIES = {
  evaluation: {
    name: 'Evaluation Requests',
    description: 'Letters requesting initial evaluations, re-evaluations, and IEEs'
  },
  '504': {
    name: '504 Plans',
    description: 'Letters related to Section 504 accommodations and plans'
  },
  iep: {
    name: 'IEP Related',
    description: 'IEP meeting requests, concerns, and modifications'
  },
  dispute: {
    name: 'Dispute Resolution',
    description: 'Mediation, due process, and complaint letters'
  },
  records: {
    name: 'Records Requests',
    description: 'FERPA requests and consent management'
  },
  general: {
    name: 'General Advocacy',
    description: 'General advocacy and communication letters'
  }
} as const;

// Default profile builder configuration based on existing form
export const DEFAULT_PROFILE_STEPS: AdminProfileStep[] = [
  {
    step: 1,
    title: 'Student Basics',
    description: 'Basic student and school information',
    isActive: true,
    fields: [
      {
        id: 'child.name',
        step: 1,
        label: "What is your child's full name?",
        type: 'text',
        required: true,
        order: 1,
        isActive: true,
        isCustom: false
      },
      {
        id: 'child.dob',
        step: 1,
        label: "When was your child born?",
        type: 'date',
        required: false,
        order: 2,
        isActive: true,
        isCustom: false
      },
      {
        id: 'child.grade',
        step: 1,
        label: "Select your child's current grade level:",
        type: 'select',
        options: ['Pre-K', 'Kindergarten', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12', 'Post-Secondary'],
        required: false,
        order: 3,
        isActive: true,
        isCustom: false
      },
      {
        id: 'school.name',
        step: 1,
        label: "What is the name of your child's school?",
        type: 'text',
        required: false,
        order: 4,
        isActive: true,
        isCustom: false
      },
      {
        id: 'school.district',
        step: 1,
        label: "What school district is your child enrolled in?",
        type: 'text',
        required: false,
        order: 5,
        isActive: true,
        isCustom: false
      },
      {
        id: 'primaryLanguage',
        step: 1,
        label: "What is the primary language spoken in your home?",
        type: 'select',
        options: ['English', 'Spanish', 'Mandarin', 'Arabic', 'French', 'Other', 'Prefer not to say'],
        required: false,
        order: 6,
        isActive: true,
        isCustom: false
      }
    ]
  },
  {
    step: 2,
    title: 'Disability & Eligibility',
    description: 'Special education evaluation and eligibility status',
    isActive: true,
    fields: [
      {
        id: 'schoolEvaluation',
        step: 2,
        label: "Has your child ever been evaluated by the school district for special education?",
        type: 'select',
        options: ['Yes', 'No', 'Evaluation in progress', 'Requested, not started'],
        required: false,
        order: 1,
        isActive: true,
        isCustom: false
      },
      {
        id: 'evaluationOutcome',
        step: 2,
        label: "What was the outcome of the evaluation?",
        type: 'select',
        options: ['Eligible', 'Not eligible', 'Pending results', 'Not sure'],
        required: false,
        order: 2,
        isActive: true,
        isCustom: false
      },
      {
        id: 'eligibilityCategory',
        step: 2,
        label: "What is your child's IDEA eligibility category?",
        type: 'select',
        options: ['Autism', 'Deafness', 'Emotional Disturbance', 'Hearing Impairment', 'Intellectual Disability', 'Multiple Disabilities', 'Orthopedic Impairment', 'Other Health Impairment', 'Specific Learning Disability', 'Speech or Language Impairment', 'Traumatic Brain Injury', 'Visual Impairment', "I'm not sure"],
        required: false,
        order: 3,
        isActive: true,
        isCustom: false
      }
    ]
  },
  {
    step: 3,
    title: 'Educational Program',
    description: 'Current IEP and educational placement',
    isActive: true,
    fields: [
      {
        id: 'hasIEP',
        step: 3,
        label: "Does your child currently have an IEP?",
        type: 'select',
        options: ['Yes', 'No', 'Had in past'],
        required: false,
        order: 1,
        isActive: true,
        isCustom: false
      },
      {
        id: 'classroomSetting',
        step: 3,
        label: "What is the primary classroom setting?",
        type: 'select',
        options: ['General ed', 'ICT', 'Resource room', 'Self-contained', 'Specialized school', 'Not sure'],
        required: false,
        order: 2,
        isActive: true,
        isCustom: false
      }
    ]
  },
  {
    step: 4,
    title: 'Services & Supports',
    description: 'Related services, accommodations, and modifications',
    isActive: true,
    fields: [
      {
        id: 'relatedServices',
        step: 4,
        label: "Related services in the IEP?",
        type: 'multiselect',
        options: ['Speech', 'OT', 'PT', 'Counseling', 'Psychology', 'Hearing/Audiology', 'Vision', 'Orientation/Mobility', 'Assistive Tech', 'Nursing', 'None'],
        required: false,
        order: 1,
        isActive: true,
        isCustom: false
      },
      {
        id: 'accommodations',
        step: 4,
        label: "Accommodations in the IEP?",
        type: 'multiselect',
        options: ['Extended time', 'Breaks', 'Reduced assignments', 'Preferential seating', 'Written directions', 'Calculator/computer', 'Audio/read aloud', 'Large print', 'Quiet environment', 'Visual cues', 'Organizational supports', 'None'],
        required: false,
        order: 2,
        isActive: true,
        isCustom: false
      }
    ]
  },
  {
    step: 5,
    title: 'Progress & Concerns',
    description: 'Current progress and areas of concern',
    isActive: true,
    fields: [
      {
        id: 'goalProgress',
        step: 5,
        label: "Is your child making progress on IEP goals?",
        type: 'select',
        options: ['All goals', 'Some goals', 'Limited', 'None', 'Not sure'],
        required: false,
        order: 1,
        isActive: true,
        isCustom: false
      },
      {
        id: 'primaryConcerns',
        step: 5,
        label: 'What concerns do you have?',
        type: 'multiselect',
        options: ['Need for eval', 'Disagree with eval', 'IEP goals inappropriate', 'Services not delivered', 'Insufficient services', 'Placement too restrictive', 'Placement not restrictive enough', 'Behavior issues', 'No progress', 'Poor communication', 'Discipline issues', 'Transition support', 'Other'],
        required: false,
        order: 2,
        isActive: true,
        isCustom: false
      }
    ]
  },
  {
    step: 6,
    title: 'Communication & Next Steps',
    description: 'School contacts and desired outcomes',
    isActive: true,
    fields: [
      {
        id: 'schoolContacts',
        step: 6,
        label: 'Who have you contacted?',
        type: 'multiselect',
        options: ['SpEd Teacher', 'GenEd Teacher', 'Principal/AP', 'Psychologist', 'CSE Chair', 'Related Service Provider', 'Counselor', 'SpEd Coordinator', 'Superintendent', 'No one'],
        required: false,
        order: 1,
        isActive: true,
        isCustom: false
      },
      {
        id: 'desiredOutcomes',
        step: 6,
        label: 'What outcome do you want?',
        type: 'multiselect',
        options: ['Initial evaluation', 'Independent evaluation', 'IEP meeting', 'Change goals', 'Add/change services', 'Change placement', 'BIP', 'Compensatory services', 'Staff training', 'Better communication', 'Resolve discipline issue', 'Other'],
        required: false,
        order: 2,
        isActive: true,
        isCustom: false
      },
      {
        id: 'additionalInfo',
        step: 6,
        label: "Additional information",
        type: 'textarea',
        required: false,
        helpText: "Free text for any additional details",
        order: 3,
        isActive: true,
        isCustom: false
      }
    ]
  }
];

// Utility functions
export function extractTemplateVariables(templateBody: string): string[] {
  const variableRegex = /\{\{([^}]+)\}\}/g;
  const variables: string[] = [];
  let match;
  
  while ((match = variableRegex.exec(templateBody)) !== null) {
    if (!variables.includes(match[1])) {
      variables.push(match[1]);
    }
  }
  
  return variables.sort();
}

export function validateTemplateVariables(templateBody: string, requiredVariables?: string[]): string[] {
  const foundVariables = extractTemplateVariables(templateBody);
  const errors: string[] = [];
  
  if (requiredVariables) {
    const missingRequired = requiredVariables.filter(v => !foundVariables.includes(v));
    if (missingRequired.length > 0) {
      errors.push(`Missing required variables: ${missingRequired.join(', ')}`);
    }
  }
  
  // Check for malformed variables (single braces, etc.)
  const malformedRegex = /(?<!\{)\{[^{}]+\}(?!\})/g;
  const malformed = templateBody.match(malformedRegex);
  if (malformed) {
    errors.push(`Malformed variables found: ${malformed.join(', ')}. Use {{variable}} format.`);
  }
  
  return errors;
}
