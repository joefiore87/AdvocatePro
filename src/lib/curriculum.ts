export interface LetterStop {
  id: string;
  title: string;
  whatItIs: string;
  whyYouUseIt: string;
  keyElements: string[];
  proTip: string;
}

export interface CurriculumStage {
  id: string;
  title: string;
  description: string;
  letterStops: LetterStop[];
}

export const curriculum: CurriculumStage[] = [
  {
    id: 'module-1',
    title: "Module 1: The Journey Begins - From Concern to Referral",
    description: "This is the starting point. You've noticed your child is struggling in school—academically, socially, or behaviorally—and you believe they may need more support. This module covers your first, most critical steps, including understanding the school's legal obligation under 'Child Find' to identify students with disabilities.",
    letterStops: [
      {
        id: 'request-evaluation',
        title: 'Referral for Initial Evaluation (Child Find Request)',
        whatItIs: "A formal, written request asking the school district to conduct a comprehensive evaluation of your child to determine if they are eligible for special education and related services under the Individuals with Disabilities Education Act (IDEA). This letter officially triggers the district's 'Child Find' duty for your specific child.",
        whyYouUseIt: "This letter is the official starting pistol for the special education process. It establishes a legal record and, once you provide written consent, starts a strict timeline. In most states, the district has 60 calendar days from receiving your consent to complete the initial evaluation.",
        keyElements: [
          "Clear Statement of Referral: Begin by stating, 'I am writing to refer my child, [Child's Name], for a comprehensive evaluation for special education services.'",
          "Specific Concerns: Describe your observations in factual, objective terms.",
          "Request for Comprehensive Evaluation: Crucially, state that you are requesting your child be evaluated 'in all areas of suspected disability'."
        ],
        proTip: "Address the letter to the school principal and copy the district's Director of Special Education. Sending via email creates an instant, dated record. Follow up with a phone call to confirm receipt."
      },
      {
        id: 'request-504-evaluation',
        title: '504 Accommodation Request',
        whatItIs: "A request for the school to evaluate your child for eligibility under Section 504 of the Rehabilitation Act of 1973, a civil rights law.",
        whyYouUseIt: "This path is for students who have a physical or mental impairment that 'substantially limits' a major life activity (like learning or concentrating) but who may not need the specialized instruction of an IEP. It provides accommodations for equal access.",
        keyElements: [
          "Identify the Impairment: Clearly state your child's diagnosis or condition (e.g., ADHD, anxiety, diabetes).",
          "Explain the 'Substantial Limitation': Connect the impairment to a 'major life activity'.",
          "Suggest Accommodations: Propose specific, reasonable accommodations (e.g., preferential seating, extended time on tests)."
        ],
        proTip: "You can request a 504 evaluation at the same time you request an IEP evaluation. Providing a doctor's note that confirms the diagnosis and explains the need for accommodations can significantly strengthen your request."
      },
    ],
  },
  {
    id: 'module-2',
    title: "Module 2: The Evaluation - Gathering the Information",
    description: "Once you've made a referral, the next phase is the evaluation. This is the data-gathering process that will determine if your child has a disability under IDEA and what their specific educational needs are.",
    letterStops: [
      {
        id: 'consent-to-evaluate',
        title: 'Consent to Evaluate or Refusal to Consent',
        whatItIs: "Your formal written response to the district's proposed evaluation plan. You are the gatekeeper; the evaluation cannot begin without your signature.",
        whyYouUseIt: "This letter documents your official decision. Signing consent triggers the 60-day timeline for the evaluation to be completed. If you refuse consent, the district may use a due process hearing to get an order to evaluate.",
        keyElements: [
          "Explicit Statement: Clearly state, 'I give my informed consent for the district to conduct the evaluations outlined in the plan dated [Date],' or 'I am refusing consent...'",
          "Retain a Copy: Always keep a copy of the signed consent form for your records."
        ],
        proTip: "Before signing, carefully review the proposed assessments. If you believe an area of concern is missing (e.g., an Occupational Therapy evaluation), you can write on the consent form, 'I am consenting to these evaluations but am also formally requesting an OT evaluation be added.'"
      },
      {
        id: 'request-iee',
        title: 'Request for an Independent Educational Evaluation (IEE)',
        whatItIs: "A request for an evaluation in an area where you disagree with the school's evaluation, to be conducted by a qualified independent professional, and paid for by the school district.",
        whyYouUseIt: "This is one of the most powerful procedural safeguards. It 'levels the playing field' by allowing you to get a second opinion. The school must either agree to fund the IEE or file for due process to prove its evaluation was appropriate.",
        keyElements: [
          "State Disagreement: Clearly state, 'I am writing to request an Independent Educational Evaluation (IEE) at public expense. I disagree with the results of the [e.g., Psychoeducational Evaluation] conducted by the district on [Date].'",
          "No Reason Required: You are not legally required to explain why you disagree.",
          "Identify Area: Specify which evaluation you disagree with (e.g., psychological, speech-language, FBA)."
        ],
        proTip: "Before sending the letter, research potential evaluators and their fees. The district can have 'reasonable cost criteria,' but they must provide you with this information. If their rate is too low to find a qualified evaluator, you can challenge it."
      }
    ],
  },
  {
    id: 'module-3',
    title: "Module 3: Crafting the Plan - The IEP and Its Services",
    description: "After the evaluations are complete, the team meets to create the Individualized Education Program (IEP)—the legally binding contract that is the cornerstone of your child's education. Your role as an equal participant is legally protected.",
    letterStops: [
      {
        id: 'iep-meeting-request',
        title: 'Request for Amendment or Review of IEP',
        whatItIs: "A letter formally requesting that the IEP team reconvene to discuss and potentially revise your child's IEP.",
        whyYouUseIt: "You don't have to wait for the annual review. Use this if your child isn't making progress, has met their goals, has a new diagnosis, or is exhibiting new challenges.",
        keyElements: [
          "Clear Purpose: 'I am requesting an IEP meeting to review and amend my child's current IEP.'",
          "State Your Reasons: Briefly explain your concerns. 'I am concerned about the lack of progress on their reading fluency goal.'",
        ],
        proTip: "Bring data to the meeting. This could be work samples showing a lack of progress, logs you've kept of behavioral incidents, or a new report from an outside therapist. Data moves the conversation from opinion to evidence."
      },
      {
        id: 'request-transition-planning',
        title: 'Request to Reconvene for Transition Planning',
        whatItIs: "A request for an IEP meeting specifically focused on developing the 'transition plan,' which is the section of the IEP that prepares a student for life after high school.",
        whyYouUseIt: "Federal law (IDEA) requires this planning to start in the IEP that will be in effect when the student turns 16. This letter ensures the team formally addresses post-secondary goals.",
        keyElements: [
          "Cite the Requirement: 'As my child is now [Age], I am requesting a transition planning meeting as required by IDEA.'",
          "Request Student Attendance: The law requires that the student be invited to any IEP meeting where transition is discussed."
        ],
        proTip: "The transition plan should be driven by the student's own interests and goals. Before the meeting, talk with your child about what they want to do after high school."
      },
      {
        id: 'request-transportation',
        title: 'Request for Transportation as a Related Service',
        whatItIs: "A request to add specialized transportation to the IEP as a 'related service' necessary for the child to benefit from their special education program.",
        whyYouUseIt: "If a child's disability prevents them from getting to and from school in the same way as their non-disabled peers, the district must provide transportation (e.g., special bus, aide, door-to-door service).",
        keyElements: [
          "Connect to Disability: Clearly explain why transportation is needed because of the disability. For example, 'Due to my child's autism and sensory sensitivities, they are a safety risk on a standard school bus.'"
        ],
        proTip: "This is not about convenience. A supporting letter from a doctor or therapist explaining the medical or behavioral necessity for specialized transport is extremely persuasive evidence for the IEP team."
      },
      {
        id: 'request-home-instruction',
        title: 'Request for Home Instruction Due to Medical Needs',
        whatItIs: "A request for the district to provide educational services (tutoring) at home or in a hospital when a child is medically unable to attend school for an extended period.",
        whyYouUseIt: "When a child is medically unable to attend school, the district's responsibility to provide a Free Appropriate Public Education (FAPE) does not end.",
        keyElements: [
          "Physician's Note: This request is almost always required to be accompanied by a doctor's statement explaining the medical necessity and the likely duration.",
          "Request for Services: The letter should ask for the district to arrange for a qualified teacher to provide instruction."
        ],
        proTip: "Ask the district for a clear plan that includes not only core academic subjects but also how related services on the IEP (like speech or counseling) will be provided."
      }
    ]
  },
  {
    id: 'module-4',
    title: "Module 4: Addressing Gaps - When the IEP Isn't Followed",
    description: "An IEP is a legally binding contract. If the school does not provide the services as written, it is a violation of the law. This is often called an 'implementation failure.'",
    letterStops: [
      {
        id: 'notice-intent-private-services',
        title: 'Notice of Intent to Seek Private Services',
        whatItIs: "A formal, written warning that the district has failed to provide an IEP service, and if they do not fix it immediately, you will hire a private provider and seek reimbursement.",
        whyYouUseIt: "This letter creates a paper trail showing you gave the district a chance to fix its mistake before you spent your own money. This strengthens any future claim for reimbursement.",
        keyElements: [
          "Specificity is Key: 'My child's IEP dated [Date] mandates 3 sessions per week of speech therapy. To date, they have missed [Number] sessions.'",
          "The Warning: 'This letter serves as notice that if the district does not immediately begin providing all mandated services, I will secure a private therapist and seek full reimbursement.'"
        ],
        proTip: "Start a log immediately. For every missed session, record the date and the reason given (if any). This log will become a crucial piece of evidence if you have to file for a hearing."
      },
      {
        id: 'request-compensatory-services',
        title: 'Request for Compensatory Services',
        whatItIs: "A request for services to remedy a past failure by the district to provide a Free Appropriate Public Education (FAPE).",
        whyYouUseIt: "If your child has already missed services, simply starting them now doesn't fix the educational harm that has already occurred. Compensatory education is the make-up remedy.",
        keyElements: [
          "Identify the FAPE Denial: 'From September 2024 to January 2025, the district failed to provide the mandated 2 hours per week of reading instruction.'",
          "Describe the Harm: 'As a result, my child has fallen further behind their peers.'",
          "Propose a Remedy: 'I am requesting [Number] hours of compensatory instruction.'"
        ],
        proTip: "The remedy doesn't have to be hour-for-hour. You can argue for a 'qualitative' remedy—that because of regression, your child now needs more intensive instruction to catch up."
      }
    ]
  },
  {
    id: 'module-5',
    title: "Module 5: Resolving Disputes - Formal Options",
    description: "When collaboration breaks down, IDEA provides formal, legally-binding dispute resolution options.",
    letterStops: [
      {
        id: 'request-mediation',
        title: 'Request for Mediation',
        whatItIs: "A formal request to engage in a voluntary dispute resolution process with the school district, facilitated by a neutral, third-party mediator.",
        whyYouUseIt: "Mediation is free, confidential, and less adversarial than a hearing. An agreement is legally binding. Filing for mediation also triggers 'stay-put' rights.",
        keyElements: [
          "Directed to the Right Place: These requests are often sent to a regional dispute resolution center, with a copy to the school district.",
          "State the Issues: Clearly list the disagreements you wish to resolve."
        ],
        proTip: "The key difference from a resolution session is the neutral mediator, whose job is to help both sides find common ground. It is a valuable step before a full hearing."
      },
      {
        id: 'request-due-process',
        title: 'Request for a Due Process Hearing',
        whatItIs: "The formal, written complaint that initiates a legal proceeding similar to a trial where an Impartial Hearing Officer (IHO) presides as a judge.",
        whyYouUseIt: "This is the ultimate tool to enforce your child's rights. The IHO's decision is legally binding. There is generally a two-year statute of limitations.",
        keyElements: [
          "Your child's name, address, and school.",
          "A description of the problem, including specific facts.",
          "A proposed resolution to the problem—what you want the IHO to order."
        ],
        proTip: "Be as specific as possible. The hearing will generally be limited to the issues you raise in your written complaint. You can use your state's official form or write your own."
      },
      {
        id: 'invoke-stay-put',
        title: 'Pendency/Stay-Put Invocation Letter',
        whatItIs: "A letter asserting your child's legal right to remain in their 'then-current educational placement' while a due process proceeding is ongoing.",
        whyYouUseIt: "The moment you file for mediation or due process, stay-put is triggered. It's a safety net preventing unilateral changes. This letter notifies the district you are aware of this right.",
        keyElements: [
          "Reference Your Filing: 'This letter is to confirm that on [Date], I filed a request for a [due process hearing/mediation], invoking my child's right to pendency.'",
          "Define the Placement: Clearly state what you believe constitutes the 'then-current' placement (the last agreed-upon IEP)."
        ],
        proTip: "In some areas, like NYC, it is often necessary to ask the Hearing Officer for a specific 'Pendency Order' to force the school district to comply with its stay-put obligations."
      }
    ]
  },
  {
    id: 'module-6',
    title: "Module 6: Powerful Remedies and Protections",
    description: "In certain situations, the law provides for more significant remedies, particularly when a district's failures are so severe that the public school cannot provide an appropriate education.",
    letterStops: [
      {
        id: 'notice-unilateral-placement',
        title: 'Notice of Unilateral Placement',
        whatItIs: "A formal notice that you are rejecting the district's IEP, enrolling your child in a private school at your own expense, and will seek tuition reimbursement.",
        whyYouUseIt: "To win a reimbursement case, you must prove the district failed to offer FAPE and your placement is appropriate. This notice is a critical equitable factor in your favor.",
        keyElements: [
          "Timing is Everything: You MUST provide this notice at least 10 business days before you remove your child from the public school.",
          "Content: The notice must clearly state your rejection of the district's program and your intent to seek private placement and reimbursement."
        ],
        proTip: "Failure to provide this timely notice can be grounds for a judge to reduce or deny reimbursement. Always provide it in writing and keep proof of delivery."
      },
      {
        id: 'request-nickerson-letter',
        title: 'Request for Nickerson Letter (P-1 Letter) (NYC Specific)',
        whatItIs: "A request for an authorization letter from the NYC DOE that funds a child's attendance at a state-approved non-public special education school for one year.",
        whyYouUseIt: "A unique NYC remedy. If the DOE fails to provide a placement offer within the legal timelines (typically 60 school days after consent), you may be entitled to this letter.",
        keyElements: [
          "Timeline Focused: This claim is based on a missed deadline. You must clearly document the date you provided consent and the date the timeline expired without a placement offer."
        ],
        proTip: "This is a non-adversarial remedy when the conditions are met. However, you must find an approved school that is appropriate and has an available seat for that school year."
      },
      {
        id: 'request-mdr',
        title: 'Request for Manifestation Determination Review (MDR)',
        whatItIs: "A request for a meeting to determine if a child's misconduct was a 'manifestation' of their disability, or the result of the school's failure to implement the IEP.",
        whyYouUseIt: "If a school wants to suspend a student with an IEP for more than 10 total days in a school year, it MUST hold an MDR. This letter ensures the meeting happens.",
        keyElements: [
          "Invoke the Right: 'I am writing to request a Manifestation Determination Review for my child...'",
          "The Two Questions: The meeting must answer: 1) Was the behavior caused by the disability? 2) Was the behavior a result of the school's failure to implement the IEP?"
        ],
        proTip: "If the answer is 'yes' to either question, the behavior is a manifestation. The school generally cannot proceed with the long-term removal and must instead conduct an FBA and implement a BIP."
      }
    ]
  },
  {
    id: 'module-7',
    title: "Module 7: Records and Final Decisions",
    description: "The final module covers your rights regarding your child's educational records and the ultimate decision to exit the special education system entirely.",
    letterStops: [
      {
        id: 'records-request',
        title: 'FERPA Records Request or Amendment Request',
        whatItIs: "A request under FERPA to: 1) inspect and obtain copies of all your child's educational records, or 2) amend information in those records that you believe is inaccurate or misleading.",
        whyYouUseIt: "Accessing records is your primary method of discovery. A request to amend allows you to correct the official record. The school must provide access within 45 days.",
        keyElements: [
          "Request for Access: Be broad. 'Pursuant to FERPA, I am requesting to inspect and receive copies of any and all educational records...'",
          "Request for Amendment: Be specific. 'I am requesting an amendment to the psychological report dated [Date]. Page 3 incorrectly states...'"
        ],
        proTip: "'Educational records' is an extremely broad category. It includes emails between staff, teacher notes, attendance data, and discipline files. Don't be afraid to ask for everything."
      },
      {
        id: 'revoke-consent',
        title: 'Revocation of Consent for Services',
        whatItIs: "A formal, written letter informing the district that you are withdrawing your child from all special education and related services.",
        whyYouUseIt: "This is a profound and generally irreversible step. Once you revoke consent, the district must cease all services and may not use due process to override your decision.",
        keyElements: [
          "Must Be In Writing: A verbal revocation is not sufficient.",
          "Acknowledge Consequences: The letter must state you understand your child will be treated as a general education student and lose all IDEA rights and protections."
        ],
        proTip: "Revoking consent means your child loses all protections under IDEA. To have services reinstated, you must start the entire process over with a new initial referral. Use with extreme caution."
      }
    ]
  }
];
