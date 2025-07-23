export interface LetterTemplate {
  id: string;
  name: string;
  description: string;
  body: string;
}

export const letterTemplates: LetterTemplate[] = [
  {
    id: 'request-evaluation',
    name: 'Request for Evaluation (Child Find)',
    description: 'A formal letter to request an initial special education evaluation for your child.',
    body: `[Parent Name]
[Parent Address]
[City, State, Zip]
[Date]

[Principal's Name], Principal
[School Name]
[School Address]
[City, State, Zip]

CC: Director of Special Education

Subject: Referral for Comprehensive Special Education Evaluation for {{childName}}

Dear Mr./Ms. {{principalName}},

I am writing to formally refer my child, {{childName}} (DOB: {{childDob}}, Student ID: {{childStudentId}}), for a comprehensive evaluation for special education and related services. {{childName}} is currently a student in {{childGrade}} grade at {{schoolName}}.

I have significant concerns about my child's educational progress and suspect they may have a disability that is adversely impacting their ability to learn. Specifically, my concerns are as follows:
{{childConcerns}}

Pursuant to the Individuals with Disabilities Education Act (IDEA) and its "Child Find" mandate, I request that my child be evaluated in all areas of suspected disability. This should include, but not be limited to, assessments in the following areas: [Suggest areas if known, e.g., Academic/Achievement, Cognitive, Speech and Language, Occupational Therapy, Social-Emotional, Functional Behavior].

I understand that the school district must obtain my written informed consent before the evaluation can begin, and that once consent is provided, the initial evaluation must be completed within 60 calendar days.

I look forward to receiving the proposed evaluation plan and consent forms. I would be happy to meet to discuss this further.

Thank you for your time and attention to this critical matter.

Sincerely,
{{parent1Name}}
{{parent1Phone}}
{{parent1Email}}`,
  },
  {
    id: 'request-504-evaluation',
    name: 'Request for 504 Plan Evaluation',
    description: 'A formal letter to request an evaluation for a 504 Plan for accommodations.',
    body: `[Parent Name]
[Parent Address]
[City, State, Zip]
[Date]

[School's 504 Coordinator or Principal Name]
[School Name]
[School Address]
[City, State, Zip]

Subject: Request for Evaluation for a 504 Plan for {{childName}}

Dear Mr./Ms. [504 Coordinator or Principal Name],

I am writing to request an evaluation to determine my child, {{childName}}'s, eligibility for accommodations under Section 504 of the Rehabilitation Act of 1973. {{childName}} is a student in the {{childGrade}} grade.

My child has been diagnosed with [Child's Diagnosis], which substantially limits their ability in one or more major life activities, including [e.g., learning, concentrating, reading, thinking, focusing].

I believe {{childName}} requires accommodations to ensure they have equal access to their education and the school environment. To address these challenges, I request that the team consider accommodations such as:
- [Suggest specific accommodations, e.g., Preferential seating away from distractions]
- [e.g., Extended time on tests and assignments]
- [e.g., Copies of teacher notes or outlines]
- [e.g., Use of a calculator for math assignments]

I have attached documentation from my child's doctor confirming this diagnosis and supporting the need for accommodations. I would like to meet with the 504 team to discuss this request and the evaluation process.

Thank you for your consideration.

Sincerely,
{{parent1Name}}
{{parent1Phone}}
{{parent1Email}}`,
  },
  {
    id: 'consent-to-evaluate',
    name: 'Consent to Evaluate',
    description: 'A letter to provide or refuse consent for a proposed school evaluation.',
    body: `[Parent Name]
[Parent Address]
[City, State, Zip]
[Date]

[Special Education Coordinator's Name]
[School Name]
[School Address]
[City, State, Zip]

Subject: Response to Proposed Evaluation Plan for {{childName}}

Dear Mr./Ms. {{schoolSpecialEducationCoordinator}},

I have received the district's proposed evaluation plan dated [Date of Plan] for my child, {{childName}}.

[CHOOSE ONE OPTION BELOW]

OPTION 1: GIVING CONSENT
I hereby give my informed consent for the district to conduct the evaluations as outlined in the plan. I understand that this consent initiates the 60-day timeline for the completion of the evaluation.
[Optional: I am consenting to these evaluations but am also formally requesting that an evaluation in the area of [Missing Area, e.g., Occupational Therapy] be added to address my concerns regarding [Concern, e.g., handwriting].]

OPTION 2: REFUSING CONSENT
I am refusing to provide consent for the proposed evaluation at this time.

Please let me know if you have any questions. I have retained a copy of this signed letter for my records.

Thank you.

Sincerely,
{{parent1Name}}
{{parent1Phone}}
{{parent1Email}}`,
  },
  {
    id: 'request-iee',
    name: 'Request for Independent Educational Evaluation (IEE)',
    description: 'A request for an outside evaluation at public expense when you disagree with the school\'s evaluation.',
    body: `[Parent Name]
[Parent Address]
[City, State, Zip]
[Date]

[Special Education Coordinator's Name]
[School Name]
[School Address]
[City, State, Zip]

Subject: Request for Independent Educational Evaluation (IEE) at Public Expense

Dear Mr./Ms. {{schoolSpecialEducationCoordinator}},

I am writing to request an Independent Educational Evaluation (IEE) at public expense for my child, {{childName}}.

I disagree with the results of the [Specify evaluation, e.g., Psychoeducational Evaluation, Functional Behavioral Assessment] conducted by the district, which was completed on or around [Date of evaluation report].

I understand that upon receiving this request, the district must either agree to fund the IEE or file for a due process hearing to prove that its evaluation was appropriate.

Please provide me with a copy of the district's criteria for IEEs, including any requirements for evaluator qualifications and reasonable cost criteria.

I look forward to your written response to this request.

Sincerely,
{{parent1Name}}
{{parent1Phone}}
{{parent1Email}}`,
  },
  {
    id: 'iep-meeting-request',
    name: 'Request for an IEP Meeting',
    description: 'Use this letter to request a meeting to review or revise your child\'s Individualized Education Program (IEP).',
    body: `[Parent Name]
[Parent Address]
[City, State, Zip]
[Date]

[Special Education Coordinator's Name]
[School Name]
[School Address]
[City, State, Zip]

Subject: Request to Convene an IEP Meeting for {{childName}}

Dear Mr./Ms. {{schoolSpecialEducationCoordinator}},

I am writing to request an IEP meeting for my child, {{childName}}, a student in the {{childGrade}} grade at {{schoolName}}.

I am requesting this meeting to discuss my concerns and propose amendments to the current IEP. The primary topics I would like to address are:
- [List specific concerns or topics here, e.g., Lack of progress on reading fluency goals]
- [e.g., Recent behavioral incidents and the need for a Functional Behavioral Assessment]
- [e.g., A new medical diagnosis and its impact on their school day]
- [e.g., Revisiting accommodations, as the current ones are not effective]

I would appreciate it if all relevant members of the IEP team could be present. Please send me a written notice of the meeting with proposed dates and times.

I look forward to working with you to ensure {{childName}} receives the support they need to succeed.

Thank you.

Sincerely,
{{parent1Name}}
{{parent1Phone}}
{{parent1Email}}`,
  },
  {
    id: 'request-transition-planning',
    name: 'Request for Transition Planning Meeting',
    description: 'A request for an IEP meeting focused on post-secondary transition planning.',
    body: `[Parent Name]
[Parent Address]
[City, State, Zip]
[Date]

[Special Education Coordinator's Name]
[School Name]
[School Address]
[City, State, Zip]

Subject: Request for Transition Planning IEP Meeting for {{childName}}

Dear Mr./Ms. {{schoolSpecialEducationCoordinator}},

As my child, {{childName}}, is now [Age of child], I am writing to request an IEP meeting specifically to develop and discuss their post-secondary transition plan, as required by the Individuals with Disabilities Education Act (IDEA).

We would like to ensure that the IEP includes measurable post-secondary goals related to training/education, employment, and, where appropriate, independent living skills.

As required by law, I request that {{childName}} be invited to attend this meeting to participate in their planning.

Please propose some dates for this meeting at your earliest convenience.

Thank you.

Sincerely,
{{parent1Name}}
{{parent1Phone}}
{{parent1Email}}`,
  },
  {
    id: 'request-transportation',
    name: 'Request for Transportation as a Related Service',
    description: 'A request to add specialized transportation to the IEP.',
    body: `[Parent Name]
[Parent Address]
[City, State, Zip]
[Date]

[Special Education Coordinator's Name]
[School Name]
[School Address]
[City, State, Zip]

Subject: Request for Transportation as a Related Service for {{childName}}

Dear Mr./Ms. {{schoolSpecialEducationCoordinator}},

I am writing to request an IEP meeting to discuss adding specialized transportation to my child, {{childName}}'s, IEP as a related service.

Transportation is required for my child to benefit from their special education program due to their disability-related needs. Specifically, [Explain the connection clearly. e.g., "due to my child's mobility impairment, they require a wheelchair-accessible bus." OR "due to my child's autism and significant safety concerns, they cannot travel on a standard bus and require door-to-door transportation with a bus aide."]

This service is necessary to ensure my child can access their Free Appropriate Public Education (FAPE). I have attached a letter from my child's physician that further explains this need.

I look forward to meeting with the team to discuss this.

Sincerely,
{{parent1Name}}
{{parent1Phone}}
{{parent1Email}}`,
  },
  {
    id: 'request-home-instruction',
    name: 'Request for Home Instruction',
    description: 'A request for home instruction (tutoring) due to medical needs.',
    body: `[Parent Name]
[Parent Address]
[City, State, Zip]
[Date]

[Special Education Coordinator's Name]
[School Name]
[School Address]
[City, State, Zip]

Subject: Request for Home Instruction for {{childName}} Due to Medical Needs

Dear Mr./Ms. {{schoolSpecialEducationCoordinator}},

I am writing to request that the district provide home instruction for my child, {{childName}}, who is medically unable to attend school at this time.

As required, I have attached a statement from my child's physician, Dr. [Doctor's Name], explaining the medical necessity for their absence from school and the anticipated duration.

Please provide me with a plan for the provision of these services, including the number of hours of instruction per week and how IEP-mandated related services (e.g., speech, counseling) will be delivered.

Thank you for your prompt attention to this matter.

Sincerely,
{{parent1Name}}
{{parent1Phone}}
{{parent1Email}}`,
  },
  {
    id: 'notice-intent-private-services',
    name: 'Notice of Intent for Private Services',
    description: 'A warning that you will seek private services and reimbursement due to implementation failures.',
    body: `[Parent Name]
[Parent Address]
[City, State, Zip]
[Date]

[Special Education Coordinator's Name]
[School Name]
[School Address]
[City, State, Zip]

Subject: Notice of Failure to Implement IEP and Intent to Secure Private Services for {{childName}}

Dear Mr./Ms. {{schoolSpecialEducationCoordinator}},

This letter serves as formal notice that the district has failed to implement the Individualized Education Program (IEP) for my child, {{childName}}, dated [Date of IEP].

Specifically, the IEP mandates [Clearly state the service and frequency, e.g., "three 30-minute sessions of individual speech therapy per week"]. The district has failed to provide this service. To date, my child has missed [Number] sessions since [Date of first missed session].

This failure to provide services constitutes a denial of a Free Appropriate Public Education (FAPE).

This letter serves as my formal notice that if the district does not immediately begin providing all mandated services and schedule make-up sessions for all missed services, I will secure a qualified private provider to deliver these services. I will then seek full reimbursement from the district for the cost of these private services, through a due process hearing if necessary.

Please respond within five (5) business days with a plan to immediately rectify this situation.

Sincerely,
{{parent1Name}}
{{parent1Phone}}
{{parent1Email}}`,
  },
  {
    id: 'request-compensatory-services',
    name: 'Request for Compensatory Services',
    description: 'A request for make-up services to remedy a past failure by the district to provide FAPE.',
    body: `[Parent Name]
[Parent Address]
[City, State, Zip]
[Date]

[Special Education Coordinator's Name]
[School Name]
[School Address]
[City, State, Zip]

Subject: Request for Compensatory Services for {{childName}}

Dear Mr./Ms. {{schoolSpecialEducationCoordinator}},

I am writing to request compensatory services for my child, {{childName}}, to remedy a past denial of a Free Appropriate Public Education (FAPE).

From [Start Date] to [End Date], the district failed to provide the following services as mandated in my child's IEP dated [Date of IEP]:
- [List the missed services with specificity, e.g., "Two 60-minute sessions per week of specialized reading instruction."]

This failure to implement the IEP resulted in a significant loss of educational benefit. As a result, my child has [Describe the harm, e.g., "regressed in their reading skills and failed to make progress on their goals."].

To remedy this denial of FAPE, I am requesting [Number] hours of compensatory education in the area of [Service, e.g., reading instruction], to be provided by a qualified professional.

I would like to schedule an IEP meeting to discuss this request and agree on a plan for these services.

Thank you.

Sincerely,
{{parent1Name}}
{{parent1Phone}}
{{parent1Email}}`,
  },
  {
    id: 'request-mediation',
    name: 'Request for Mediation',
    description: 'A formal request to engage in a voluntary dispute resolution process with a neutral mediator.',
    body: `[Parent Name]
[Parent Address]
[City, State, Zip]
[Date]

[Director of the appropriate Dispute Resolution Center, if applicable]
[Address of Center]

CC: [Special Education Coordinator's Name], [School District]

Subject: Request for Mediation Regarding {{childName}}

Dear [Director's Name],

I am writing to request mediation to resolve a dispute with the [School District Name] regarding the educational program for my child, {{childName}} (DOB: {{childDob}}).

The issues I wish to resolve through mediation include, but are not limited to:
- [Clearly and concisely list the points of disagreement, e.g., "The appropriateness of the proposed IEP goals."]
- [e.g., "The district's refusal to provide an Independent Educational Evaluation."]
- [e.g., "The proposed change in placement from a general education to a self-contained classroom."]

I believe that mediation will provide an opportunity to resolve these issues collaboratively. Please let me know the next steps for scheduling this process.

Thank you.

Sincerely,
{{parent1Name}}
{{parent1Phone}}
{{parent1Email}}`,
  },
  {
    id: 'request-due-process',
    name: 'Request for Due Process Hearing',
    description: 'A formal complaint to initiate a due process hearing (a legal proceeding).',
    body: `[Parent Name]
[Parent Address]
[City, State, Zip]
[Date]

[Special Education Coordinator's Name]
[School Name]
[School Address]
[City, State, Zip]

Subject: Due Process Complaint Notice for {{childName}}

Dear Mr./Ms. {{schoolSpecialEducationCoordinator}},

This letter serves as a formal due process complaint notice regarding my child, {{childName}}, who resides at the address above and attends {{schoolName}}.

This complaint concerns the following issues:
[Provide a detailed description of the nature of the problem. Be factual and specific.]
Example: "The district conducted a psychoeducational evaluation on October 15, 2024, that was not sufficiently comprehensive to assess all areas of suspected disability, specifically failing to assess my child's motor skills despite clear evidence of dysgraphia."

As a resolution to this problem, I am proposing the following:
[Describe exactly what you want the Hearing Officer to order.]
Example: "I am requesting an order for the district to fund an Independent Educational Evaluation in the area of Occupational Therapy."

Please accept this letter as my formal request for a due process hearing. I am also invoking my child's "stay-put" rights, detailed in a separate letter.

Sincerely,
{{parent1Name}}
{{parent1Phone}}
{{parent1Email}}`,
  },
  {
    id: 'invoke-stay-put',
    name: 'Pendency (Stay-Put) Invocation Letter',
    description: 'A letter asserting your child\'s right to remain in their current placement during a dispute.',
    body: `[Parent Name]
[Parent Address]
[City, State, Zip]
[Date]

[Special Education Coordinator's Name]
[School Name]
[School Address]
[City, State, Zip]

Subject: Invocation of "Stay-Put" Rights for {{childName}}

Dear Mr./Ms. {{schoolSpecialEducationCoordinator}},

This letter is to formally notify you that on [Date], I filed a [request for a due process hearing / request for mediation] regarding my child, {{childName}}.

By filing this action, my child's "stay-put" (pendency) rights under the Individuals with Disabilities Education Act (IDEA) are now in effect.

My child's "then-current educational placement" is the last agreed-upon and implemented Individualized Education Program (IEP), dated [Date of last agreed-upon IEP]. This includes all services, supports, and the educational setting described in that IEP.

The district must continue to maintain this placement and provide all services without interruption until the present dispute is fully resolved. Any unilateral change to this program would be a violation of my child's rights.

Please ensure all relevant staff are aware of their stay-put obligations.

Sincerely,
{{parent1Name}}
{{parent1Phone}}
{{parent1Email}}`,
  },
  {
    id: 'notice-unilateral-placement',
    name: '10-Day Notice of Unilateral Placement',
    description: 'A formal notice that you are enrolling your child in a private school and will seek tuition reimbursement.',
    body: `[Parent Name]
[Parent Address]
[City, State, Zip]
[Date]

[Special Education Coordinator's Name]
[School Name]
[School Address]
[City, State, Zip]

Subject: Ten-Day Notice of Unilateral Placement and Intent to Seek Tuition Reimbursement for {{childName}}

Dear Mr./Ms. {{schoolSpecialEducationCoordinator}},

This letter serves as my formal written notice, as required by the Individuals with Disabilities Education Act (IDEA), 34 C.F.R. § 300.148.

I am rejecting the Individualized Education Program (IEP) and placement offered by the district for my child, {{childName}}, at the IEP meeting on [Date of IEP meeting]. The proposed program is not reasonably calculated to provide my child with a Free Appropriate Public Education (FAPE).

It is my intention to unilaterally enroll my child at [Name of Private School], located at [Address of Private School], at the district's expense. This placement will begin on or after [Date, at least 10 business days from this letter]. The private school placement I have chosen is appropriate to meet my child's special education needs.

I intend to seek full reimbursement for the cost of this placement from the school district.

Sincerely,
{{parent1Name}}
{{parent1Phone}}
{{parent1Email}}`,
  },
  {
    id: 'request-nickerson-letter',
    name: 'Request for Nickerson Letter (NYC Specific)',
    description: 'A request for funding for a non-public school due to the DOE missing a deadline (NYC only).',
    body: `[Parent Name]
[Parent Address]
[City, State, Zip]
[Date]

[Central Based Support Team (CBST)]
[New York City Department of Education]
[Address]

Subject: Request for Nickerson Letter for {{childName}} (Student ID: {{childStudentId}})

To Whom It May Concern:

I am writing to request a Nickerson Letter (P-1 Letter) for my child, {{childName}}, for the [School Year] school year.

I provided the Department of Education (DOE) with my signed consent for an initial evaluation for my child on [Date of Consent]. As of today's date, more than 60 school days have elapsed, and the DOE has failed to provide a Final Notice of Recommendation (FNR) offering a placement for my child.

This procedural violation has resulted in a denial of a Free Appropriate Public Education (FAPE). Therefore, I am entitled to funding for a state-approved non-public school.

Please issue this letter promptly so I may secure an appropriate placement for my child.

Thank you.

Sincerely,
{{parent1Name}}
{{parent1Phone}}
{{parent1Email}}`,
  },
  {
    id: 'request-mdr',
    name: 'Request for Manifestation Determination Review (MDR)',
    description: 'A request for a meeting to determine if misconduct was a manifestation of a child\'s disability.',
    body: `[Parent Name]
[Parent Address]
[City, State, Zip]
[Date]

[Principal's Name]
[School Name]
[School Address]
[City, State, Zip]

CC: [Special Education Coordinator's Name]

Subject: Request for Manifestation Determination Review (MDR) for {{childName}}

Dear Mr./Ms. {{principalName}},

I am writing to request a Manifestation Determination Review (MDR) for my child, {{childName}}, regarding the incident that occurred on [Date of incident].

This meeting is required under the Individuals with Disabilities Education Act (IDEA) because the school has decided to [suspend my child / remove my child from their current placement] for more than 10 school days.

The purpose of this meeting is to determine if my child's conduct was caused by, or had a direct and substantial relationship to, their disability, or if the conduct was a direct result of the school's failure to implement the IEP.

Please schedule this MDR to occur within 10 school days of the date of the disciplinary decision. Please also provide me with all relevant records you will be reviewing prior to the meeting.

Thank you.

Sincerely,
{{parent1Name}}
{{parent1Phone}}
{{parent1Email}}`,
  },
  {
    id: 'records-request',
    name: 'FERPA Request for Educational Records',
    description: 'A formal request to inspect and obtain copies of your child\'s educational records.',
    body: `[Parent Name]
[Parent Address]
[City, State, Zip]
[Date]

[Principal's Name or Records Custodian]
[School Name]
[School Address]
[City, State, Zip]

Subject: Request to Inspect and Copy All Educational Records for {{childName}} under FERPA

Dear Mr./Ms. {{principalName}},

Pursuant to the Family Educational Rights and Privacy Act (FERPA), 20 U.S.C. § 1232g, I am writing to request access to and copies of any and all educational records for my child, {{childName}} (DOB: {{childDob}}, Student ID: {{childStudentId}}).

This request includes, but is not limited to, all cumulative files, confidential files, psychological and testing data (including test protocols), behavioral records, functional behavioral assessments, communication logs, attendance records, disciplinary records, emails mentioning my child, and any other paper or electronic records maintained by the school district related to my child.

Please inform me of the process and any associated costs for obtaining these copies. I understand that under FERPA, you have up to 45 calendar days to comply with this request, but I would appreciate receiving them sooner if possible.

Thank you for your assistance.

Sincerely,
{{parent1Name}}
{{parent1Phone}}
{{parent1Email}}`,
  },
  {
    id: 'revoke-consent',
    name: 'Revocation of Consent for Services',
    description: 'A formal letter to withdraw your child from all special education services.',
    body: `[Parent Name]
[Parent Address]
[City, State, Zip]
[Date]

[Special Education Coordinator's Name]
[School Name]
[School Address]
[City, State, Zip]

Subject: Written Revocation of Consent for All Special Education and Related Services for {{childName}}

Dear Mr./Ms. {{schoolSpecialEducationCoordinator}},

This letter serves as my formal, written revocation of consent for the continued provision of all special education and related services for my child, {{childName}}, under the Individuals with Disabilities Education Act (IDEA).

I understand that this action is effective upon the school district's receipt of this letter. I acknowledge that by revoking consent:
1. The school district will no longer provide any special education or related services to my child.
2. My child will be treated as a general education student in all respects.
3. My child will no longer be entitled to the rights and procedural safeguards of the IDEA, including those related to discipline.
4. The school district is not required to amend my child's education records to remove any references to their previous receipt of special education services.

This decision has been made after careful consideration. Please provide me with Prior Written Notice confirming the date that all services will cease.

Sincerely,
{{parent1Name}}
{{parent1Phone}}
{{parent1Email}}`,
  },
];
