'use client';

import { Button } from "@/components/ui/button";
import { AppLogo } from "@/components/icons";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";

export default function IEPMeetingRequestSample() {
  const sampleLetter = `Date: [Current Date]

[Special Education Coordinator Name]
[School Name]
[School Address]
[City, State ZIP Code]

Re: IEP Meeting Request for [Child Name], Student ID: [Student ID]

Dear [Special Education Coordinator Name],

I am writing to request an IEP meeting for my child, [Child Name], who is currently receiving special education services under an IEP dated [Current IEP Date].

I would like to schedule this meeting to discuss:
• [Specific concern 1 - e.g., current reading goals are not being met]
• [Specific concern 2 - e.g., need for additional speech therapy services]
• [Specific concern 3 - e.g., concerns about behavior support plan effectiveness]

Based on my observations and [teacher feedback/recent assessments/progress reports], I believe we need to review and potentially revise [Child Name]'s current IEP to better address their needs.

I am requesting that the following people be invited to attend this meeting:
• [Child Name]'s general education teacher
• [Child Name]'s special education teacher
• Speech-language pathologist
• [Other relevant service providers]
• School psychologist (if appropriate)

I am generally available on the following dates and times:
• [Day of week] between [time range]
• [Day of week] between [time range]
• [Alternative times if needed]

Please provide me with:
1. At least 10 days' notice of the meeting date and time
2. A list of who will be attending
3. Copies of any evaluations or data that will be discussed
4. My rights as a parent in the IEP process

If you need any additional information from me before the meeting, please contact me at [Phone Number] or [Email Address].

Thank you for your prompt attention to scheduling this meeting. I look forward to working together to ensure [Child Name] receives the support they need to be successful.

Sincerely,

[Parent Name]
[Parent Signature]
[Date]

cc: [Principal Name]
    [Child's Teachers]
    [Special Education Director]`;

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([sampleLetter], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "iep-meeting-request-sample.txt";
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
                Sample: IEP Meeting Request Letter
              </h1>
              
              <p className="text-lg text-muted-foreground mb-6">
                This is an example of a professional IEP meeting request letter. The fields in brackets [ ] would be filled in with your specific information when using the toolkit.
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
                <li>• <strong>Professional format:</strong> Business letter with clear subject line</li>
                <li>• <strong>Specific concerns:</strong> Lists concrete issues to address</li>
                <li>• <strong>Team membership:</strong> Requests appropriate team members</li>
                <li>• <strong>Availability:</strong> Provides multiple scheduling options</li>
                <li>• <strong>Advance notice:</strong> Respects required meeting timeline</li>
                <li>• <strong>Documentation:</strong> Creates paper trail with copies to key personnel</li>
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