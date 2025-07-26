import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { AdminTemplateService } from '@/lib/admin-template-service';
import { withAdminAuth } from '@/lib/admin-auth';
import { rateLimiters } from '@/lib/rate-limit';

interface RouteParams {
  id: string;
}

async function handleGetTemplate(
  req: NextRequest,
  { params }: { params: RouteParams }
) {
  // Rate limit
  const limited = await rateLimiters.admin(req);
  if (limited) return limited;

  const templateId = params.id;
  
  const adminConfigRef = db.collection('admin_config').doc('templates');
  const doc = await adminConfigRef.get();
  
  if (!doc.exists) {
    return NextResponse.json({ error: 'Templates not found' }, { status: 404 });
  }
  
  const data = doc.data();
  const allTemplates = [...(data?.hardcoded || []), ...(data?.custom || [])];
  const template = allTemplates.find(t => t.id === templateId);
  
  if (!template) {
    return NextResponse.json({ error: 'Template not found' }, { status: 404 });
  }
  
  return NextResponse.json({ template });
}

async function handleUpdateTemplate(
  req: NextRequest,
  { params }: { params: RouteParams }
) {
  // Rate limit
  const limited = await rateLimiters.admin(req);
  if (limited) return limited;

  const templateId = params.id;
  const updateData = await req.json();
  
  // Validate template
  const errors = AdminTemplateService.validateTemplate(updateData);
  if (errors.length > 0) {
    return NextResponse.json({ error: 'Validation failed', errors }, { status: 400 });
  }
  
  const adminConfigRef = db.collection('admin_config').doc('templates');
  const doc = await adminConfigRef.get();
  
  if (!doc.exists) {
    return NextResponse.json({ error: 'Templates not found' }, { status: 404 });
  }
  
  const currentData = doc.data() as any;
  
  // Find and update template
  let templateFound = false;
  
  // Check hardcoded templates
  if (currentData.hardcoded) {
    const index = currentData.hardcoded.findIndex((t: any) => t.id === templateId);
    if (index !== -1) {
      currentData.hardcoded[index] = {
        ...currentData.hardcoded[index],
        ...updateData,
        lastModified: new Date().toISOString()
      };
      templateFound = true;
    }
  }
  
  // Check custom templates
  if (!templateFound && currentData.custom) {
    const index = currentData.custom.findIndex((t: any) => t.id === templateId);
    if (index !== -1) {
      currentData.custom[index] = {
        ...currentData.custom[index],
        ...updateData,
        lastModified: new Date().toISOString()
      };
      templateFound = true;
    }
  }
  
  if (!templateFound) {
    return NextResponse.json({ error: 'Template not found' }, { status: 404 });
  }
  
  currentData.lastModified = new Date().toISOString();
  await adminConfigRef.set(currentData);
  
  return NextResponse.json({ success: true });
}

async function handleDeleteTemplate(
  req: NextRequest,
  { params }: { params: RouteParams }
) {
  // Rate limit
  const limited = await rateLimiters.admin(req);
  if (limited) return limited;

  const templateId = params.id;
  
  const adminConfigRef = db.collection('admin_config').doc('templates');
  const doc = await adminConfigRef.get();
  
  if (!doc.exists) {
    return NextResponse.json({ error: 'Templates not found' }, { status: 404 });
  }
  
  const currentData = doc.data() as any;
  
  // Only allow deletion of custom templates
  if (currentData.custom) {
    const index = currentData.custom.findIndex((t: any) => t.id === templateId);
    if (index !== -1) {
      currentData.custom.splice(index, 1);
      currentData.lastModified = new Date().toISOString();
      await adminConfigRef.set(currentData);
      return NextResponse.json({ success: true });
    }
  }
  
  return NextResponse.json({ error: 'Template not found or cannot be deleted' }, { status: 404 });
}

export const GET = withAdminAuth(handleGetTemplate);
export const PUT = withAdminAuth(handleUpdateTemplate);
export const DELETE = withAdminAuth(handleDeleteTemplate);
