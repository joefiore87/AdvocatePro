// Service for managing admin templates
import { letterTemplates } from './templates';
import { AdminTemplate, extractTemplateVariables, TEMPLATE_CATEGORIES } from './admin-types';

export class AdminTemplateService {
  
  /**
   * Convert hardcoded templates to admin format
   */
  static convertHardcodedTemplates(): AdminTemplate[] {
    return letterTemplates.map((template, index) => ({
      id: template.id,
      name: template.name,
      description: template.description,
      category: this.categorizeTemplate(template.id),
      body: template.body,
      variables: extractTemplateVariables(template.body),
      isActive: true,
      isCustom: false, // Original hardcoded templates
      lastModified: new Date().toISOString(),
      createdBy: 'system'
    }));
  }
  
  /**
   * Categorize templates based on their ID
   */
  private static categorizeTemplate(templateId: string): AdminTemplate['category'] {
    const id = templateId.toLowerCase();
    
    if (id.includes('evaluation') || id.includes('iee')) return 'evaluation';
    if (id.includes('504')) return '504';
    if (id.includes('iep') || id.includes('meeting') || id.includes('transition')) return 'iep';
    if (id.includes('mediation') || id.includes('due-process') || id.includes('dispute') || id.includes('hearing')) return 'dispute';
    if (id.includes('records') || id.includes('ferpa') || id.includes('consent') || id.includes('revoke')) return 'records';
    
    return 'general';
  }
  
  /**
   * Get templates by category
   */
  static getTemplatesByCategory(templates: AdminTemplate[]): Record<string, AdminTemplate[]> {
    return templates.reduce((acc, template) => {
      if (!acc[template.category]) {
        acc[template.category] = [];
      }
      acc[template.category].push(template);
      return acc;
    }, {} as Record<string, AdminTemplate[]>);
  }
  
  /**
   * Search templates by name or content
   */
  static searchTemplates(templates: AdminTemplate[], query: string): AdminTemplate[] {
    const searchTerm = query.toLowerCase();
    return templates.filter(template => 
      template.name.toLowerCase().includes(searchTerm) ||
      template.description.toLowerCase().includes(searchTerm) ||
      template.body.toLowerCase().includes(searchTerm) ||
      template.variables.some(v => v.toLowerCase().includes(searchTerm))
    );
  }
  
  /**
   * Validate template before save
   */
  static validateTemplate(template: Partial<AdminTemplate>): string[] {
    const errors: string[] = [];
    
    if (!template.name?.trim()) {
      errors.push('Template name is required');
    }
    
    if (!template.description?.trim()) {
      errors.push('Template description is required');
    }
    
    if (!template.body?.trim()) {
      errors.push('Template body is required');
    }
    
    if (!template.category) {
      errors.push('Template category is required');
    }
    
    if (template.body) {
      const variableErrors = this.validateTemplateVariables(template.body);
      errors.push(...variableErrors);
    }
    
    return errors;
  }
  
  /**
   * Validate template variables
   */
  private static validateTemplateVariables(body: string): string[] {
    const errors: string[] = [];
    
    // Check for malformed variables
    const malformedRegex = /(?<!\{)\{[^{}]+\}(?!\})/g;
    const malformed = body.match(malformedRegex);
    if (malformed) {
      errors.push(`Malformed variables found: ${malformed.join(', ')}. Use {{variable}} format.`);
    }
    
    // Check for empty variables
    const emptyVarRegex = /\{\{\s*\}\}/g;
    if (emptyVarRegex.test(body)) {
      errors.push('Empty variables {{}} are not allowed');
    }
    
    return errors;
  }
  
  /**
   * Generate template preview with sample data
   */
  static generatePreview(template: AdminTemplate): string {
    const sampleData: Record<string, string> = {
      childName: 'Alex Johnson',
      childDob: '2010-05-15',
      childGrade: 'Grade 8',
      childStudentId: 'AJ123456',
      childConcerns: 'difficulty with reading comprehension and written expression',
      schoolName: 'Lincoln Middle School',
      schoolDistrict: 'Metropolitan School District',
      principalName: 'Smith',
      parent1Name: 'Sarah Johnson',
      parent1Phone: '(555) 123-4567',
      parent1Email: 'sarah.johnson@email.com',
      schoolSpecialEducationCoordinator: 'Wilson',
      // Add more sample data as needed
    };
    
    let preview = template.body;
    
    // Replace all variables with sample data
    template.variables.forEach(variable => {
      const sampleValue = sampleData[variable] || `[${variable}]`;
      const regex = new RegExp(`\\{\\{${variable}\\}\\}`, 'g');
      preview = preview.replace(regex, sampleValue);
    });
    
    return preview;
  }
  
  /**
   * Get template usage statistics (placeholder for future analytics)
   */
  static getTemplateUsageStats(templateId: string): {
    usageCount: number;
    lastUsed: string | null;
    averageRating: number | null;
  } {
    // This would be implemented with actual analytics data
    return {
      usageCount: 0,
      lastUsed: null,
      averageRating: null
    };
  }
}

// Default admin configuration
export const DEFAULT_ADMIN_CONFIG = {
  templates: {
    hardcoded: AdminTemplateService.convertHardcodedTemplates(),
    custom: [] as AdminTemplate[]
  },
  appearance: {
    colors: {
      primary: '#3b82f6',
      secondary: '#64748b', 
      accent: '#06b6d4',
      background: '#ffffff',
      text: '#111827'
    },
    fonts: {
      heading: 'Inter, sans-serif',
      body: 'Inter, sans-serif'
    },
    layout: {
      containerWidth: '1280px',
      spacing: 'normal' as const,
      borderRadius: '0.5rem'
    },
    lastModified: new Date().toISOString()
  },
  pricing: {
    tiers: {
      basic: {
        name: 'Basic',
        price: 0,
        stripeId: '',
        features: ['5 letters/month', 'Basic templates', 'Email support'],
        letterLimit: 5,
        isActive: true
      },
      pro: {
        name: 'Pro',
        price: 29,
        stripeId: 'price_pro_monthly',
        features: ['15 letters/month', 'Advanced templates', 'Priority support', 'Custom branding'],
        letterLimit: 15,
        isActive: true
      },
      enterprise: {
        name: 'Enterprise',
        price: 99,
        stripeId: 'price_enterprise_monthly',
        features: ['50 letters/month', 'Unlimited templates', 'Phone support', 'White-label', 'API access'],
        letterLimit: 50,
        isActive: true
      }
    },
    lastModified: new Date().toISOString()
  }
};
