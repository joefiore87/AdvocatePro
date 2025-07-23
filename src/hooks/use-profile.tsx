
"use client";

import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { z } from 'zod';
import { profileSchema, type Profile } from '@/lib/types';

// A valid, empty object that conforms to the Profile schema for initialization
const defaultProfile: Profile = {
  child: { name: '', dob: '', grade: '', studentId: '', strengths: '', concerns: '' },
  parent1: { name: '', email: '', phone: '' },
  parent2: { name: '', email: '', phone: '' },
  school: { district: '', name: '', principal: '', specialEducationCoordinator: '' },
  communicationLog: [],
  studentName: '',
  // Initialize all optional fields from the detailed form
  primaryLanguage: '',
  englishFluency: '',
  schoolEvaluation: '',
  evaluationOutcome: '',
  eligibilityCategory: '',
  agreeWithEvaluation: '',
  privateEvaluations: '',
  privateEvalTypes: [],
  hasIEP: '',
  iepLastUpdated: '',
  classroomSetting: '',
  genEdTime: '',
  hasBIP: '',
  hasESY: '',
  relatedServices: [],
  accommodations: [],
  modifications: [],
  assistiveTech: '',
  transportation: '',
  goalProgress: '',
  servicesProvided: '',
  primaryConcerns: [],
  concernDuration: '',
  documentedConcerns: '',
  schoolContacts: [],
  receivedPWN: '',
  desiredOutcomes: [],
  preferredTimeline: '',
  additionalInfo: '',
};


interface ProfileContextType {
  profile: Profile;
  setProfile: (profile: Profile | ((prevProfile: Profile) => Profile)) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<Profile>(defaultProfile);

  const value = useMemo(() => ({ profile, setProfile }), [profile]);

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

export const getDefaultProfile = (): Profile => {
    // Ensure the returned object matches the Profile type exactly
    const validatedDefault = profileSchema.safeParse(defaultProfile);
    if (validatedDefault.success) {
      return validatedDefault.data;
    }
    // This should ideally not happen if defaultProfile is correct.
    console.error("Default profile validation failed:", validatedDefault.error);
    // Return a hardcoded, minimal-but-valid profile structure as a fallback.
    return {
        child: { name: '' },
        parent1: { name: '' },
        school: {},
    };
};
