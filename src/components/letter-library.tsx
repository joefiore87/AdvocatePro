"use client";

import { letterTemplates } from "@/lib/templates";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Mail } from "lucide-react";

interface LetterLibraryProps {
  onSelectLetter: (templateId: string) => void;
}

export function LetterLibrary({ onSelectLetter }: LetterLibraryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {letterTemplates.map((template) => (
        <Card key={template.id} className="flex flex-col">
          <CardHeader>
            <CardTitle>{template.name}</CardTitle>
            <CardDescription>{template.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-end">
            <Button onClick={() => onSelectLetter(template.id)} className="w-full">
              <Mail className="mr-2 h-4 w-4" />
              Generate Letter
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
