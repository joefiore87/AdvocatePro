import { NextRequest, NextResponse } from 'next/server';
import { getDbOrThrow } from '@/lib/firebase-admin';
import { withAdminAuth } from '@/lib/admin-auth';
import { rateLimiters } from '@/lib/rate-limit';

const DEFAULT_APPEARANCE = {
  colors: {
    primary: '#3b82f6',
    secondary: '#64748b', 
    accent: '#0ea5e9',
    background: '#ffffff',
    text: '#1e293b'
  },
  fonts: {
    heading: 'Inter',
    body: 'Inter'
  },
  layout: {
    containerWidth: '1200px',
    spacing: 'normal',
    borderRadius: '0.5rem'
  }
};

async function handleGetAppearance(req: NextRequest) {
  // Rate limit
  const limited = await rateLimiters.admin(req);
  if (limited) return limited;

  const db = getDbOrThrow();
  const adminConfigRef = db.collection('admin_config').doc('appearance');
  const doc = await adminConfigRef.get();
  
  if (!doc.exists) {
    // Initialize with default appearance
    const initialData = {
      ...DEFAULT_APPEARANCE,
      lastModified: new Date().toISOString(),
      version: 1
    };
    
    await adminConfigRef.set(initialData);
    return NextResponse.json(initialData);
  }
  
  const data = doc.data();
  return NextResponse.json(data);
}

async function handleUpdateAppearance(req: NextRequest) {
  // Rate limit
  const limited = await rateLimiters.admin(req);
  if (limited) return limited;

  const appearanceData = await req.json();
  
  // Validate required structure
  const requiredFields = ['colors', 'fonts', 'layout'];
  for (const field of requiredFields) {
    if (!appearanceData[field]) {
      return NextResponse.json({ 
        error: `Missing required field: ${field}` 
      }, { status: 400 });
    }
  }
  
  const db = getDbOrThrow();
  const adminConfigRef = db.collection('admin_config').doc('appearance');
  
  const updateData = {
    ...appearanceData,
    lastModified: new Date().toISOString()
  };
  
  await adminConfigRef.set(updateData);
  
  return NextResponse.json({ success: true });
}

export const GET = withAdminAuth(handleGetAppearance);
export const PUT = withAdminAuth(handleUpdateAppearance);
