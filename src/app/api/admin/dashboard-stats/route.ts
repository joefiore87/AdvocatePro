import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { withAdminAuth, AdminUser } from '@/lib/admin-auth';
import { rateLimiters } from '@/lib/rate-limit';

export const GET = withAdminAuth(async (req: NextRequest, adminUser: AdminUser) => {
    // Rate limit
    const limited = await rateLimiters.admin(req);
    if (limited) return limited;

    try {
      // Get user statistics
      const usersSnapshot = await db.collection('users').get();
      const totalUsers = usersSnapshot.size;
      
      // Get active users (logged in within last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const activeUsersSnapshot = await db.collection('users')
        .where('lastLogin', '>=', thirtyDaysAgo.toISOString())
        .get();
      const activeUsers = activeUsersSnapshot.size;

      // Get template statistics
      const templatesConfigRef = db.collection('admin_config').doc('templates');
      const templatesDoc = await templatesConfigRef.get();
      let totalTemplates = 0;
      
      if (templatesDoc.exists) {
        const data = templatesDoc.data();
        totalTemplates = (data?.hardcoded?.length || 0) + (data?.custom?.length || 0);
      }

      // Get letter generation statistics
      const lettersSnapshot = await db.collection('letters').get();
      const totalLetters = lettersSnapshot.size;

      // Calculate revenue (mock data for now - integrate with Stripe later)
      const revenue = totalUsers * 29; // Estimate based on user count
      const growthRate = Math.round((activeUsers / Math.max(totalUsers - activeUsers, 1)) * 100);

      const stats = {
        totalUsers,
        activeUsers,
        totalTemplates,
        totalLetters,
        revenue,
        growthRate: Math.min(growthRate, 100) // Cap at 100%
      };

      return NextResponse.json(stats);

    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return NextResponse.json(
        { error: 'Failed to fetch dashboard statistics' },
        { status: 500 }
      );
    }
});
