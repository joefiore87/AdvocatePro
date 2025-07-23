"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

interface ContentData {
  [key: string]: string;
}

export default function Home() {
  const [content, setContent] = useState<ContentData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch content from your content management system
    async function fetchContent() {
      try {
        const response = await fetch('/api/admin/content');
        const data = await response.json();
        setContent(data.content || {});
      } catch (error) {
        console.error('Error fetching content:', error);
        // Fallback to default content if fetch fails
        setContent({
          'homepage-hero': "You know your child better than anyone. Now get the tools to help schools see it too.",
          'homepage-description': "Create clear, professional advocacy letters using what you already know about your child. Everything stays private on your computer—no uploading personal information anywhere.",
          'annual-pricing': "$29.99/year",
          'whats-included-title': "What's Included",
          'features-list': "20 letter templates for different situations (evaluation requests, meeting requests, follow-ups, etc.)\n7 learning modules explaining special education processes and parent rights\nWorks offline - install once, use anywhere\nUpdates included when new templates are added"
        });
      } finally {
        setLoading(false);
      }
    }

    fetchContent();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Advocacy Toolkit</h1>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Log In</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get the Toolkit</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/toolkit">Access Toolkit</Link>
            </Button>
          </nav>
        </header>
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading content...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Advocacy Toolkit</h1>
        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Get the Toolkit</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/toolkit">Access Toolkit</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-grow">
        <section className="text-center py-16 md:py-24 px-4">
          <div className="container mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              {content['homepage-hero'] || "You know your child better than anyone. Now get the tools to help schools see it too."}
            </h2>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              {content['homepage-description'] || "Create clear, professional advocacy letters using what you already know about your child. Everything stays private on your computer—no uploading personal information anywhere."}
            </p>
            <div className="mt-10">
              <div className="relative aspect-video max-w-4xl mx-auto bg-muted rounded-lg border shadow-lg overflow-hidden">
                <Image
                  src="https://placehold.co/1280x720.png"
                  alt="Screen recording of the Advocacy Toolkit"
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                  data-ai-hint="app screen recording"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-secondary/50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-lg text-foreground">
                If you've ever left a school meeting feeling unheard, or spent hours trying to figure out how to put your concerns into writing, you're not alone. Most parents know exactly what their child needs but struggle to communicate it in the formal way schools require.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 mt-12 text-center">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-foreground">Share what you know</h3>
                <p className="mt-2 text-muted-foreground">Answer questions about your child in plain language.</p>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-foreground">Get professional letters</h3>
                <p className="mt-2 text-muted-foreground">The toolkit creates properly formatted advocacy documents.</p>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-foreground">Everything stays private</h3>
                <p className="mt-2 text-muted-foreground">Your child's information never leaves your computer.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-foreground">
                {content['whats-included-title'] || "What's Included"}
              </h3>
              <div className="mt-6 space-y-3 text-muted-foreground text-lg">
                {(content['features-list'] || "20 letter templates for different situations\n7 learning modules explaining special education processes\nWorks offline - install once, use anywhere\nUpdates included when new templates are added")
                  .split('\n')
                  .map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>{feature}</span>
                    </div>
                  ))
                }
              </div>
              <div className="mt-6 space-x-4">
                <Link href="#" className="text-primary hover:underline">See a sample evaluation request letter</Link>
                <Link href="#" className="text-primary hover:underline">See a sample IEP meeting request letter</Link>
              </div>
            </div>
            <div className="bg-muted p-8 rounded-lg">
              <blockquote className="text-lg text-foreground italic">
                "This gave me the words I couldn't find on my own. The school actually responded within the required timeframe for the first time."
              </blockquote>
              <p className="mt-4 font-semibold text-muted-foreground">— Parent from Michigan</p>
            </div>
          </div>
        </section>

        <section className="py-16 bg-secondary/50">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-3xl font-bold text-foreground">The Advocacy Toolkit</h3>
            <p className="mt-4 text-5xl font-bold text-primary">
              {content['annual-pricing'] || "$29.99/year"}
            </p>
            <p className="mt-4 text-muted-foreground">Includes everything listed above. Install on up to 2 computers. <br /> 30-day refund if it doesn't help.</p>
            <Button size="lg" className="mt-8" asChild>
              <Link href="/signup">Get the toolkit</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="py-6 border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          &copy; {new Date().getFullYear()} Advocate Empower. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}