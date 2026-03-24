'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  ArrowRight, ArrowLeft, CheckCircle2, Scale, Users, Briefcase,
  ChevronRight, Phone, Mail, FileText, Check,
} from 'lucide-react';

/* ── Types ──────────────────────────────────────────────────────────────── */

type CaseType = 'family' | 'criminal' | 'civil';
type SubType =
  | 'care-proceedings' | 'child-arrangements'
  | 'fitness-to-plead' | 'trial' | 'sentencing'
  | 'personal-injury' | 'employment' | 'capacity';

interface ContactInfo {
  salutation: string;
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  region: string;
  privacyAccepted: boolean;
}

interface State {
  step: number;
  caseType: CaseType | null;
  subType: SubType | null;
  factors: string[];
  contact: ContactInfo;
  pending: string | null;
  submitting: boolean;
  error: string | null;
}

/* ── Static data ────────────────────────────────────────────────────────── */

const CASE_TYPES: { id: CaseType; label: string; icon: React.ElementType; description: string }[] = [
  { id: 'family',   label: 'Family Court',     icon: Users,    description: 'Child arrangements, care proceedings, adoption' },
  { id: 'criminal', label: 'Criminal Court',   icon: Scale,    description: 'Trials, sentencing, fitness to plead' },
  { id: 'civil',    label: 'Civil Litigation', icon: Briefcase, description: 'Personal injury, employment, capacity assessments' },
];

const SUB_TYPES: Record<CaseType, { id: SubType; label: string; description: string }[]> = {
  family: [
    { id: 'care-proceedings',   label: 'Care Proceedings',   description: 'Local authority involved, risk of removal, threshold criteria' },
    { id: 'child-arrangements', label: 'Child Arrangements', description: 'Residence, contact, parental alienation, domestic abuse' },
  ],
  criminal: [
    { id: 'fitness-to-plead', label: 'Fitness to Plead', description: "Defendant's ability to understand proceedings and instruct solicitors" },
    { id: 'trial',            label: 'Trial',             description: 'Diminished responsibility, mental state at time of offence, insanity' },
    { id: 'sentencing',       label: 'Sentencing',        description: 'Mental disorder, rehabilitation, risk of reoffending' },
  ],
  civil: [
    { id: 'personal-injury', label: 'Personal Injury',     description: 'PTSD, psychological trauma, adjustment disorder, cognitive impact' },
    { id: 'employment',      label: 'Employment Law',      description: 'Disability discrimination, work-related stress, reasonable adjustments' },
    { id: 'capacity',        label: 'Capacity Assessment', description: 'Financial, testamentary, medical decision-making capacity' },
  ],
};

const FACTORS: Record<SubType, { id: string; label: string }[]> = {
  'care-proceedings': [
    { id: 'parental-mh',        label: 'Parental mental health concerns' },
    { id: 'substance',          label: 'Substance misuse' },
    { id: 'parenting-capacity', label: 'Questions about parenting capacity' },
    { id: 'emotional-abuse',    label: 'Allegations of emotional or psychological abuse' },
    { id: 'child-wellbeing',    label: "Child's psychological or emotional wellbeing" },
  ],
  'child-arrangements': [
    { id: 'high-conflict',   label: 'High-conflict dispute between parents' },
    { id: 'alienation',      label: 'Allegations of parental alienation' },
    { id: 'parent-mh',       label: 'Mental health history in either parent' },
    { id: 'domestic-abuse',  label: 'Domestic abuse or coercive control' },
    { id: 'child-welfare',   label: "Concerns about the child's emotional welfare" },
  ],
  'fitness-to-plead': [
    { id: 'understand-charges',     label: 'Difficulty understanding the charges' },
    { id: 'understand-proceedings', label: 'Unable to follow court proceedings' },
    { id: 'instruct-solicitor',     label: 'Cannot instruct legal representation' },
    { id: 'give-evidence',          label: 'Unable to give evidence in own defence' },
  ],
  'trial': [
    { id: 'diminished',    label: 'Diminished responsibility (Homicide Act 1957 s.2)' },
    { id: 'mental-state',  label: 'Mental state at time of offence' },
    { id: 'automatism',    label: 'Automatism or unconscious actions' },
    { id: 'insanity',      label: 'Insanity defence' },
  ],
  'sentencing': [
    { id: 'mental-disorder',    label: 'Defendant has a mental disorder' },
    { id: 'rehabilitation',     label: 'Rehabilitation prospects' },
    { id: 'reoffending-risk',   label: 'Risk of reoffending assessment' },
    { id: 'treatment',          label: 'Mental health treatment requirements' },
  ],
  'personal-injury': [
    { id: 'ptsd',            label: 'Post-Traumatic Stress Disorder (PTSD)' },
    { id: 'depression',      label: 'Depression or anxiety' },
    { id: 'adjustment',      label: 'Adjustment disorder' },
    { id: 'cognitive',       label: 'Cognitive difficulties or memory issues' },
  ],
  'employment': [
    { id: 'disability',             label: 'Disability discrimination (mental health)' },
    { id: 'work-stress',            label: 'Work-related stress claim' },
    { id: 'harassment',             label: 'Harassment causing psychological injury' },
    { id: 'reasonable-adjustments', label: 'Reasonable adjustments for mental health' },
  ],
  'capacity': [
    { id: 'care-treatment',  label: 'Care or treatment decisions' },
    { id: 'financial',       label: 'Managing property or financial affairs' },
    { id: 'testamentary',    label: 'Making or changing a will (testamentary capacity)' },
    { id: 'proceedings',     label: 'Capacity to give evidence or participate in proceedings' },
  ],
};

