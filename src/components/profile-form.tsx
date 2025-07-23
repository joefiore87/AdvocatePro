
"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProfile } from '@/hooks/use-profile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import type { Profile } from '@/lib/types';

const stepTitles = [
  'Student Basics',
  'Disability & Eligibility',
  'Educational Program',
  'Services & Supports',
  'Progress & Concerns',
  'Communication & Next Steps'
];

export function ProfileForm() {
  const { profile, setProfile } = useProfile();
  const { toast } = useToast();
  const [formData, setFormData] = useState<Profile>(profile);
  const [step, setStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);

  const handleChange = (name: string, value: any) => {
    const keys = name.split('.');
    if (keys.length > 1) {
        setFormData((prev: any) => ({
            ...prev,
            [keys[0]]: {
                ...prev[keys[0]],
                [keys[1]]: value,
            },
        }));
    } else {
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    }
  };
  
  const handleMultipleCheckbox = (name: string, value: string, checked: boolean) => {
    const currentArray = (formData as any)[name] || [];
    let newArray;
    if (checked) {
      newArray = [...currentArray, value];
    } else {
      newArray = currentArray.filter((item: string) => item !== value);
    }
    setFormData((prev: any) => ({ ...prev, [name]: newArray }));
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  const goToStep = (targetStep: number) => setStep(targetStep);

  const formGroup = (label: string, element: React.ReactNode, helpText: string | null = null) => (
    <div className="mb-6">
      <label className="block mb-2 font-medium text-foreground">{label}</label>
      {element}
      {helpText && <p className="text-sm text-muted-foreground mt-1">{helpText}</p>}
    </div>
  );
  
  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        {stepTitles.map((title, index) => (
          <div
            key={index}
            className="text-xs text-center flex-1 cursor-pointer"
            onClick={() => goToStep(index + 1)}
          >
            <div
              className={`rounded-full w-8 h-8 mx-auto mb-2 flex items-center justify-center text-white font-semibold transition-all ${
                step > index + 1 ? 'bg-green-600' :
                step === index + 1 ? 'bg-primary' : 'bg-muted-foreground/50 hover:bg-muted-foreground/70'
              }`}
            >
              {step > index + 1 ? '✓' : index + 1}
            </div>
            <span className={`text-[11px] leading-tight ${
              step === index + 1 ? 'font-bold text-primary' :
              step > index + 1 ? 'text-green-600' : 'text-muted-foreground'
            }`}>
              {title}
            </span>
          </div>
        ))}
      </div>
       <div className="h-2 w-full bg-muted rounded-full">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-300"
          style={{ width: `${((step - 1) / (stepTitles.length - 1)) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  const checkboxGroup = (name: keyof Profile, options: string[], label: string) => (
    <div className="space-y-2">
      <p className="font-medium text-card-foreground mb-3">{label}</p>
      {options.map(option => (
        <label key={option} className="flex items-center space-x-3 p-2 hover:bg-accent rounded cursor-pointer">
          <Checkbox
            onCheckedChange={(checked) => handleMultipleCheckbox(name, option, !!checked)}
            checked={((formData as any)[name] || []).includes(option)}
          />
          <span className="text-sm text-card-foreground">{option}</span>
        </label>
      ))}
    </div>
  );

  const stepContent = [
    // Step 1: Student Basics
    <>
      {formGroup("What is your child's full name?",
        <Input
          type="text"
          name="child.name"
          value={formData.child?.name || ''}
          onChange={(e) => handleChange(e.target.name, e.target.value)}
          placeholder="Enter full legal name"
        />
      )}
      {formGroup("When was your child born?",
        <Input
          type="date"
          name="child.dob"
          value={formData.child?.dob || ''}
          onChange={(e) => handleChange(e.target.name, e.target.value)}
        />
      )}
      {formGroup("Select your child's current grade level:",
        <Select name="child.grade" value={formData.child?.grade || ''} onValueChange={(value) => handleChange('child.grade', value)}>
          <SelectTrigger><SelectValue placeholder="Select Grade" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Pre-K">Pre-K</SelectItem>
            <SelectItem value="Kindergarten">Kindergarten</SelectItem>
            {[...Array(12).keys()].map(i =>
              <SelectItem key={i + 1} value={`Grade ${i + 1}`}>Grade {i + 1}</SelectItem>
            )}
            <SelectItem value="Post-Secondary">Post-Secondary</SelectItem>
          </SelectContent>
        </Select>
      )}
      {formGroup("What is the name of your child’s school?",
        <Input
          type="text"
          name="school.name"
          value={formData.school?.name || ''}
          onChange={(e) => handleChange(e.target.name, e.target.value)}
          placeholder="Enter school name"
        />
      )}
      {formGroup("What school district is your child enrolled in?",
        <Input
          type="text"
          name="school.district"
          value={formData.school?.district || ''}
          onChange={(e) => handleChange(e.target.name, e.target.value)}
          placeholder="Enter school district name"
        />
      )}
      {formGroup("What is the primary language spoken in your home?",
        <Select name="primaryLanguage" value={formData.primaryLanguage || ''} onValueChange={(value) => handleChange('primaryLanguage', value)}>
            <SelectTrigger><SelectValue placeholder="Select Language" /></SelectTrigger>
            <SelectContent>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Spanish">Spanish</SelectItem>
                <SelectItem value="Mandarin">Mandarin</SelectItem>
                <SelectItem value="Arabic">Arabic</SelectItem>
                <SelectItem value="French">French</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
                <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
            </SelectContent>
        </Select>
      )}
      {formData.primaryLanguage && formData.primaryLanguage !== 'English' && formData.primaryLanguage !== 'Prefer not to say' &&
        formGroup("Does your child speak English fluently?",
            <Select name="englishFluency" value={formData.englishFluency || ''} onValueChange={(value) => handleChange('englishFluency', value)}>
                <SelectTrigger><SelectValue placeholder="Select fluency" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="Yes, fluent">Yes, fluent</SelectItem>
                    <SelectItem value="Conversational level">Conversational level</SelectItem>
                    <SelectItem value="Basic level">Basic level</SelectItem>
                    <SelectItem value="Very limited">Very limited</SelectItem>
                </SelectContent>
            </Select>
        )
      }
    </>,
    // Step 2: Disability & Eligibility
    <>
      {formGroup("Has your child ever been evaluated by the school district for special education?",
        <Select name="schoolEvaluation" value={formData.schoolEvaluation || ''} onValueChange={(value) => handleChange('schoolEvaluation', value)}>
            <SelectTrigger><SelectValue placeholder="Select an option" /></SelectTrigger>
            <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
                <SelectItem value="Evaluation in progress">Evaluation in progress</SelectItem>
                <SelectItem value="Requested, not started">Requested, not started</SelectItem>
            </SelectContent>
        </Select>
      )}

      {formData.schoolEvaluation === 'Yes' &&
        formGroup("What was the outcome of the evaluation?",
          <Select name="evaluationOutcome" value={formData.evaluationOutcome || ''} onValueChange={(value) => handleChange('evaluationOutcome', value)}>
            <SelectTrigger><SelectValue placeholder="Select an option" /></SelectTrigger>
            <SelectContent>
                <SelectItem value="Eligible">Eligible</SelectItem>
                <SelectItem value="Not eligible">Not eligible</SelectItem>
                <SelectItem value="Pending results">Pending results</SelectItem>
                <SelectItem value="Not sure">Not sure</SelectItem>
            </SelectContent>
          </Select>
        )
      }

      {formData.evaluationOutcome === 'Eligible' &&
        formGroup("What is your child’s IDEA eligibility category?",
            <Select name="eligibilityCategory" value={formData.eligibilityCategory || ''} onValueChange={(value) => handleChange('eligibilityCategory', value)}>
                <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="Autism">Autism</SelectItem>
                    <SelectItem value="Deafness">Deafness</SelectItem>
                    <SelectItem value="Emotional Disturbance">Emotional Disturbance</SelectItem>
                    <SelectItem value="Hearing Impairment">Hearing Impairment</SelectItem>
                    <SelectItem value="Intellectual Disability">Intellectual Disability</SelectItem>
                    <SelectItem value="Multiple Disabilities">Multiple Disabilities</SelectItem>
                    <SelectItem value="Orthopedic Impairment">Orthopedic Impairment</SelectItem>
                    <SelectItem value="Other Health Impairment">Other Health Impairment</SelectItem>
                    <SelectItem value="Specific Learning Disability">Specific Learning Disability</SelectItem>
                    <SelectItem value="Speech or Language Impairment">Speech or Language Impairment</SelectItem>
                    <SelectItem value="Traumatic Brain Injury">Traumatic Brain Injury</SelectItem>
                    <SelectItem value="Visual Impairment">Visual Impairment</SelectItem>
                    <SelectItem value="I'm not sure">I'm not sure</SelectItem>
                </SelectContent>
            </Select>
        )
      }

      {formGroup("Do you agree with the school's evaluation and eligibility?",
          <Select name="agreeWithEvaluation" value={formData.agreeWithEvaluation || ''} onValueChange={(value) => handleChange('agreeWithEvaluation', value)}>
              <SelectTrigger><SelectValue placeholder="Select an option" /></SelectTrigger>
              <SelectContent>
                  <SelectItem value="Yes, completely">Yes, completely</SelectItem>
                  <SelectItem value="Mostly agree">Mostly agree</SelectItem>
                  <SelectItem value="Disagree – incomplete">Disagree – incomplete</SelectItem>
                  <SelectItem value="Disagree – inaccurate">Disagree – inaccurate</SelectItem>
                  <SelectItem value="Disagree – outdated">Disagree – outdated</SelectItem>
              </SelectContent>
          </Select>
      )}

      {formGroup("Has your child received private evaluations?",
          <Select name="privateEvaluations" value={formData.privateEvaluations || ''} onValueChange={(value) => handleChange('privateEvaluations', value)}>
              <SelectTrigger><SelectValue placeholder="Select an option" /></SelectTrigger>
              <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
              </SelectContent>
          </Select>
      )}

      {formData.privateEvaluations === 'Yes' &&
          checkboxGroup('privateEvalTypes', [
            'Neuropsychological', 'Developmental pediatrician', 'Speech-language', 'Occupational therapy',
            'Physical therapy', 'Behavioral assessment', 'Psychiatric', 'Educational', 'Other'
          ], 'What types of private evaluations?')
      }
    </>,
    // Step 3: Educational Program
    <>
      {formGroup("Does your child currently have an IEP?",
        <Select name="hasIEP" value={formData.hasIEP || ''} onValueChange={value => handleChange('hasIEP', value)}>
          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Yes">Yes</SelectItem>
            <SelectItem value="No">No</SelectItem>
            <SelectItem value="Had in past">Had in past</SelectItem>
          </SelectContent>
        </Select>
      )}

      {formData.hasIEP === 'Yes' &&
        formGroup("When was the IEP last updated/reviewed?",
          <Select name="iepLastUpdated" value={formData.iepLastUpdated || ''} onValueChange={value => handleChange('iepLastUpdated', value)}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="<3 months">&lt;3 months</SelectItem>
              <SelectItem value="3–6 months">3–6 months</SelectItem>
              <SelectItem value="6–12 months">6–12 months</SelectItem>
              <SelectItem value=">1 year">&gt;1 year</SelectItem>
              <SelectItem value="Not sure">Not sure</SelectItem>
            </SelectContent>
          </Select>
        )
      }

      {formData.hasIEP === 'Yes' &&
        formGroup("What is the primary classroom setting?",
          <Select name="classroomSetting" value={formData.classroomSetting || ''} onValueChange={value => handleChange('classroomSetting', value)}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="General ed">General ed</SelectItem>
              <SelectItem value="ICT">ICT</SelectItem>
              <SelectItem value="Resource room">Resource room</SelectItem>
              <SelectItem value="Self-contained">Self-contained</SelectItem>
              <SelectItem value="Specialized school">Specialized school</SelectItem>
              <SelectItem value="Not sure">Not sure</SelectItem>
            </SelectContent>
          </Select>
        )
      }

      {formData.hasIEP === 'Yes' &&
        formGroup("Percentage of time in general education?",
          <Select name="genEdTime" value={formData.genEdTime || ''} onValueChange={value => handleChange('genEdTime', value)}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="80–100%">80–100%</SelectItem>
              <SelectItem value="40–79%">40–79%</SelectItem>
              <SelectItem value="0–39%">0–39%</SelectItem>
              <SelectItem value="Not sure">Not sure</SelectItem>
            </SelectContent>
          </Select>
        )
      }
      
      {formData.hasIEP === 'Yes' &&
        formGroup("Does the IEP include a BIP?",
          <Select name="hasBIP" value={formData.hasBIP || ''} onValueChange={value => handleChange('hasBIP', value)}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
              <SelectItem value="Not sure">Not sure</SelectItem>
            </SelectContent>
          </Select>
        )
      }

      {formData.hasIEP === 'Yes' &&
        formGroup("Does the IEP include ESY?",
          <Select name="hasESY" value={formData.hasESY || ''} onValueChange={value => handleChange('hasESY', value)}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
              <SelectItem value="Not sure">Not sure</SelectItem>
            </SelectContent>
          </Select>
        )
      }
    </>,
    // Step 4: Services & Supports
    <>
      {checkboxGroup('relatedServices', [
        'Speech', 'OT', 'PT', 'Counseling', 'Psychology',
        'Hearing/Audiology', 'Vision', 'Orientation/Mobility',
        'Assistive Tech', 'Nursing', 'None'
      ], "Related services in the IEP? (Checkboxes)")}

      <div className="my-4" />

      {checkboxGroup('accommodations', [
        'Extended time', 'Breaks', 'Reduced assignments', 'Preferential seating', 'Written directions',
        'Calculator/computer', 'Audio/read aloud', 'Large print', 'Quiet environment',
        'Visual cues', 'Organizational supports', 'None'
      ], "Accommodations in the IEP? (Checkboxes)")}

      <div className="my-4" />

      {checkboxGroup('modifications', [
        'Modified content', 'Alternative assignments', 'Grading changes', 'Reduced expectations',
        'Life skills curriculum', 'Alternative assessments', 'None'
      ], "Modifications in the IEP? (Checkboxes)")}

      <div className="my-4" />

      {formGroup("Does your child use assistive technology?",
        <Select name="assistiveTech" value={formData.assistiveTech || ''} onValueChange={value => handleChange('assistiveTech', value)}>
          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Yes, school device">Yes, school device</SelectItem>
            <SelectItem value="Yes, personal device">Yes, personal device</SelectItem>
            <SelectItem value="Recommended, not provided">Recommended, not provided</SelectItem>
            <SelectItem value="No">No</SelectItem>
          </SelectContent>
        </Select>
      )}

      {formGroup("Special transportation services?",
        <Select name="transportation" value={formData.transportation || ''} onValueChange={value => handleChange('transportation', value)}>
          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Special ed bus">Special ed bus</SelectItem>
            <SelectItem value="Regular bus with aide">Regular bus with aide</SelectItem>
            <SelectItem value="Door-to-door">Door-to-door</SelectItem>
            <SelectItem value="No">No</SelectItem>
          </SelectContent>
        </Select>
      )}
    </>,
    // Step 5: Progress & Concerns
    <>
      {formGroup("Is your child making progress on IEP goals?",
        <Select name="goalProgress" value={formData.goalProgress || ''} onValueChange={value => handleChange('goalProgress', value)}>
          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All goals">All goals</SelectItem>
            <SelectItem value="Some goals">Some goals</SelectItem>
            <SelectItem value="Limited">Limited</SelectItem>
            <SelectItem value="None">None</SelectItem>
            <SelectItem value="Not sure">Not sure</SelectItem>
          </SelectContent>
        </Select>
      )}

      {formGroup("Are services being provided as written?",
        <Select name="servicesProvided" value={formData.servicesProvided || ''} onValueChange={value => handleChange('servicesProvided', value)}>
          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Most">Most</SelectItem>
            <SelectItem value="Some">Some</SelectItem>
            <SelectItem value="Few">Few</SelectItem>
            <SelectItem value="Not sure">Not sure</SelectItem>
          </SelectContent>
        </Select>
      )}

      {checkboxGroup('primaryConcerns', [
          'Need for eval', 'Disagree with eval', 'IEP goals inappropriate', 'Services not delivered',
          'Insufficient services', 'Placement too restrictive', 'Placement not restrictive enough',
          'Behavior issues', 'No progress', 'Poor communication', 'Discipline issues',
          'Transition support', 'Other'
      ], 'What concerns do you have? (Checkboxes)')}
      
      <div className="my-4" />

      {formGroup("How long have these concerns existed?",
        <Select name="concernDuration" value={formData.concernDuration || ''} onValueChange={value => handleChange('concernDuration', value)}>
          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="<1 month">&lt;1 month</SelectItem>
            <SelectItem value="1–3 months">1–3 months</SelectItem>
            <SelectItem value="3–6 months">3–6 months</SelectItem>
            <SelectItem value="6–12 months">6–12 months</SelectItem>
            <SelectItem value=">1 year">&gt;1 year</SelectItem>
          </SelectContent>
        </Select>
      )}

      {formGroup("Have you documented your concerns?",
        <Select name="documentedConcerns" value={formData.documentedConcerns || ''} onValueChange={value => handleChange('documentedConcerns', value)}>
          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Yes, detailed letter">Yes, detailed letter</SelectItem>
            <SelectItem value="Yes, email">Yes, email</SelectItem>
            <SelectItem value="Yes, brief note">Yes, brief note</SelectItem>
            <SelectItem value="No, verbal only">No, verbal only</SelectItem>
            <SelectItem value="No, planning to">No, planning to</SelectItem>
          </SelectContent>
        </Select>
      )}
    </>,
    // Step 6: Communication & Next Steps
    <>
      {checkboxGroup('schoolContacts', [
        'SpEd Teacher', 'GenEd Teacher', 'Principal/AP', 'Psychologist', 'CSE Chair',
        'Related Service Provider', 'Counselor', 'SpEd Coordinator', 'Superintendent', 'No one'
      ], 'Who have you contacted? (Checkboxes)')}

      <div className="my-4" />

      {formGroup("Has the school provided PWN?",
        <Select name="receivedPWN" value={formData.receivedPWN || ''} onValueChange={value => handleChange('receivedPWN', value)}>
          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Yes">Yes</SelectItem>
            <SelectItem value="No">No</SelectItem>
            <SelectItem value="Don't know what that is">Don't know what that is</SelectItem>
          </SelectContent>
        </Select>
      )}

      {checkboxGroup('desiredOutcomes', [
        'Initial evaluation', 'Independent evaluation', 'IEP meeting', 'Change goals',
        'Add/change services', 'Change placement', 'BIP', 'Compensatory services',
        'Staff training', 'Better communication', 'Resolve discipline issue', 'Other'
      ], 'What outcome do you want? (Checkboxes)')}

      <div className="my-4" />

      {formGroup("Preferred timeline for resolution?",
        <Select name="preferredTimeline" value={formData.preferredTimeline || ''} onValueChange={value => handleChange('preferredTimeline', value)}>
          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ASAP">ASAP</SelectItem>
            <SelectItem value="Within 2 weeks">Within 2 weeks</SelectItem>
            <SelectItem value="Within 1 month">Within 1 month</SelectItem>
            <SelectItem value="By end of school year">By end of school year</SelectItem>
            <SelectItem value="Flexible">Flexible</SelectItem>
          </SelectContent>
        </Select>
      )}

      {formGroup("Additional information",
        <Textarea
          name="additionalInfo"
          value={formData.additionalInfo || ''}
          onChange={(e) => handleChange(e.target.name, e.target.value)}
          placeholder="Free text..."
        />
      )}
    </>
  ];

  const renderPreview = () => (
    <Card>
        <CardHeader>
            <div className="flex items-center justify-between">
                <CardTitle>Profile Complete! 🎉</CardTitle>
                <Button variant="ghost" onClick={() => setShowPreview(false)}>← Back to Edit</Button>
            </div>
        </CardHeader>
        <CardContent>
            <Card>
                <CardHeader><CardTitle>Summary for {formData.child.name || 'Student'}</CardTitle></CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h5 className="font-medium text-foreground mb-2">Student Information</h5>
                        <ul className="text-sm text-muted-foreground space-y-1">
                            <li><strong>Name:</strong> {formData.child.name || 'Not provided'}</li>
                            <li><strong>Grade:</strong> {formData.child.grade || 'Not provided'}</li>
                            <li><strong>School:</strong> {formData.school?.name || 'Not provided'}</li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-medium text-foreground mb-2">Special Education Status</h5>
                        <ul className="text-sm text-muted-foreground space-y-1">
                            <li><strong>Has IEP:</strong> {formData.hasIEP || 'Not specified'}</li>
                            <li><strong>Eligibility:</strong> {formData.eligibilityCategory || 'Not specified'}</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </CardContent>
    </Card>
  );

  const onSubmit = () => {
    // There is no need to map data, as formData is already in the correct Profile shape.
    setProfile(formData);
    setShowPreview(true);
    toast({
      title: "Profile Ready for Saving",
      description: "Review your profile summary and save it to your device.",
    });
  };

  const renderStep = () => {
    if (showPreview) return renderPreview();

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {renderProgressBar()}
          <Card>
            <CardHeader>
                <CardTitle>Step {step}: {stepTitles[step - 1]}</CardTitle>
            </CardHeader>
            <CardContent>
                {stepContent[step - 1]}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div>
        {renderStep()}
        <div className="mt-8 flex justify-between items-center">
            <div>
            {!showPreview && step > 1 && (
                <Button variant="outline" onClick={prevStep}>← Previous</Button>
            )}
            </div>
            
            <div className="flex gap-3">
            {!showPreview && step < stepTitles.length && (
                <Button onClick={nextStep}>Next →</Button>
            )}
            
            {!showPreview && step === stepTitles.length && (
                <Button onClick={onSubmit}>Review & Save →</Button>
            )}
            
            {showPreview && (
                <Button onClick={() => setProfile(formData)}>Update Profile in Session</Button>
            )}
            </div>
        </div>
    </div>
  );
};
