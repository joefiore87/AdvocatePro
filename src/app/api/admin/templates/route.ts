// GET all templates, POST new template
import { NextRequest, NextResponse } from 'next/server';
import { getDbOrThrow } from '@/lib/firebase-admin';
import { AdminTemplateService } from '@/lib/admin-template-service';
import { rateLimiters } from '@/lib/rate-limit';
import { withAdminAuth, AdminUser } from '@/lib/admin-auth';

export const GET = withAdminAuth(async (req: NextRequest, adminUser: AdminUser) => {
    // Rate limit
    const limited = await rateLimiters.admin(req);
    if (limited) return limited;

    try {
      const db = getDbOrThrow();
      const db = getDbOrThrow();
      const adminConfigRef = db.collection('admin_config').doc('templates');
      const doc = await adminConfigRef.get();
      
      if (!doc.exists) {
        // Initialize with hardcoded templates
        const hardcodedTemplates = AdminTemplateService.convertHardcodedTemplates();
        const initialData = {
          hardcoded: hardcodedTemplates,
          custom: [],
          lastModified: new Date().toISOString(),
          version: 1
        };
        
        await adminConfigRef.set(initialData);
        
        return NextResponse.json({
          templates: [...hardcodedTemplates],
          categories: Object.keys(AdminTemplateService.getTemplatesByCategory(hardcodedTemplates))
        });
      }
      
      const data = doc.data();
      const allTemplates = [...(data?.hardcoded || []), ...(data?.custom || [])];
      
      return NextResponse.json({
        templates: allTemplates,
        categories: Object.keys(AdminTemplateService.getTemplatesByCategory(allTemplates))
      });
      
    } catch (error) {
      console.error('Error fetching templates:', error);
      return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
    }
});

export const POST = withAdminAuth(async (req: NextRequest, adminUser: AdminUser) => {
    // Rate limit
    const limited = await rateLimiters.admin(req);
    if (limited) return limited;

    try {
      const db = getDbOrThrow();
      const db = getDbOrThrow();
      const templateData = await req.json();
      
      // Validate template
      const errors = AdminTemplateService.validateTemplate(templateData);
      if (errors.length > 0) {
        return NextResponse.json({ error: 'Validation failed', errors }, { status: 400 });
      }
      
      // Create new template
      const newTemplate = {
        id: `custom-${Date.now()}`,
        name: templateData.name,
        description: templateData.description,
        category: templateData.category,
        body: templateData.body,
        variables: templateData.variables || [],
        isActive: true,
        isCustom: true,
        lastModified: new Date().toISOString(),
        createdBy: adminUser.uid
      };
      
      // Save to Firestore
      const adminConfigRef = db.collection('admin_config').doc('templates');
      const doc = await adminConfigRef.get();
      
      let currentData: any = { hardcoded: [], custom: [] };
      if (doc.exists) {
        currentData = doc.data();
      }
      
      currentData.custom = [...(currentData.custom || []), newTemplate];
      currentData.lastModified = new Date().toISOString();
      
      await adminConfigRef.set(currentData);
      
      return NextResponse.json({ 
        success: true, 
        template: newTemplate 
      });
      
    } catch (error) {
      console.error('Error creating template:', error);
      return NextResponse.json({ error: 'Failed to create template' }, { status: 500 });
    }
});
