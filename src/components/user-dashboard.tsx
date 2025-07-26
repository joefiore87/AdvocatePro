'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  FileText, 
  Plus, 
  Download,
  GraduationCap,
  BookOpen
} from 'lucide-react';

interface StudentProfile {
  id: string;
  name: string;
  grade: string;
  school: string;
  birthDate: string;
  disabilities: string[];
  accommodations: string[];
  createdAt: string;
}

interface GeneratedLetter {
  id: string;
  subject: string;
  content: string;
  templateId: string;
  studentProfileId: string;
  generatedAt: string;
}

export default function UserDashboard() {
  const { user, hasAccess } = useAuth();
  const router = useRouter();
  const [studentProfiles, setStudentProfiles] = useState<StudentProfile[]>([]);
  const [generatedLetters, setGeneratedLetters] = useState<GeneratedLetter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !hasAccess) {
      router.push('/');
      return;
    }

    // Load user data
    loadDashboardData();
  }, [user, hasAccess, router]);

  const loadDashboardData = async () => {
    try {
      // Mock data for now - replace with actual API calls
      setStudentProfiles([
        {
          id: '1',
          name: 'Sample Student',
          grade: '5th Grade',
          school: 'Elementary School',
          birthDate: '2015-06-15',
          disabilities: ['Learning Disability'],
          accommodations: ['Extended time', 'Small group testing'],
          createdAt: new Date().toISOString()
        }
      ]);

      setGeneratedLetters([]);
      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.displayName || user?.email}
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your advocacy tools and generate professional letters.
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="letters">Letters</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Student Profiles</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{studentProfiles.length}</div>
                  <p className="text-xs text-muted-foreground">Active profiles</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Generated Letters</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{generatedLetters.length}</div>
                  <p className="text-xs text-muted-foreground">Total letters</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Templates Available</CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">20+</div>
                  <p className="text-xs text-muted-foreground">Professional templates</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Learning Modules</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">7</div>
                  <p className="text-xs text-muted-foreground">Educational resources</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Get started with common tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start" 
                    onClick={() => router.push('/letter-generator')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Letter
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => router.push('/dashboard/students/new')}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Add Student Profile
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => router.push('/resources')}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    View Learning Modules
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest actions</CardDescription>
                </CardHeader>
                <CardContent>
                  {generatedLetters.length === 0 ? (
                    <p className="text-sm text-gray-500">No recent activity</p>
                  ) : (
                    <div className="space-y-2">
                      {generatedLetters.slice(0, 3).map((letter) => (
                        <div key={letter.id} className="text-sm">
                          <p className="font-medium">{letter.subject}</p>
                          <p className="text-gray-500">
                            {new Date(letter.generatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Student Profiles</h3>
              <Button onClick={() => router.push('/dashboard/students/new')}>
                <Plus className="h-4 w-4 mr-2" />
                Add Student
              </Button>
            </div>
            
            {studentProfiles.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No student profiles yet</h4>
                  <p className="text-gray-600 mb-4">
                    Create a student profile to generate personalized advocacy letters.
                  </p>
                  <Button onClick={() => router.push('/dashboard/students/new')}>
                    Create First Profile
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {studentProfiles.map((profile) => (
                  <Card key={profile.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {profile.name}
                        <Badge variant="outline">{profile.grade}</Badge>
                      </CardTitle>
                      <CardDescription>{profile.school}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <p><strong>Disabilities:</strong> {profile.disabilities?.join(', ') || 'None listed'}</p>
                        <p><strong>Accommodations:</strong> {profile.accommodations?.join(', ') || 'None listed'}</p>
                      </div>
                      <div className="mt-4 space-y-2">
                        <Button 
                          size="sm" 
                          className="w-full"
                          onClick={() => router.push(`/letter-generator?student=${profile.id}`)}
                        >
                          Generate Letter
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => router.push(`/dashboard/students/${profile.id}`)}
                        >
                          Edit Profile
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Letters Tab */}
          <TabsContent value="letters" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Generated Letters</h3>
              <Button onClick={() => router.push('/letter-generator')}>
                <Plus className="h-4 w-4 mr-2" />
                Generate Letter
              </Button>
            </div>
            
            {generatedLetters.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No letters generated yet</h4>
                  <p className="text-gray-600 mb-4">
                    Create your first advocacy letter using our professional templates.
                  </p>
                  <Button onClick={() => router.push('/letter-generator')}>
                    Generate Your First Letter
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {generatedLetters.map((letter) => (
                  <Card key={letter.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {letter.subject}
                        <Badge variant="outline">
                          {new Date(letter.generatedAt).toLocaleDateString()}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        Template: {letter.templateId} • Student: {letter.studentProfileId}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-gray-600 mb-4">
                        {letter.content.substring(0, 200)}...
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm"
                          onClick={() => router.push(`/dashboard/letters/${letter.id}`)}
                        >
                          View Full Letter
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            const blob = new Blob([letter.content], { type: 'text/plain' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `${letter.subject}.txt`;
                            a.click();
                          }}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">Letter Templates</h3>
              <p className="text-gray-600 mb-6">
                Access our complete library of professional advocacy letter templates.
              </p>
              <Button onClick={() => router.push('/letter-generator')}>
                Browse All Templates
              </Button>
            </div>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">Educational Resources</h3>
              <p className="text-gray-600 mb-6">
                Learn about special education processes, rights, and advocacy strategies.
              </p>
              <Button onClick={() => router.push('/resources')}>
                Access Learning Modules
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
