import { NextRequest, NextResponse } from 'next/server';
import { getDbOrThrow } from '@/lib/firebase-admin';
import { DEFAULT_PROFILE_STEPS } from '@/lib/admin-types';
import { withAdminAuth } from '@/lib/admin-auth';
import { rateLimiters } from '@/lib/rate-limit';

async function handleGetProfileBuilder(req: NextRequest) {
  // Rate limit
  const limited = await rateLimiters.admin(req);
  if (limited) return limited;

  const adminConfigRef = db.collection('admin_config').doc('profile_builder');
  const doc = await adminConfigRef.get();
  
  if (!doc.exists) {
    // Initialize with default profile steps
    const initialData = {
      steps: DEFAULT_PROFILE_STEPS,
      lastModified: new Date().toISOString(),
      version: 1
    };
    
    await adminConfigRef.set(initialData);
    
    return NextResponse.json({
      steps: DEFAULT_PROFILE_STEPS
    });
  }
  
  const data = doc.data();
  
  return NextResponse.json({
    steps: data?.steps || DEFAULT_PROFILE_STEPS
  });
}

async function handleUpdateProfileBuilder(req: NextRequest) {
  // Rate limit
  const limited = await rateLimiters.admin(req);
  if (limited) return limited;

  const { steps } = await req.json();
  
  // Basic validation
  if (!Array.isArray(steps)) {
    return NextResponse.json({ error: 'Steps must be an array' }, { status: 400 });
  }
  
  // Validate each step has required fields
  for (const step of steps) {
    if (!step.step || !step.title || !Array.isArray(step.fields)) {
      return NextResponse.json({ 
        error: 'Each step must have step number, title, and fields array' 
      }, { status: 400 });
    }
  }
  
  const adminConfigRef = db.collection('admin_config').doc('profile_builder');
  
  const updateData = {
    steps,
    lastModified: new Date().toISOString()
  };
  
  await adminConfigRef.set(updateData, { merge: true });
  
  return NextResponse.json({ success: true });
}

export const GET = withAdminAuth(handleGetProfileBuilder);
export const PUT = withAdminAuth(handleUpdateProfileBuilder);
