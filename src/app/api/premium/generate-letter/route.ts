import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/auth-middleware';
import { getFirestoreAdmin } from '@/lib/firebase-admin';
import { rateLimiters } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    // Apply rate limiting
    const limited = await rateLimiters.api(req);
    if (limited) return limited;

    // Verify Firebase ID token and check access
    const user = await verifyAuthToken(req);
    if (!user || !user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!user.hasAccess) {
      return NextResponse.json({ error: 'Premium access required' }, { status: 403 });
    }

    const { templateId, studentProfileId, customizations } = await req.json();

    if (!templateId || !studentProfileId) {
      return NextResponse.json({ 
        error: 'Template ID and Student Profile ID are required' 
      }, { status: 400 });
    }

    const db = await getFirestoreAdmin();
    if (!db) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
    }

    // Get the template
    const templateRef = db.collection('premiumContent').doc('letterTemplates')
      .collection('items').doc(templateId);
    const templateSnap = await templateRef.get();
    
    if (!templateSnap.exists) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    // Get the student profile
    const profileRef = db.collection('userProfiles').doc(user.email)
      .collection('studentProfiles').doc(studentProfileId);
    const profileSnap = await profileRef.get();
    
    if (!profileSnap.exists) {
      return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });
    }

    const template = templateSnap.data();
    const profile = profileSnap.data();

    // Generate letter by replacing placeholders
    let letterContent = template?.value || '';
    
    // Replace standard placeholders
    const replacements = {
      '[Child Name]': profile?.studentName || '[Child Name]',
      '[Student Name]': profile?.studentName || '[Student Name]',
      '[Grade]': profile?.grade || '[Grade]',
      '[School Name]': profile?.school || '[School Name]',
      '[Parent Name]': profile?.parentName || user.email.split('@')[0],
      '[Student ID]': profile?.studentId || '[Student ID]',
      '[Child\'s Concerns]': profile?.concerns?.join(', ') || '[Child\'s Concerns]',
      '[Accommodations]': profile?.accommodations?.join(', ') || '[Accommodations]',
      '[Date]': new Date().toLocaleDateString(),
      ...customizations
    };

    // Apply replacements
    Object.entries(replacements).forEach(([placeholder, value]) => {
      letterContent = letterContent.replace(new RegExp(placeholder, 'g'), value);
    });

    // Save generated letter
    const generatedLetter = {
      templateId,
      studentProfileId,
      content: letterContent,
      subject: template?.title || 'Generated Letter',
      generatedAt: new Date(),
      customizations: customizations || {},
      userEmail: user.email
    };

    const letterRef = await db
      .collection('userProfiles')
      .doc(user.email)
      .collection('generatedLetters')
      .add(generatedLetter);

    return NextResponse.json({ 
      success: true, 
      letterId: letterRef.id,
      letter: { id: letterRef.id, ...generatedLetter }
    });

  } catch (error) {
    console.error('Error generating letter:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
