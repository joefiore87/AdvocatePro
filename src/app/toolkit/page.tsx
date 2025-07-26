'use client';

import { PremiumRoute } from '@/components/protected-route';
import UserDashboard from '@/components/user-dashboard';

export default function ToolkitPage() {
  return (
    <PremiumRoute>
      <UserDashboard />
    </PremiumRoute>
  );
}
