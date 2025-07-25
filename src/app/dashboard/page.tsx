'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppLogo } from '@/components/icons';
import { 
  FileText, 
  User, 
  BookOpen, 
  Settings,
  ArrowRight,
  CheckCircle,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, loading, hasAccess, userRole } = useAuth();
  const router = useRouter();
  const [contentLoading, setContentLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login?redirect=/dashboard');
      } else if (!hasAccess) {
        router.push('/purchase');
      } else {
        setContentLoading(false);
      }
    }
  }, [user, loading, hasAccess, router]);

  if (loading || contentLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !hasAccess) {
    return null; // Will redirect
  }

  const quickActions = [
    {
      title: 'Generate Letter',
      description: 'Create a professional advocacy letter',
      icon: FileText,
      href: '/letter-generator',
      color: 'bg-blue-500'
    },
    {
      title: 'Student Profiles',
      description: 'Manage your student information',
      icon: User,
      href: '/student-profiles',
      color: 'bg-green-500'
    },
    {
      title: 'Learning Modules',
      description: 'Educational content and resources',
      icon: BookOpen,
      href: '/resources',
      color: 'bg-purple-500'
    },
    {
      title: 'Settings',
      description: 'Account and preferences',
      icon: Settings,
      href: '/settings',
      color: 'bg-gray-500'
    }
  ];

  const recentTemplates = [
    { id: 1, title: 'Request for IEP Meeting', category: 'Meeting Requests' },
    { id: 2, title: 'Evaluation Request', category: 'Evaluations' },
    { id: 3, title: 'Service Concerns', category: 'Concerns' },
    { id: 4, title: 'Progress Inquiry', category: 'Follow-ups' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <AppLogo className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold">AdvocatePro Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              {user.email}
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-green-600">Premium Active</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Welcome back!
          </h2>
          <p className="text-muted-foreground">
            Ready to advocate for your child? Choose an action below to get started.
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickActions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader className="text-center pb-2">
                  <div className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    {action.description}
                  </p>
                  <div className="flex items-center justify-center gap-2 text-primary group-hover:gap-3 transition-all">
                    <span className="text-sm font-medium">Get Started</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Recent Templates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Popular Letter Templates
              <Link href="/letter-generator">
                <Button variant="outline" size="sm">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {recentTemplates.map((template) => (
                <Link 
                  key={template.id} 
                  href={`/letter-generator?template=${template.id}`}
                  className="block"
                >
                  <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <h4 className="font-medium mb-1">{template.title}</h4>
                    <p className="text-sm text-muted-foreground">{template.category}</p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Account Status */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Account Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-green-600">Premium Access Active</p>
                <p className="text-sm text-muted-foreground">
                  Subscription Status: {userRole.subscriptionStatus}
                  {userRole.expiresAt && (
                    <span className="ml-2">
                      • Expires: {new Date(userRole.expiresAt).toLocaleDateString()}
                    </span>
                  )}
                </p>
              </div>
              <div className="flex gap-2">
                <Link href="/settings">
                  <Button variant="outline" size="sm">
                    Manage Account
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
