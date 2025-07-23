
"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { ProfileProvider } from "@/hooks/use-profile";
import { profileSchema } from "@/lib/types";
import { letterTemplates } from "@/lib/templates";
import { ProfileForm } from "./profile-form";
import { EducationalTimeline } from "./educational-timeline";
import { LetterLibrary } from "./letter-library";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { AppLogo } from "./icons";
import { BookOpen, FileJson, FolderDown, HelpCircle, Loader2, LogOut, Mail, Settings, User } from "lucide-react";
import { useProfile } from "@/hooks/use-profile";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { SubscriptionStatus } from "./subscription-status";


function AdvocacyToolkitContent() {
  const { profile, setProfile } = useProfile();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("timeline");
  const [isLetterDialogOpen, setLetterDialogOpen] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState({ title: "", body: "" });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoading(false);
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
      router.push("/");
    } catch (error) {
      toast({ variant: "destructive", title: "Logout Failed", description: "An error occurred during logout." });
    }
  };


  const handleLoadProfileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        const json = JSON.parse(text as string);
        const validatedProfile = profileSchema.parse(json);
        setProfile(validatedProfile);
        toast({
          title: "Profile Loaded",
          description: "Your advocacy profile has been successfully loaded.",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Load Failed",
          description: "The selected file is not a valid profile. Please try another file.",
        });
        console.error("Failed to load profile:", error);
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset file input
  };

  const handleSaveProfile = () => {
    try {
      const jsonString = JSON.stringify(profile, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `advocacy-profile-${profile.child.name.replace(/\s+/g, '_') || 'untitled'}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast({
        title: "Profile Saved",
        description: "Your profile has been saved as a .json file.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "There was an error saving your profile.",
      });
      console.error("Failed to save profile:", error);
    }
  };

  const generateLetterContent = useCallback((templateId: string) => {
    const template = letterTemplates.find(t => t.id === templateId);
    if (!template) return { title: 'Error', body: 'Template not found.' };

    const replacements: Record<string, string | undefined> = {
      '{{childName}}': profile.child.name,
      '{{childDob}}': profile.child.dob,
      '{{childGrade}}': profile.child.grade,
      '{{childConcerns}}': profile.child.concerns,
      '{{childStudentId}}': profile.child.studentId,
      '{{parent1Name}}': profile.parent1.name,
      '{{parent1Phone}}': profile.parent1.phone,
      '{{parent1Email}}': profile.parent1.email,
      '{{principalName}}': profile.school.principal,
      '{{schoolName}}': profile.school.name,
      '{{schoolSpecialEducationCoordinator}}': profile.school.specialEducationCoordinator,
      '{{date}}': new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    };
    
    let letterBody = template.body;
    for (const [key, value] of Object.entries(replacements)) {
      const placeholder = new RegExp(key.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1"), 'g');
      letterBody = letterBody.replace(placeholder, value || `[${key.slice(2, -2)}]`);
    }
    
    return { title: template.name, body: letterBody };
  }, [profile]);
  
  const handleSelectLetter = useCallback((templateId: string) => {
    setGeneratedLetter(generateLetterContent(templateId));
    setLetterDialogOpen(true);
  }, [generateLetterContent]);

  const handleCopyLetter = () => {
    navigator.clipboard.writeText(generatedLetter.body);
    toast({ title: "Copied!", description: "The letter content has been copied to your clipboard." });
  };
  
  const handleDownloadLetter = () => {
    const blob = new Blob([generatedLetter.body], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${generatedLetter.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };


  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary/50">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-secondary/50">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <AppLogo className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold tracking-tight text-foreground">Advocacy Toolkit</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleLoadProfileClick}>
                <FileJson className="mr-2 h-4 w-4"/>
                Load Profile
              </Button>
              <Button onClick={handleSaveProfile}>
                <FolderDown className="mr-2 h-4 w-4"/>
                Save Profile
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="timeline"><BookOpen className="mr-2 h-4 w-4"/>Advocacy Timeline</TabsTrigger>
            <TabsTrigger value="profile"><User className="mr-2 h-4 w-4"/>Profile Builder</TabsTrigger>
            <TabsTrigger value="letters"><Mail className="mr-2 h-4 w-4"/>Letter Library</TabsTrigger>
            <TabsTrigger value="settings"><Settings className="mr-2 h-4 w-4"/>Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="timeline"><EducationalTimeline onSelectLetter={handleSelectLetter} generateLetterContent={generateLetterContent} /></TabsContent>
          <TabsContent value="profile"><ProfileForm /></TabsContent>
          <TabsContent value="letters"><LetterLibrary onSelectLetter={handleSelectLetter} /></TabsContent>
          <TabsContent value="settings">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
              <SubscriptionStatus />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="py-4 border-t bg-background">
          <div className="container mx-auto px-4 flex justify-between items-center">
              <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Advocate Empower. All Rights Reserved.</p>
              <Dialog>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="sm"><HelpCircle className="mr-2 h-4 w-4"/>Disclaimer & Privacy</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Disclaimer and Privacy Information</DialogTitle>
                    </DialogHeader>
                    <DialogDescription className="space-y-4 max-h-[60vh] overflow-y-auto pr-4">
                        <p className="font-bold">Not Legal Advice:</p>
                        <p>This tool is for informational purposes only and does not constitute legal advice. It is not a substitute for professional legal counsel. Consult with a qualified attorney for advice on your individual situation.</p>
                        <p className="font-bold">Privacy First:</p>
                        <p>Your privacy is paramount. This application operates entirely on your local machine. No profile data is ever sent to or stored on any server. All data remains on your computer unless you choose to export it.</p>
                        <p className="font-bold">Data Management:</p>
                        <p>You are in complete control of your data. The 'Save Profile' function creates a `.json` file on your local device. The 'Load Profile' function reads a `.json` file you select. It's your responsibility to keep your saved files secure.</p>
                    </DialogDescription>
                </DialogContent>
              </Dialog>
          </div>
      </footer>
      
      <Dialog open={isLetterDialogOpen} onOpenChange={setLetterDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{generatedLetter.title}</DialogTitle>
            <DialogDescription>
              This letter has been generated based on your profile. Review and edit as needed before sending.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 max-h-[60vh] overflow-y-auto border rounded-md p-4 bg-secondary/30">
            <pre className="whitespace-pre-wrap font-body text-sm">{generatedLetter.body}</pre>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={handleCopyLetter}>Copy Text</Button>
            <Button onClick={handleDownloadLetter}>Download as .txt</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}


export default function AdvocacyToolkit() {
  return (
    <ProfileProvider>
      <AdvocacyToolkitContent />
    </ProfileProvider>
  );
}
