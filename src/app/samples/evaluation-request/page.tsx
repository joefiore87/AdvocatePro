'use client';

import { Button } from "@/components/ui/button";
import { AppLogo } from "@/components/icons";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";

export default function EvaluationRequestSample() {
  const sampleLetter = `Date: [Current Date]

[Principal Name]
[School Name]
[School Address]
[City, State ZIP Code]

Dear [Principal Name],

I am writing to formally request a comprehensive evaluation for my child, [Child Name], who is currently in [Grade] at [School Name]. I have concerns about [Child's academic/behavioral/developmental concerns] and believe an evaluation is necessary to determine if special education services are needed.

Specific areas of concern include:
• [Specific concern 1 - e.g., reading comprehension difficulties]
• [Specific concern 2 - e.g., attention and focus issues]
• [Specific concern 3 - e.g., social interaction challenges]

Please consider this letter my formal request for an evaluation under the Individuals with Disabilities Education Act (IDEA). I understand that the school has 60 calendar days to complete this evaluation from the date of my written consent.

I would appreciate receiving:
1. Consent forms for the evaluation
2. Information about the evaluation process
3. A timeline for when the evaluation will be completed
4. Notice of my rights as a parent in this process

I am available to discuss this request and provide any additional information that may be helpful. Please contact me at [Phone Number] or [Email Address] to arrange a convenient time to meet.

Thank you for your prompt attention to this matter. I look forward to working collaboratively with the school team to ensure my child receives appropriate support.

Sincerely,

[Parent Name]
[Parent Signature]
[Date]

cc: [Special Education Director]
    [Child's Teacher]`;

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([sampleLetter], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "evaluation-request-sample.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <AppLogo className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-bold text-foreground">Advocacy Toolkit</h1>
        </div>
        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Get the Toolkit</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <Button variant="ghost" asChild className="mb-4">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
              
              <h1 className="text-3xl font-bold text-foreground mb-4">
                Sample: Evaluation Request Letter
              </h1>
              
              <p className="text-lg text-muted-foreground mb-6">
                This is an example of a professional evaluation request letter. The fields in brackets [ ] would be filled in with your specific information when using the toolkit.
              </p>

              <div className="flex gap-4 mb-8">
                <Button onClick={handleDownload} className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download Sample
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/signup">Get Full Access</Link>
                </Button>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-8 shadow-sm">
              <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
                {sampleLetter}
              </pre>
            </div>

            <div className="mt-8 p-6 bg-secondary/50 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Why This Letter Works</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• <strong>Formal structure:</strong> Professional business letter format</li>
                <li>• <strong>Clear request:</strong> States exactly what you're asking for</li>
                <li>• <strong>Legal framework:</strong> References IDEA to establish your rights</li>
                <li>• <strong>Specific concerns:</strong> Lists observable issues rather than diagnoses</li>
                <li>• <strong>Timeline awareness:</strong> Shows you know the 60-day requirement</li>
                <li>• <strong>Documentation:</strong> Creates a paper trail with cc list</li>
              </ul>
            </div>

            <div className="mt-8 text-center">
              <p className="text-lg text-muted-foreground mb-4">
                Ready to create your own professional advocacy letters?
              </p>
              <Button size="lg" asChild>
                <Link href="/signup">Get the Complete Toolkit</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          &copy; {new Date().getFullYear()} Advocate Empower. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}