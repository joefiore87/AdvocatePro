import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
});

export const communicationLogSchema = z.object({
  id: z.string().optional(),
  date: z.string(),
  type: z.enum(["Email", "Phone Call", "In-Person Meeting", "Letter"]),
  summary: z.string(),
});

const schoolInfoSchema = z.object({
    district: z.string().optional(),
    name: z.string().optional(),
    principal: z.string().optional(),
    specialEducationCoordinator: z.string().optional(),
});

export const profileSchema = z.object({
  // From original simple form
  child: z.object({
    name: z.string().min(1, "Child's name is required"),
    dob: z.string().optional(),
    studentId: z.string().optional(),
    grade: z.string().optional(),
    strengths: z.string().optional(),
    concerns: z.string().optional(),
  }),
  parent1: contactSchema.extend({
    name: z.string().min(1, "Parent's name is required")
  }),
  parent2: contactSchema.optional(),
  school: schoolInfoSchema,
  communicationLog: z.array(communicationLogSchema).optional(),
  
  // From new detailed form
  studentName: z.string().optional(),
  primaryLanguage: z.string().optional(),
  englishFluency: z.string().optional(),
  schoolEvaluation: z.string().optional(),
  evaluationOutcome: z.string().optional(),
  eligibilityCategory: z.string().optional(),
  agreeWithEvaluation: z.string().optional(),
  privateEvaluations: z.string().optional(),
  privateEvalTypes: z.array(z.string()).optional(),
  hasIEP: z.string().optional(),
  iepLastUpdated: z.string().optional(),
  classroomSetting: z.string().optional(),
  genEdTime: z.string().optional(),
  hasBIP: z.string().optional(),
  hasESY: z.string().optional(),
  relatedServices: z.array(z.string()).optional(),
  accommodations: z.array(z.string()).optional(),
  modifications: z.array(z.string()).optional(),
  assistiveTech: z.string().optional(),
  transportation: z.string().optional(),
  goalProgress: z.string().optional(),
  servicesProvided: z.string().optional(),
  primaryConcerns: z.array(z.string()).optional(),
  concernDuration: z.string().optional(),
  documentedConcerns: z.string().optional(),
  schoolContacts: z.array(z.string()).optional(),
  receivedPWN: z.string().optional(),
  desiredOutcomes: z.array(z.string()).optional(),
  preferredTimeline: z.string().optional(),
  additionalInfo: z.string().optional(),
});


export const emptyProfileSchema = profileSchema.extend({
    child: profileSchema.shape.child.extend({
        name: z.string().optional(),
    }),
    parent1: profileSchema.shape.parent1.extend({
        name: z.string().optional(),
    }),
});


export type Profile = z.infer<typeof profileSchema>;
export type CommunicationLog = z.infer<typeof communicationLogSchema>;
