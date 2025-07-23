export interface ContentItem {
  id: string;
  type: string;
  value: string;
  lastUpdated: string;
  updatedBy?: string;
  category: string;
}

export interface ContentCategory {
  id: string;
  name: string;
  description: string;
  items: ContentItem[];
}

export const DEFAULT_CONTENT = {
  pageContent: {
    id: 'pageContent',
    name: 'Page Content',
    description: 'Main website text and headings',
    items: [
      {
        id: 'heroTitle',
        type: 'text',
        value: 'You know your child better than anyone. Now get the tools to help schools see it too.',
        lastUpdated: new Date().toISOString(),
        category: 'pageContent'
      },
      {
        id: 'heroDescription',
        type: 'textarea',
        value: 'Create clear, professional advocacy letters using what you already know about your child. Everything stays private on your computer—no uploading personal information anywhere.',
        lastUpdated: new Date().toISOString(),
        category: 'pageContent'
      },
      {
        id: 'pricingAmount',
        type: 'text',
        value: '$29.99/year',
        lastUpdated: new Date().toISOString(),
        category: 'pageContent'
      },
      {
        id: 'pricingDescription',
        type: 'text',
        value: 'Includes everything listed above. Install on up to 2 computers. 30-day refund if it doesn\'t help.',
        lastUpdated: new Date().toISOString(),
        category: 'pageContent'
      }
    ]
  },
  features: {
    id: 'features',
    name: 'Features',
    description: 'What\'s included in the toolkit',
    items: [
      {
        id: 'feature1',
        type: 'text',
        value: '20 letter templates for different situations (evaluation requests, meeting requests, follow-ups, etc.)',
        lastUpdated: new Date().toISOString(),
        category: 'features'
      },
      {
        id: 'feature2',
        type: 'text',
        value: '7 learning modules explaining special education processes and parent rights',
        lastUpdated: new Date().toISOString(),
        category: 'features'
      },
      {
        id: 'feature3',
        type: 'text',
        value: 'Works offline - install once, use anywhere',
        lastUpdated: new Date().toISOString(),
        category: 'features'
      },
      {
        id: 'feature4',
        type: 'text',
        value: 'Updates included when new templates are added',
        lastUpdated: new Date().toISOString(),
        category: 'features'
      }
    ]
  },
  letterTemplates: {
    id: 'letterTemplates',
    name: 'Letter Templates',
    description: 'Templates for advocacy letters',
    items: [
      {
        id: 'evaluationRequest',
        type: 'textarea',
        value: 'Dear [Principal Name],\n\nI am writing to formally request a comprehensive evaluation for my child, [Child Name], who is currently in [Grade] at [School Name]. I have concerns about [Child\'s Concerns] and believe an evaluation is necessary to determine if special education services are needed.\n\nPlease consider this letter my formal request for an evaluation under the Individuals with Disabilities Education Act (IDEA). I understand that the school has 60 days to complete this evaluation from the date of my consent.\n\nPlease send me the necessary consent forms and information about the evaluation process. I look forward to working with the school to ensure my child receives the support they need.\n\nSincerely,\n[Parent Name]',
        lastUpdated: new Date().toISOString(),
        category: 'letterTemplates'
      },
      {
        id: 'iepMeetingRequest',
        type: 'textarea',
        value: 'Dear [Special Education Coordinator],\n\nI am writing to request an IEP meeting for my child, [Child Name], Student ID [Student ID]. I would like to discuss [specific concerns or changes needed].\n\nPlease let me know some available dates and times in the next two weeks. I am generally available [your availability].\n\nThank you for your attention to this matter.\n\nSincerely,\n[Parent Name]\n[Phone Number]\n[Email]',
        lastUpdated: new Date().toISOString(),
        category: 'letterTemplates'
      }
    ]
  },
  educationalModules: {
    id: 'educationalModules',
    name: 'Educational Modules',
    description: 'Learning content about special education',
    items: [
      {
        id: 'module1',
        type: 'textarea',
        value: '# Understanding IDEA\n\nThe Individuals with Disabilities Education Act (IDEA) is a law that ensures services to children with disabilities throughout the nation. IDEA governs how states and public agencies provide early intervention, special education, and related services.\n\nKey principles include:\n- Free Appropriate Public Education (FAPE)\n- Appropriate evaluation\n- Individualized Education Program (IEP)\n- Least Restrictive Environment (LRE)\n- Parent participation\n- Procedural safeguards',
        lastUpdated: new Date().toISOString(),
        category: 'educationalModules'
      },
      {
        id: 'module2',
        type: 'textarea',
        value: '# The IEP Process\n\nAn Individualized Education Program (IEP) is a written document that\'s developed for each public school child who is eligible for special education.\n\nThe IEP process includes:\n1. Referral for evaluation\n2. Evaluation\n3. Eligibility determination\n4. IEP development\n5. IEP implementation\n6. Progress monitoring and review\n\nParents are essential team members in this process and have specific rights.',
        lastUpdated: new Date().toISOString(),
        category: 'educationalModules'
      }
    ]
  }
};