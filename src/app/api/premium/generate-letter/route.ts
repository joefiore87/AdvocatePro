import { NextRequest, NextResponse } from 'next/server';
import { requirePremiumAuth, verifyAuthToken } from '@/lib/auth-middleware';
import { getFirestoreAdmin } from '@/lib/firebase-admin';
import { rateLimiters } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    // Apply rate limiting
    const limited = await rateLimiters.api(req);
    if (limited) return limited;

    // Check premium access via custom claims
    const authError = await requirePremiumAuth(req);
    if (authError) return authError;

    // Get user from verified token
    const user = await verifyAuthToken(req);
    if (!user) {
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }

    const { templateId, studentData } = await req.json();

    if (!templateId || !studentData) {
      return NextResponse.json(
        { error: 'Missing templateId or studentData' },
        { status: 400 }
      );
    }

    const db = await getFirestoreAdmin();
    if (!db) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
    }

    // Get the letter template
    const templateRef = db.collection('premiumContent').doc('letterTemplates')
      .collection('items').doc(templateId);
    const templateSnap = await templateRef.get();

    if (!templateSnap.exists) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    const template = templateSnap.data();
    if (!template?.content) {
      return NextResponse.json({ error: 'Invalid template' }, { status: 400 });
    }

    // Generate letter by replacing placeholders
    let generatedLetter = template.content;
    
    // Replace student data placeholders
    const placeholders = {
      '[STUDENT_NAME]': studentData.name || '[Student Name]',
      '[STUDENT_GRADE]': studentData.grade || '[Grade]',
      '[STUDENT_DOB]': studentData.dateOfBirth || '[Date of Birth]',
      '[SCHOOL_NAME]': studentData.schoolName || '[School Name]',
      '[SCHOOL_DISTRICT]': studentData.schoolDistrict || '[School District]',
      '[TEACHER_NAME]': studentData.teacherName || '[Teacher Name]',
      '[PARENT_NAME]': studentData.parentName || '[Parent Name]',
      '[PARENT_EMAIL]': studentData.parentEmail || user.email,
      '[PARENT_PHONE]': studentData.parentPhone || '[Parent Phone]',
      '[DATE]': new Date().toLocaleDateString(),
      '[CONCERNS]': studentData.concerns || '[Specific concerns about student]',
      '[REQUESTED_ACTION]': studentData.requestedAction || '[Requested action or meeting]'
    };

    // Replace all placeholders
    Object.entries(placeholders).forEach(([placeholder, value]) => {
      generatedLetter = generatedLetter.replace(new RegExp(placeholder, 'g'), value);
    });

    // Log generation for analytics using UID
    try {
      await db.collection('users').doc(user.uid).collection('letterHistory').add({
        templateId,
        templateTitle: template.title,
        generatedAt: new Date(),
        studentName: studentData.name,
        userEmail: user.email // Keep email for reference but use UID for document structure
      });
    } catch (error) {
      console.warn('Failed to log letter generation:', error);
      // Don't fail the request if logging fails
    }

    return NextResponse.json({
      success: true,
      letter: {
        title: template.title,
        content: generatedLetter,
        templateId,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error generating letter:', error);
    return NextResponse.json(
      { error: 'Failed to generate letter' },
      { status: 500 }
    );
  }
}
