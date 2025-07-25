'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AppLogo } from '@/components/icons';
import { 
  ArrowLeft, 
  FileText, 
  Loader2, 
  Copy,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';

interface StudentData {
  name: string;
  grade: string;
  dateOfBirth: string;
  schoolName: string;
  schoolDistrict: string;
  teacherName: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  concerns: string;
  requestedAction: string;
}

interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
}

export default function LetterGeneratorPage() {
  const { user, loading, hasAccess } = useAuth();
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [studentData, setStudentData] = useState<StudentData>({
    name: '',
    grade: '',
    dateOfBirth: '',
    schoolName: '',
    schoolDistrict: '',
    teacherName: '',
    parentName: '',
    parentEmail: user?.email || '',
    parentPhone: '',
    concerns: '',
    requestedAction: ''
  });
  const [generatedLetter, setGeneratedLetter] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login?redirect=/letter-generator');
      } else if (!hasAccess) {
        router.push('/purchase');
      } else {
        setStudentData(prev => ({ ...prev, parentEmail: user.email || '' }));
        loadTemplates();
      }
    }
  }, [user, loading, hasAccess, router]);

  const loadTemplates = async () => {
    const mockTemplates: Template[] = [
      {
        id: 'iep-meeting-request',
        title: 'IEP Meeting Request',
        description: 'Request an IEP team meeting',
        category: 'Meeting Requests'
      },
      {
        id: 'evaluation-request', 
        title: 'Evaluation Request',
        description: 'Request an educational evaluation',
        category: 'Evaluations'
      },
      {
        id: 'service-concerns',
        title: 'Service Concerns',
        description: 'Express concerns about current services',
        category: 'Concerns'
      },
      {
        id: 'progress-inquiry',
        title: 'Progress Inquiry',
        description: 'Request update on student progress',
        category: 'Follow-ups'
      }
    ];
    setTemplates(mockTemplates);
  };

  const handleInputChange = (field: keyof StudentData, value: string) => {
    setStudentData(prev => ({ ...prev, [field]: value }));
  };

  const generateLetter = async () => {
    if (!selectedTemplate) return;

    setIsGenerating(true);
    try {
      // For demo purposes, generate a mock letter
      setGeneratedLetter(generateMockLetter());
    } catch (error) {
      console.error('Error generating letter:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMockLetter = () => {
    return `${new Date().toLocaleDateString()}

${studentData.schoolName || '[School Name]'}
${studentData.schoolDistrict || '[School District]'}

Dear IEP Team,

I am writing to request an IEP team meeting for my child, ${studentData.name || '[Student Name]'}, who is currently in ${studentData.grade || '[Grade]'} grade.

I have concerns about ${studentData.concerns || '[specific concerns about your child\'s education]'} and believe that ${studentData.requestedAction || '[specific action you are requesting]'}.

As outlined in IDEA, I am requesting this meeting within 30 days of this letter. Please provide me with several meeting times that work for the team, and I will confirm my availability.

I look forward to working together to ensure ${studentData.name || '[Student Name]'} receives the appropriate educational support.

Sincerely,

${studentData.parentName || '[Your Name]'}
${studentData.parentEmail || '[Your Email]'}
${studentData.parentPhone || '[Your Phone]'}`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedLetter);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading letter generator...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <AppLogo className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-bold">Letter Generator</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Choose Template</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedTemplate?.id === template.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <h4 className="font-medium">{template.title}</h4>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {selectedTemplate && (
              <Card>
                <CardHeader>
                  <CardTitle>Student Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="studentName">Student Name</Label>
                      <Input
                        id="studentName"
                        value={studentData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter student's name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="grade">Grade</Label>
                      <Input
                        id="grade"
                        value={studentData.grade}
                        onChange={(e) => handleInputChange('grade', e.target.value)}
                        placeholder="e.g., 3rd Grade"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="schoolName">School Name</Label>
                    <Input
                      id="schoolName"
                      value={studentData.schoolName}
                      onChange={(e) => handleInputChange('schoolName', e.target.value)}
                      placeholder="Enter school name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="parentName">Your Name</Label>
                    <Input
                      id="parentName"
                      value={studentData.parentName}
                      onChange={(e) => handleInputChange('parentName', e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="concerns">Specific Concerns</Label>
                    <Textarea
                      id="concerns"
                      value={studentData.concerns}
                      onChange={(e) => handleInputChange('concerns', e.target.value)}
                      placeholder="Describe your concerns..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="requestedAction">Requested Action</Label>
                    <Textarea
                      id="requestedAction"
                      value={studentData.requestedAction}
                      onChange={(e) => handleInputChange('requestedAction', e.target.value)}
                      placeholder="What action are you requesting?"
                      rows={2}
                    />
                  </div>

                  <Button 
                    onClick={generateLetter}
                    disabled={isGenerating || !studentData.name}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      'Generate Letter'
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          <div>
            {generatedLetter && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Generated Letter
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                      disabled={copySuccess}
                    >
                      {copySuccess ? (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy
                        </>
                      )}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/30 p-6 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                      {generatedLetter}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