interface ResultContent {
  urgency: 'essential' | 'recommended' | 'worth-considering';
  recommendation: string;
  legalBasis: string;
  citation: string;
  assessmentTypes: string[];
  expertType: string;
}

const RESULTS: Record<SubType, ResultContent> = {
  'care-proceedings': {
    urgency: 'essential',
    recommendation: "Expert psychological evidence is almost always required in care proceedings. The court must assess whether the threshold criteria under the Children Act 1989 are met and what arrangements are in the child's best interests. Expert opinion on parenting capacity, attachment, and risk is central to the court's decision-making.",
    legalBasis: "Under s.38(6) of the Children Act 1989, the court may direct a medical or psychiatric examination. Part 25 of the Family Procedure Rules 2010 governs expert evidence, permitting it where it is 'necessary to assist the court to resolve the proceedings justly'.",
    citation: 'Children Act 1989 s.38(6); FPR 2010 Part 25',
    assessmentTypes: ['Parenting capacity assessment', 'Attachment and bonding assessment', 'Cognitive functioning (where relevant)', 'Risk and protective factors', 'Mental health assessment', 'Drug or alcohol assessment'],
    expertType: 'Clinical Psychologist',
  },
  'child-arrangements': {
    urgency: 'recommended',
    recommendation: "In contested child arrangements cases — particularly those involving parental alienation, domestic abuse, or parental mental health — expert psychological evidence can materially assist the court in understanding the child's needs and the parenting dynamics.",
    legalBasis: "Part 25 of the Family Procedure Rules 2010 permits expert evidence where 'necessary to assist the court to resolve the proceedings justly'. Practice Direction 12J governs cases involving allegations of domestic abuse and coercive control.",
    citation: 'FPR 2010 Part 25; PD12J',
    assessmentTypes: ['Parental alienation assessment', 'Attachment and child welfare assessment', "Child's wishes and feelings", 'Domestic abuse psychological impact', 'Parenting capacity'],
    expertType: 'Clinical Psychologist or Psychiatrist',
  },
  'fitness-to-plead': {
    urgency: 'essential',
    recommendation: "Fitness to plead assessments are legally required before a criminal trial can proceed where the defendant's capacity is in question. The court cannot resolve this issue without expert psychiatric or psychological evidence — it is not a matter on which lay witnesses or legal argument suffices.",
    legalBasis: "The Pritchard criteria (R v Pritchard [1836]) establish the test for fitness to plead: can the defendant understand the charges, follow proceedings, instruct solicitors, and give evidence? The Criminal Procedure (Insanity) Act 1964 (as amended) governs the process.",
    citation: 'R v Pritchard (1836); Criminal Procedure (Insanity) Act 1964',
    assessmentTypes: ['Fitness to plead assessment', 'Cognitive functioning', 'Mental state examination', 'Psychiatric diagnosis', 'Intellectual disability assessment'],
    expertType: 'Forensic Psychiatrist or Forensic Psychologist',
  },
  'trial': {
    urgency: 'essential',
    recommendation: "Where diminished responsibility, automatism, or insanity are raised as defences, expert psychiatric evidence is essential. Courts cannot assess these mental-state defences without specialist clinical opinion — the defence will fail without it.",
    legalBasis: "Section 2 of the Homicide Act 1957 (as amended by the Coroners and Justice Act 2009) requires an 'abnormality of mental functioning arising from a recognised medical condition' which substantially impaired the defendant's ability to understand their conduct, form rational judgment, or exercise self-control.",
    citation: 'Homicide Act 1957 s.2; Coroners and Justice Act 2009',
    assessmentTypes: ['Mental state at time of offence', 'Psychiatric diagnosis', 'Diminished responsibility opinion', 'Risk assessment', 'Cognitive assessment'],
    expertType: 'Forensic Psychiatrist',
  },
  'sentencing': {
    urgency: 'essential',
    recommendation: "The Sentencing Council requires courts to obtain medical reports before imposing custodial sentences on offenders with mental disorders. Expert evidence on rehabilitation prospects, risk of reoffending, and treatment needs is central to appropriate disposal — including hospital orders and community treatment requirements.",
    legalBasis: "Sentencing Council Definitive Guideline and s.157 of the Criminal Justice Act 2003 require the court to consider medical reports. The Mental Health Act 1983 provides the framework for hospital orders (s.37) and restriction orders (s.41).",
    citation: 'CJA 2003 s.157; Mental Health Act 1983 ss.37, 41',
    assessmentTypes: ['Psychiatric diagnosis', 'Risk of reoffending', 'Rehabilitation prospects', 'Treatment suitability', 'Dangerousness assessment'],
    expertType: 'Forensic Psychiatrist or Forensic Psychologist',
  },
  'personal-injury': {
    urgency: 'recommended',
    recommendation: "Claims for psychological injury in personal injury litigation require expert evidence to establish diagnosis, causation, prognosis, and functional impact. Without a formal expert psychological report, the court cannot properly quantify damages for psychiatric injury.",
    legalBasis: "Expert psychological and psychiatric evidence is required under CPR Part 35 to establish the nature and extent of psychiatric injury, including causation and prognosis. The Judicial College Guidelines provide the framework for quantifying psychological injury damages.",
    citation: 'CPR Part 35; Judicial College Guidelines',
    assessmentTypes: ['PTSD assessment', 'Depression and anxiety assessment', 'Prognosis and treatment needs', 'Causation opinion', 'Functional impact', 'Cognitive neuropsychological assessment'],
    expertType: 'Clinical Psychologist or Psychiatrist',
  },
  'employment': {
    urgency: 'recommended',
    recommendation: "In claims involving mental health disability discrimination or work-related psychological injury, expert evidence is often essential to establish that the condition meets the Equality Act 2010 definition of disability, and to evidence the psychological impact of the employer's conduct.",
    legalBasis: "Under the Equality Act 2010, a disability must have a 'substantial and long-term adverse effect on the ability to carry out normal day-to-day activities' (s.6, Schedule 1). Expert evidence establishes this threshold, documents causation, and assesses the impact of the alleged treatment.",
    citation: 'Equality Act 2010 s.6, Schedule 1',
    assessmentTypes: ['Disability status opinion', 'Psychological impact assessment', 'Causation of psychological harm', 'Work capacity assessment', 'Prognosis and treatment needs'],
    expertType: 'Clinical Psychologist or Occupational Psychiatrist',
  },
  'capacity': {
    urgency: 'essential',
    recommendation: "Capacity assessments by medical or psychological experts are required when the Mental Capacity Act 2005 is engaged. The assessment must be decision-specific and time-specific. A formal expert report rebutting the presumption of capacity is essential — informal opinion will not suffice before a court.",
    legalBasis: "The Mental Capacity Act 2005 presumes capacity unless established otherwise. A person lacks capacity if they cannot understand, retain, use or weigh information relevant to a decision, or communicate their decision (ss.2–3). Expert assessment is required to rebut the presumption.",
    citation: 'Mental Capacity Act 2005 ss.2–3; Banks v Goodfellow (1870)',
    assessmentTypes: ['Decision-specific capacity assessment', 'Cognitive and memory testing', 'Testamentary capacity (if applicable)', 'Litigation capacity', 'Neuropsychological assessment'],
    expertType: 'Psychiatrist or Clinical Neuropsychologist',
  },
};

