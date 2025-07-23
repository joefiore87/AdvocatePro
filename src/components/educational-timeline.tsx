
"use client";

import { useState, useMemo } from "react";
import { curriculum } from "@/lib/curriculum";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, Mail, Pin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';


interface EducationalTimelineProps {
  onSelectLetter: (templateId: string) => void;
  generateLetterContent: (templateId: string) => { title: string; body: string };
}

export function EducationalTimeline({ onSelectLetter, generateLetterContent }: EducationalTimelineProps) {
  const [checkedLetters, setCheckedLetters] = useState<Record<string, boolean>>({});

  const handleCheckboxChange = (letterId: string) => {
    setCheckedLetters(prev => ({ ...prev, [letterId]: !prev[letterId] }));
  };
  
  const selectedCount = useMemo(() => Object.values(checkedLetters).filter(Boolean).length, [checkedLetters]);

  const handleDownloadAllSelected = async () => {
    const selectedIds = Object.keys(checkedLetters).filter(id => checkedLetters[id]);
    if (selectedIds.length === 0) return;

    if (selectedIds.length === 1) {
      // If only one letter is selected, download as a single .txt file
      const { title, body } = generateLetterContent(selectedIds[0]);
      const blob = new Blob([body], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, `${title.replace(/\s+/g, '_')}.txt`);
    } else {
      // If multiple letters are selected, download as a zip file
      const zip = new JSZip();
      selectedIds.forEach(id => {
        const { title, body } = generateLetterContent(id);
        zip.file(`${title.replace(/\s+/g, '_')}.txt`, body);
      });

      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, "Advocacy_Letters.zip");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
            <div>
                <CardTitle>Your Advocacy Journey</CardTitle>
                <CardDescription>
                Follow this timeline to navigate the special education process step-by-step. Use the "Letter Stops" to take formal, documented action.
                </CardDescription>
            </div>
            {selectedCount > 0 && (
                <Button onClick={handleDownloadAllSelected}>
                    <Download className="mr-2 h-4 w-4" />
                    Download {selectedCount} Selected Letter{selectedCount > 1 ? 's' : ''}
                </Button>
            )}
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
          {curriculum.map((stage, index) => (
            <AccordionItem value={`item-${index}`} key={stage.id}>
              <AccordionTrigger className="text-xl font-bold hover:no-underline text-left">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-display text-lg shrink-0">
                    {index + 1}
                  </div>
                  {stage.title}
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-6 pt-2 pl-4 border-l-2 border-primary/20 ml-5">
                <p className="text-muted-foreground leading-relaxed">{stage.description}</p>
                
                {stage.letterStops.map((letterStop) => (
                  <Card key={letterStop.id} className="bg-background/70">
                    <CardHeader>
                       <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2 text-primary">
                            <Pin className="h-5 w-5"/> Letter Stop: {letterStop.title}
                          </CardTitle>
                          <CardDescription className="mt-2">{letterStop.whatItIs}</CardDescription>
                        </div>
                         <label htmlFor={`checkbox-${letterStop.id}`} className="flex items-center gap-2 text-sm font-medium cursor-pointer p-2 rounded-md hover:bg-accent shrink-0 ml-4">
                          <Checkbox id={`checkbox-${letterStop.id}`} onCheckedChange={() => handleCheckboxChange(letterStop.id)} checked={!!checkedLetters[letterStop.id]} />
                          <span>I need this</span>
                        </label>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <div className="prose prose-sm max-w-none text-card-foreground dark:prose-invert prose-p:text-muted-foreground prose-strong:text-foreground">
                        <p><strong>Why you use it:</strong> {letterStop.whyYouUseIt}</p>
                        <div>
                            <strong>Key elements:</strong>
                            <ul className="list-disc pl-5">
                                {letterStop.keyElements.map((element, i) => <li key={i}>{element}</li>)}
                            </ul>
                        </div>
                        <p className="rounded-md border-l-4 border-primary bg-primary/10 p-4 not-prose">
                            <strong className="text-primary">Pro Tip:</strong> {letterStop.proTip}
                        </p>
                      </div>
                      
                      {checkedLetters[letterStop.id] && (
                        <div className="flex justify-end">
                            <Button onClick={() => onSelectLetter(letterStop.id)}>
                                <Mail className="mr-2 h-4 w-4" />
                                Generate & Preview '{letterStop.title}'
                            </Button>
                        </div>
                      )}

                    </CardContent>
                  </Card>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
