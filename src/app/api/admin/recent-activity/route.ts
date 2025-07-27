import { NextRequest, NextResponse } from 'next/server';
import { getDbOrThrow } from '@/lib/firebase-admin';
import { withAdminAuth } from '@/lib/admin-auth';
import { rateLimiters } from '@/lib/rate-limit';

interface RecentActivity {
  id: string;
  type: 'user_registered' | 'letter_generated' | 'template_updated' | 'system_update';
  description: string;
  timestamp: string;
  user?: string;
}

async function handleGetRecentActivity(req: NextRequest) {
  // Rate limit
  const limited = await rateLimiters.admin(req);
  if (limited) return limited;

  const db = getDbOrThrow();
  const activities: RecentActivity[] = [];
  
  // Get recent user registrations
  const recentUsersSnapshot = await db.collection('users')
    .orderBy('createdAt', 'desc')
    .limit(10)
    .get();
  
  recentUsersSnapshot.forEach(doc => {
    const userData = doc.data();
    activities.push({
      id: `user-${doc.id}`,
      type: 'user_registered',
      description: `New user registered: ${userData.email || 'Unknown'}`,
      timestamp: userData.createdAt || new Date().toISOString(),
      user: userData.email
    });
  });

  // Get recent letter generations
  const recentLettersSnapshot = await db.collection('letters')
    .orderBy('createdAt', 'desc')
    .limit(10)
    .get();
  
  recentLettersSnapshot.forEach(doc => {
    const letterData = doc.data();
    activities.push({
      id: `letter-${doc.id}`,
      type: 'letter_generated',
      description: `Letter generated: ${letterData.templateName || 'Unknown template'}`,
      timestamp: letterData.createdAt || new Date().toISOString(),
      user: letterData.userEmail
    });
  });

  // Add system updates (hardcoded for now)
  activities.push({
    id: 'system-admin-dashboard',
    type: 'system_update',
    description: 'Admin dashboard system initialized',
    timestamp: new Date().toISOString()
  });

  // Sort by timestamp and limit to 20 most recent
  const sortedActivities = activities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 20);

  return NextResponse.json({ activities: sortedActivities });
}

export const GET = withAdminAuth(handleGetRecentActivity);