const URGENCY_STYLES = {
  essential:           { bg: '#fee2e2', text: '#991b1b', label: 'Expert Evidence Required' },
  recommended:         { bg: '#fef9c3', text: '#854d0e', label: 'Expert Evidence Recommended' },
  'worth-considering': { bg: '#f0fdf4', text: '#166534', label: 'Worth Considering' },
};

const SALUTATIONS = ['Mr.', 'Mrs.', 'Ms.', 'Miss', 'Dr.', 'Prof.'];
const REGIONS = [
  'London', 'South East', 'South West', 'East of England', 'East Midlands',
  'West Midlands', 'Yorkshire & Humber', 'North East', 'North West',
  'Scotland', 'Wales', 'Northern Ireland',
];

const EMPTY_CONTACT: ContactInfo = {
  salutation: '', firstName: '', lastName: '', company: '',
  email: '', phone: '', region: '', privacyAccepted: false,
};

const STEP_LABELS = ['Case Type', 'Proceeding', 'Factors', 'Your Details'];

/* ── Component ──────────────────────────────────────────────────────────── */

export function LegalAssessmentTool() {
  const [state, setState] = useState<State>({
    step: 0,
    caseType: null,
    subType: null,
    factors: [],
    contact: EMPTY_CONTACT,
    pending: null,
    submitting: false,
    error: null,
  });

  const set = (patch: Partial<State>) => setState(s => ({ ...s, ...patch }));

  function selectCaseType(caseType: CaseType) {
    set({ pending: caseType });
    setTimeout(() => set({ caseType, subType: null, factors: [], step: 1, pending: null }), 200);
  }

  function selectSubType(subType: SubType) {
    set({ pending: subType });
    setTimeout(() => set({ subType, factors: [], step: 2, pending: null }), 200);
  }

  function toggleFactor(id: string) {
    setState(s => ({
      ...s,
      factors: s.factors.includes(id)
        ? s.factors.filter(f => f !== id)
        : [...s.factors, id],
    }));
  }

  function updateContact(field: keyof ContactInfo, value: string | boolean) {
    setState(s => ({ ...s, contact: { ...s.contact, [field]: value } }));
  }

  async function handleSubmit() {
    set({ submitting: true, error: null });

    const { contact, caseType, subType, factors } = state;
    const caseLabel = CASE_TYPES.find(c => c.id === caseType)?.label ?? '';
    const subLabel = subType ? (SUB_TYPES[caseType!].find(s => s.id === subType)?.label ?? '') : '';
    const factorLabels = factors
      .map(f => FACTORS[subType!]?.find(q => q.id === f)?.label)
      .filter(Boolean)
      .join(', ');

    const message = [
      `Case Assessment via website tool`,
      `Case type: ${caseLabel}`,
      `Proceeding: ${subLabel}`,
      `Region: ${contact.region}`,
      factorLabels ? `Factors: ${factorLabels}` : null,
    ].filter(Boolean).join('\n');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sector: 'expert-witness',
          salutation: contact.salutation,
          firstName: contact.firstName,
          lastName: contact.lastName,
          company: contact.company,
          email: contact.email,
          phone: contact.phone,
          leadSource: 'web-form',
          message,
          privacyAccepted: true,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? 'Submission failed');
      }

      set({ submitting: false, step: 4 });
    } catch (err) {
      set({ submitting: false, error: err instanceof Error ? err.message : 'Something went wrong. Please try again.' });
    }
  }

  const { step, caseType, subType, factors, contact, pending, submitting, error } = state;
  const result = subType ? RESULTS[subType] : null;

  const contactValid =
    contact.salutation &&
    contact.firstName.trim() &&
    contact.lastName.trim() &&
    contact.company.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email) &&
    contact.phone.trim() &&
    contact.region &&
    contact.privacyAccepted;

  return (
    <div className="max-w-3xl mx-auto">

      {/* ── Step progress circles ─────────────────────────────── */}
      {step < 4 && (
        <div className="flex items-center mb-10">
          {STEP_LABELS.map((label, i) => (
            <div key={i} className={cn('flex items-center', i < STEP_LABELS.length - 1 ? 'flex-1' : 'flex-shrink-0')}>
              <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                <div className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300',
                  i < step ? 'bg-[var(--brand-navy)] border-[var(--brand-navy)] text-white' :
                  i === step ? 'border-[var(--brand-navy)] text-[var(--brand-navy)]' :
                  'border-border text-muted-foreground'
                )}>
                  {i < step ? <Check className="w-3 h-3" /> : i + 1}
                </div>
                <span className={cn(
                  'hidden sm:block text-[10px] font-medium whitespace-nowrap',
                  i === step ? 'text-[var(--brand-navy)]' : 'text-muted-foreground'
                )}>{label}</span>
              </div>
              {i < STEP_LABELS.length - 1 && (
                <div className={cn(
                  'flex-1 h-px mx-2 mb-4 transition-colors duration-500',
                  i < step ? 'bg-[var(--brand-navy)]' : 'bg-border'
                )} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Step 0: Case type ─────────────────────────────────── */}
      {step === 0 && (
        <div className="tool-step-in">
          <h2 className="font-sans text-2xl sm:text-3xl font-bold mb-2" style={{ color: 'var(--brand-navy)' }}>
            What type of proceedings?
          </h2>
          <p className="text-muted-foreground mb-8">
            Select the area of law your case falls under to begin your assessment.
          </p>
          <div className="grid gap-4">
            {CASE_TYPES.map(({ id, label, icon: Icon, description }) => (
              <button
                key={id}
                onClick={() => selectCaseType(id)}
                disabled={!!pending}
                className={cn(
                  'group w-full text-left rounded-xl border-2 p-5 transition-all',
                  pending === id
                    ? 'border-[var(--brand-azure-vivid)] bg-[var(--brand-azure-light)] shadow-md'
                    : 'border-border bg-card hover:border-[var(--brand-azure-vivid)] hover:shadow-md'
                )}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0 mt-0.5"
                    style={{ background: 'var(--brand-azure-light)', color: 'var(--brand-azure-dark)' }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-foreground text-base sm:text-lg mb-1">{label}</div>
                    <div className="text-muted-foreground text-sm">{description}</div>
                  </div>
                  <ChevronRight className={cn(
                    'w-5 h-5 mt-1 flex-shrink-0 transition-transform',
                    pending === id ? 'translate-x-1 text-[var(--brand-azure-vivid)]' : 'text-muted-foreground group-hover:translate-x-1'
                  )} />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Step 1: Sub-type ──────────────────────────────────── */}
      {step === 1 && caseType && (
        <div className="tool-step-in">
          <BackButton onClick={() => set({ step: 0 })} />
          <h2 className="font-sans text-2xl sm:text-3xl font-bold mb-2" style={{ color: 'var(--brand-navy)' }}>
            What type of {CASE_TYPES.find(c => c.id === caseType)!.label.toLowerCase()} case?
          </h2>
          <p className="text-muted-foreground mb-8">Select the specific type of proceedings.</p>
          <div className="grid gap-4">
            {SUB_TYPES[caseType].map(({ id, label, description }) => (
              <button
                key={id}
                onClick={() => selectSubType(id)}
                disabled={!!pending}
                className={cn(
                  'group w-full text-left rounded-xl border-2 p-5 transition-all',
                  pending === id
                    ? 'border-[var(--brand-azure-vivid)] bg-[var(--brand-azure-light)] shadow-md'
                    : 'border-border bg-card hover:border-[var(--brand-azure-vivid)] hover:shadow-md'
                )}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-foreground text-base sm:text-lg mb-1">{label}</div>
                    <div className="text-muted-foreground text-sm">{description}</div>
                  </div>
                  <ChevronRight className={cn(
                    'w-5 h-5 mt-1 flex-shrink-0 transition-transform',
                    pending === id ? 'translate-x-1 text-[var(--brand-azure-vivid)]' : 'text-muted-foreground group-hover:translate-x-1'
                  )} />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Step 2: Factors ───────────────────────────────────── */}
      {step === 2 && subType && (
        <div className="tool-step-in">
          <BackButton onClick={() => set({ step: 1 })} />
          <h2 className="font-sans text-2xl sm:text-3xl font-bold mb-2" style={{ color: 'var(--brand-navy)' }}>
            Which factors apply?
          </h2>
          <p className="text-muted-foreground mb-8">
            Select all that are relevant to your case. You can select multiple or continue without selecting any.
          </p>
          <div className="space-y-3 mb-8">
            {FACTORS[subType].map(({ id, label }) => {
              const checked = factors.includes(id);
              return (
                <button
                  key={id}
                  onClick={() => toggleFactor(id)}
                  className={cn(
                    'w-full text-left rounded-xl border-2 px-5 py-4 transition-all text-sm font-medium',
                    checked
                      ? 'bg-[var(--brand-azure-light)] border-[var(--brand-azure-vivid)]'
                      : 'bg-card border-border hover:border-[var(--brand-azure)]'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all',
                        checked
                          ? 'border-[var(--brand-azure-vivid)] bg-[var(--brand-azure-vivid)]'
                          : 'border-muted-foreground'
                      )}
                    >
                      {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                    </div>
                    <span className="text-foreground">{label}</span>
                  </div>
                </button>
              );
            })}
          </div>
          <Button
            onClick={() => set({ step: 3 })}
            className="w-full font-semibold h-11"
            style={{ background: 'var(--brand-navy)', color: 'white' }}
          >
            Continue <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}

      {/* ── Step 3: Contact form ──────────────────────────────── */}
      {step === 3 && (
        <div className="tool-step-in">
          <BackButton onClick={() => set({ step: 2 })} />
          <h2 className="font-sans text-2xl sm:text-3xl font-bold mb-2" style={{ color: 'var(--brand-navy)' }}>
            Almost there
          </h2>
          <p className="text-muted-foreground mb-8">
            Enter your details to receive your personalised assessment and to have a Client Manager follow up with matched expert CVs and a quote.
          </p>

          <div className="space-y-5">
            {/* Name row */}
            <div className="grid grid-cols-[auto_1fr_1fr] gap-3 items-end">
              <div className="space-y-1.5">
                <label className="text-sm font-medium leading-none" htmlFor="salutation">Title <Required /></label>
                <select
                  id="salutation"
                  value={contact.salutation}
                  onChange={e => updateContact('salutation', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">—</option>
                  {SALUTATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium leading-none" htmlFor="firstName">First name <Required /></label>
                <Input
                  id="firstName"
                  value={contact.firstName}
                  onChange={e => updateContact('firstName', e.target.value)}
                  placeholder="Jane"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium leading-none" htmlFor="lastName">Last name <Required /></label>
                <Input
                  id="lastName"
                  value={contact.lastName}
                  onChange={e => updateContact('lastName', e.target.value)}
                  placeholder="Smith"
                />
              </div>
            </div>

            {/* Firm & phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium leading-none" htmlFor="company">Law firm / organisation <Required /></label>
                <Input
                  id="company"
                  value={contact.company}
                  onChange={e => updateContact('company', e.target.value)}
                  placeholder="Smith & Co Solicitors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium leading-none" htmlFor="phone">Phone number <Required /></label>
                <Input
                  id="phone"
                  type="tel"
                  value={contact.phone}
                  onChange={e => updateContact('phone', e.target.value)}
                  placeholder="01234 567890"
                />
              </div>
            </div>

            {/* Email & region */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium leading-none" htmlFor="email">Email address <Required /></label>
                <Input
                  id="email"
                  type="email"
                  value={contact.email}
                  onChange={e => updateContact('email', e.target.value)}
                  placeholder="jane@smithco.co.uk"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium leading-none" htmlFor="region">Region <Required /></label>
                <select
                  id="region"
                  value={contact.region}
                  onChange={e => updateContact('region', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Select region…</option>
                  {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>

            {/* Privacy */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <div
                onClick={() => updateContact('privacyAccepted', !contact.privacyAccepted)}
                className={cn(
                  'mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all',
                  contact.privacyAccepted
                    ? 'border-[var(--brand-azure-vivid)] bg-[var(--brand-azure-vivid)]'
                    : 'border-muted-foreground'
                )}
              >
                {contact.privacyAccepted && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
              </div>
              <span className="text-sm text-muted-foreground">
                I agree to Psychology Direct contacting me about this enquiry. I have read the{' '}
                <Link href="/privacy/" className="underline hover:text-foreground" target="_blank">
                  privacy policy
                </Link>
                . <Required />
              </span>
            </label>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-3">{error}</p>
            )}

            <Button
              onClick={handleSubmit}
              disabled={!contactValid || submitting}
              className="w-full font-semibold h-12 text-base"
              style={{ background: 'var(--brand-navy)', color: 'white' }}
            >
              {submitting ? 'Processing…' : 'View My Assessment'}
              {!submitting && <ArrowRight className="w-4 h-4 ml-1" />}
            </Button>
          </div>
        </div>
      )}

      {/* ── Step 4: Results ───────────────────────────────────── */}
      {step === 4 && result && (
        <div className="space-y-6">
          {/* Urgency + headline */}
          <div className="tool-result-in">
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-4"
              style={{ background: URGENCY_STYLES[result.urgency].bg, color: URGENCY_STYLES[result.urgency].text }}
            >
              {URGENCY_STYLES[result.urgency].label}
            </span>
            <h2 className="font-sans text-2xl sm:text-3xl font-bold mb-3" style={{ color: 'var(--brand-navy)' }}>
              Your Assessment
            </h2>
            <p className="text-muted-foreground leading-relaxed">{result.recommendation}</p>
          </div>

          {/* Legal basis */}
          <Card className="tool-result-in border border-border">
            <div className="p-5">
              <h3 className="font-sans font-bold text-sm mb-2" style={{ color: 'var(--brand-navy)' }}>
                Legal Basis
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">{result.legalBasis}</p>
              <div
                className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1.5 rounded"
                style={{ background: 'var(--brand-bg-tint)', color: 'var(--brand-navy)' }}
              >
                <FileText className="w-3 h-3 flex-shrink-0" />
                {result.citation}
              </div>
            </div>
          </Card>

          {/* Assessment types */}
          <Card className="tool-result-in border border-border">
            <div className="p-5">
              <h3 className="font-sans font-bold text-sm mb-3" style={{ color: 'var(--brand-navy)' }}>
                Likely Assessment Types
              </h3>
              <ul className="space-y-2">
                {result.assessmentTypes.map((type) => (
                  <li key={type} className="flex items-start gap-2 text-sm">
                    <CheckCircle2
                      className="w-4 h-4 mt-0.5 flex-shrink-0"
                      style={{ color: 'var(--brand-azure-vivid)' }}
                    />
                    <span className="text-muted-foreground">{type}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          {/* Recommended expert type */}
          <div className="tool-result-in rounded-xl p-5" style={{ background: 'var(--brand-bg-tint)' }}>
            <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--brand-azure-vivid)' }}>
              Recommended Expert Type
            </p>
            <p className="text-lg font-bold text-foreground mb-2">{result.expertType}</p>
            <p className="text-sm text-muted-foreground">
              We will match you with a HCPC-registered expert within 24 hours. CVs and a quote will be provided with no obligation to proceed.
            </p>
          </div>

          {/* CTA card */}
          <div className="tool-result-in rounded-xl p-6" style={{ background: 'var(--brand-navy)' }}>
            <h3 className="font-sans font-bold text-base text-white mb-1">
              We&apos;re ready to match your expert
            </h3>
            <p className="text-white/70 text-sm mb-5">
              Hi {contact.firstName}, your assessment has been received. A Client Manager will be in touch within 24 hours with matched expert CVs and a no-obligation quote.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <Button
                asChild
                className="font-semibold"
                style={{ background: 'var(--brand-azure)', color: 'var(--brand-navy)' }}
              >
                <Link href="/expert-witness-psychologists/process/">
                  Learn About Our Process <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:text-white">
                <a href="tel:01306879975">
                  <Phone className="w-4 h-4 mr-1" /> Call Us Now
                </a>
              </Button>
            </div>
            <p className="text-white/50 text-xs flex items-center gap-1.5">
              <Mail className="w-3 h-3" />
              Confirmation sent to {contact.email}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Small helpers ──────────────────────────────────────────────────────── */

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
    >
      <ArrowLeft className="w-4 h-4" /> Back
    </button>
  );
}

function Required() {
  return <span className="text-red-500">*</span>;
}
