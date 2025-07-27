import { NextRequest, NextResponse } from 'next/server';
import { getDbOrThrow } from '@/lib/firebase-admin';
import { AdminTemplateService } from '@/lib/admin-template-service';
import { withAdminAuth } from '@/lib/admin-auth';
import { rateLimiters } from '@/lib/rate-limit';

async function handleMigrateTemplates(req: NextRequest) {
  // Rate limit  
  const limited = await rateLimiters.admin(req);
  if (limited) return limited;

  const db = getDbOrThrow();
  // Check if migration has already been done
  const adminConfigRef = db.collection('admin_config').doc('templates');
  const doc = await adminConfigRef.get();
  
  if (doc.exists) {
    const data = doc.data();
    if (data?.version >= 1) {
      return NextResponse.json({ 
        message: 'Templates have already been migrated',
        alreadyMigrated: true
      });
    }
  }
  
  // Convert hardcoded templates
  const hardcodedTemplates = AdminTemplateService.convertHardcodedTemplates();
  
  // Create initial admin config
  const migrationData = {
    hardcoded: hardcodedTemplates,
    custom: [],
    lastModified: new Date().toISOString(),
    version: 1,
    migratedAt: new Date().toISOString()
  };
  
  // Save to Firestore
  await adminConfigRef.set(migrationData);
  
  return NextResponse.json({
    success: true,
    message: `Successfully migrated ${hardcodedTemplates.length} templates`,
    templateCount: hardcodedTemplates.length,
    categories: Object.keys(AdminTemplateService.getTemplatesByCategory(hardcodedTemplates))
  });
}

export const POST = withAdminAuth(handleMigrateTemplates);
