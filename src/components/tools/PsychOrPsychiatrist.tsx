'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  ArrowRight, ArrowLeft, Check, CheckCircle2,
  ChevronRight, Phone, Mail, Stethoscope, Brain, GraduationCap, Scale,
} from 'lucide-react';

/* ── Types ──────────────────────────────────────────────────────────────── */

type Context = 'legal' | 'education';
type LegalAnswer = 'psychologist' | 'psychiatrist' | 'both' | 'either';
type EducationAnswer = 'educational' | 'clinical' | 'clinical-or-educational' | 'camhs';

interface Question<T extends string> {
  title: string;
  subtitle: string;
  insight: string;
  answers: { label: string; sublabel?: string; value: T }[];
}

interface ContactInfo {
  salutation: string;
  firstName: string;
  lastName: string;
  role: string;
  company: string;
  email: string;
  phone: string;
  region: string;
  privacyAccepted: boolean;
}

interface State {
  context: Context | null;
  legalAnswers: LegalAnswer[];
  educationAnswers: EducationAnswer[];
  showResult: boolean;
  wantsContact: boolean;
  contact: ContactInfo;
  submitting: boolean;
  submitted: boolean;
  error: string | null;
}

/* ── Legal questions ────────────────────────────────────────────────────── */

const LEGAL_Q1: Question<LegalAnswer> = {
  title: 'What does the case primarily require?',
  subtitle: 'Select the option that best describes the expert evidence needed.',
  insight: 'The core distinction: psychologists assess behaviour, cognition, and psychological impact. Psychiatrists are medically qualified and can provide clinical diagnoses and comments on medication.',
  answers: [
    { label: 'Behavioural, cognitive, or psychological assessment', sublabel: 'Parenting capacity, learning needs, psychological injury, risk assessment', value: 'psychologist' },
    { label: 'Psychiatric diagnosis or medical opinion', sublabel: 'Mental disorder diagnosis, medication review, clinical opinion', value: 'psychiatrist' },
    { label: 'Both psychological assessment and psychiatric diagnosis', sublabel: 'Complex cases involving multiple issues', value: 'both' },
    { label: "I'm not sure", sublabel: "We can help clarify after a brief discussion", value: 'either' },
  ],
};

const LEGAL_Q2: Question<LegalAnswer> = {
  title: 'What is the area of law?',
  subtitle: 'The legal setting usually indicates which discipline is most appropriate.',
  insight: 'Family law cases typically use Clinical Psychologists. Criminal cases (especially fitness to plead or sentencing) often require Forensic Psychiatrists. Asylum cases usually need Psychiatrists to assess trauma.',
  answers: [
    { label: 'Family law', sublabel: 'Care proceedings, child arrangements, parenting capacity', value: 'psychologist' },
    { label: 'Criminal law', sublabel: 'Fitness to plead, diminished responsibility, sentencing', value: 'psychiatrist' },
    { label: 'Civil / Personal Injury', sublabel: 'PTSD, psychological injury, cognitive impact', value: 'psychologist' },
    { label: 'Employment', sublabel: 'Disability discrimination, work-related stress, occupational health', value: 'either' },
    { label: 'Immigration or asylum', sublabel: 'Trauma, torture sequelae, medical assessment', value: 'psychiatrist' },
  ],
};

/* ── Education questions ────────────────────────────────────────────────── */

const EDUCATION_Q1: Question<EducationAnswer> = {
  title: 'What type of assessment or support is needed?',
  subtitle: "Select the option that best fits the child's or young person's needs.",
  insight: 'Educational Psychologists specialise in learning, development, and educational needs. Clinical Psychologists focus on mental health and behavioural difficulties. The right choice depends on what the assessment is for.',
  answers: [
    { label: 'Learning and cognitive assessment', sublabel: 'Dyslexia, dyscalculia, cognitive ability, processing', value: 'educational' },
    { label: 'EHCP statutory assessment', sublabel: 'Education, Health and Care Plan — school or local authority request', value: 'educational' },
    { label: 'Autism assessment', sublabel: 'ASD diagnosis, communication and social needs', value: 'clinical-or-educational' },
    { label: 'ADHD assessment', sublabel: 'Attention, hyperactivity, executive functioning', value: 'clinical-or-educational' },
    { label: 'Social, emotional and mental health (SEMH)', sublabel: 'Anxiety, attachment, trauma, behaviour in school', value: 'clinical-or-educational' },
    { label: 'Mental health support or therapy', sublabel: 'Anxiety, depression, trauma — clinical treatment focus', value: 'clinical' },
  ],
};

const EDUCATION_Q2: Question<EducationAnswer> = {
  title: 'Who is the assessment for?',
  subtitle: 'Age and setting can influence which professional is most appropriate.',
  insight: 'Educational Psychologists typically work with children in compulsory education. Clinical Psychologists can work across all ages. CAMHS (Child and Adolescent Mental Health Services) covers mental health in under-18s.',
  answers: [
    { label: 'A child in primary school (ages 4–11)', value: 'educational' },
    { label: 'A young person in secondary school (ages 11–16)', value: 'educational' },
    { label: 'A young person in sixth form or FE (ages 16–19)', value: 'clinical-or-educational' },
    { label: 'A pre-school child (under 5)', value: 'clinical-or-educational' },
    { label: 'An adult in higher education or employment', value: 'clinical' },
  ],
};

/* ── Result definitions ─────────────────────────────────────────────────── */

interface ResultInfo {
  title: string;
  who: string;
  explanation: string;
  keyUses: string[];
  icon: 'brain' | 'stethoscope' | 'graduation' | 'both';
}

const LEGAL_RESULTS: Record<LegalAnswer, ResultInfo> = {
  psychologist: {
    title: 'You Likely Need a Psychologist',
    who: 'Clinical or Forensic Psychologist',
    explanation: 'Based on your answers, a Clinical or Forensic Psychologist is most appropriate. Psychologists are doctoral-level specialists in behaviour, cognition, and psychological impact — they provide expert opinion without medical diagnosis.',
    keyUses: ['Parenting capacity assessment', 'Cognitive and intellectual functioning', 'PTSD and psychological injury', 'Risk and behaviour assessment', 'Attachment and child welfare'],
    icon: 'brain',
  },
  psychiatrist: {
    title: 'You Likely Need a Psychiatrist',
    who: 'Psychiatrist (Medical Doctor)',
    explanation: 'Your case appears to need psychiatric assessment or medical diagnosis. A Psychiatrist is a fully qualified medical doctor who specialises in mental health — they can diagnose conditions, comment on medication, and give clinical opinion to the court.',
    keyUses: ['Mental disorder diagnosis (ICD-11)', 'Fitness to plead and trial issues', 'Asylum and trauma assessment', 'Capacity under the Mental Capacity Act 2005', 'Medication and treatment review'],
    icon: 'stethoscope',
  },
  both: {
    title: 'You May Need Both',
    who: 'Psychologist and Psychiatrist',
    explanation: 'Your case involves both psychological and psychiatric factors. We frequently coordinate joint instructions — a Psychologist and Psychiatrist working alongside each other to provide comprehensive, complementary evidence.',
    keyUses: ['Complex care proceedings', 'Criminal cases with multiple issues', 'Neurodevelopmental and psychiatric co-morbidities', 'High-value civil claims', 'Cases requiring both diagnosis and psychological assessment'],
    icon: 'both',
  },
  either: {
    title: 'Either Could Help — Let Us Advise',
    who: 'Psychologist or Psychiatrist',
    explanation: 'The right expert depends on the specific issues at play. Our team reviews each case and recommends the most appropriate expert — there is no charge for this initial advice.',
    keyUses: ['Employment and disability claims', 'Work-related stress and psychological injury', 'Complex immigration cases', 'Cases where the right expert is unclear'],
    icon: 'brain',
  },
};

const EDUCATION_RESULTS: Record<EducationAnswer, ResultInfo> = {
  educational: {
    title: 'You Likely Need an Educational Psychologist',
    who: 'Educational Psychologist',
    explanation: 'Based on your answers, an Educational Psychologist (EP) is most appropriate. EPs specialise in learning, development, and educational provision — they conduct statutory EHCP assessments, learning assessments, and advise on educational support.',
    keyUses: ['EHCP statutory assessment', 'Cognitive and learning assessment', 'Dyslexia and specific learning difficulties', 'ADHD in educational settings', "Advice on school provision and support"],
    icon: 'graduation',
  },
  clinical: {
    title: 'You Likely Need a Clinical Psychologist',
    who: 'Clinical Psychologist',
    explanation: 'Based on your answers, a Clinical Psychologist is most appropriate. They specialise in assessing and supporting mental health difficulties — including anxiety, depression, trauma, and behavioural issues — across all ages.',
    keyUses: ['Anxiety and depression assessment', 'Trauma-informed assessment', 'Behavioural and emotional difficulties', 'Mental health support and therapy', 'Cognitive assessment in adults'],
    icon: 'brain',
  },
  'clinical-or-educational': {
    title: 'Educational or Clinical Psychologist',
    who: 'Educational Psychologist or Clinical Psychologist',
    explanation: "This type of assessment can be carried out by either an Educational or Clinical Psychologist depending on the specific focus. We can help you determine which is most appropriate based on the referral question.",
    keyUses: ['Autism (ASD) assessment', 'ADHD assessment', 'Social, emotional and mental health needs', 'Neurodevelopmental assessment', 'Transition planning (school to FE)'],
    icon: 'both',
  },
  camhs: {
    title: 'CAMHS or Clinical Psychologist',
    who: 'CAMHS / Clinical Psychologist',
    explanation: 'For clinical mental health support in under-18s, CAMHS (Child and Adolescent Mental Health Services) is the standard NHS route. For a private assessment or where waiting times are a concern, a Clinical Psychologist can help more quickly.',
    keyUses: ['Child and adolescent mental health assessment', 'Anxiety and depression in young people', 'Trauma-informed assessment', 'Private assessment where CAMHS waiting times are long'],
    icon: 'brain',
  },
};

/* ── Helpers ─────────────────────────────────────────────────────────────── */

const SALUTATIONS = ['Mr.', 'Mrs.', 'Ms.', 'Miss', 'Dr.', 'Prof.'];
const REGIONS = [
  'London', 'South East', 'South West', 'East of England', 'East Midlands',
  'West Midlands', 'Yorkshire & Humber', 'North East', 'North West',
  'Scotland', 'Wales', 'Northern Ireland',
];
const LEGAL_ROLES = ['Solicitor', 'Barrister', 'Legal Executive', 'Paralegal', 'Insurance Professional', 'Mediator', 'Other'];
const EDUCATION_ROLES = ['SENCO', 'Teacher', 'School Leader / Head', 'Local Authority', 'Parent / Carer', 'Social Worker', 'NHS Professional', 'Other'];

const EMPTY_CONTACT: ContactInfo = {
  salutation: '', firstName: '', lastName: '', role: '', company: '',
  email: '', phone: '', region: '', privacyAccepted: false,
};

const Q_STEP_LABELS = ['Question 1', 'Question 2'];

/* ── Component ──────────────────────────────────────────────────────────── */

export function PsychOrPsychiatrist() {
  const [state, setState] = useState<State>({
    context: null,
    legalAnswers: [],
    educationAnswers: [],
    showResult: false,
    wantsContact: false,
    contact: EMPTY_CONTACT,
    submitting: false,
    submitted: false,
    error: null,
  });

  const set = (patch: Partial<State>) => setState(s => ({ ...s, ...patch }));

  // ── Step logic ──────────────────────────────────────────────────────────
  // step 0 = context selection
  // Legal: step 1 = Q1, step 2 = Q2, step 3 = result
  // Education: step 1 = Q1, step 2 = Q2, step 3 = result
  const [step, setStep] = useState(0);
  const [pendingContext, setPendingContext] = useState<Context | null>(null);

  function selectContext(context: Context) {
    setPendingContext(context);
    setTimeout(() => {
      set({ context, legalAnswers: [], educationAnswers: [] });
      setStep(1);
      setPendingContext(null);
    }, 200);
  }

  function answerLegal(value: LegalAnswer, qIndex: number) {
    const next = [...state.legalAnswers];
    next[qIndex] = value;
    setState(s => ({ ...s, legalAnswers: next, showResult: false }));
    if (qIndex === 1) {
      setState(s => ({ ...s, legalAnswers: next, showResult: true }));
    }
    setStep(qIndex === 1 ? 3 : step + 1);
  }

  function answerEducation(value: EducationAnswer, qIndex: number) {
    const next = [...state.educationAnswers];
    next[qIndex] = value;
    setState(s => ({ ...s, educationAnswers: next, showResult: false }));
    if (qIndex === 1) {
      setState(s => ({ ...s, educationAnswers: next, showResult: true }));
    }
    setStep(qIndex === 1 ? 3 : step + 1);
  }

  function updateContact(field: keyof ContactInfo, value: string | boolean) {
    setState(s => ({ ...s, contact: { ...s.contact, [field]: value } }));
  }

  // ── Result derivation ───────────────────────────────────────────────────
  function getLegalResult(): LegalAnswer {
    const [a1, a2] = state.legalAnswers;
    if (!a1) return 'either';
    if (a1 === 'both') return 'both';
    if (a1 === 'either' || !a2) return a1 ?? 'either';
    if (a1 === a2) return a1;
    if (a2 !== 'either' && a1 !== a2) return 'both';
    return a1;
  }

  function getEducationResult(): EducationAnswer {
    const [a1, a2] = state.educationAnswers;
    if (!a1) return 'clinical-or-educational';
    if (!a2) return a1;
    if (a1 === 'clinical' || a2 === 'clinical') return 'clinical';
    if (a1 === 'educational' && a2 === 'educational') return 'educational';
    return 'clinical-or-educational';
  }

  const result = state.showResult
    ? state.context === 'legal'
      ? LEGAL_RESULTS[getLegalResult()]
      : EDUCATION_RESULTS[getEducationResult()]
    : null;

  // ── Contact form submission ─────────────────────────────────────────────
  async function handleSubmit() {
    set({ submitting: true, error: null });
    const { contact } = state;
    const resultTitle = result?.title ?? '';

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sector: state.context === 'education' ? 'education' : 'expert-witness',
          salutation: contact.salutation,
          firstName: contact.firstName,
          lastName: contact.lastName,
          company: contact.company,
          email: contact.email,
          phone: contact.phone,
          leadSource: 'web-form',
          message: `Psychologist or Psychiatrist tool\nContext: ${state.context}\nRecommendation: ${resultTitle}\nRole: ${contact.role}\nRegion: ${contact.region}`,
          privacyAccepted: true,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? 'Submission failed');
      }

      set({ submitting: false, submitted: true });
    } catch (err) {
      set({ submitting: false, error: err instanceof Error ? err.message : 'Something went wrong. Please try again.' });
    }
  }

  const { context, wantsContact, contact, submitting, submitted, error } = state;
  const roles = context === 'education' ? EDUCATION_ROLES : LEGAL_ROLES;

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

      {/* ── Question progress circles — only during Q1/Q2 ────── */}
      {step > 0 && step < 3 && (
        <div className="flex items-center mb-10">
          {Q_STEP_LABELS.map((label, i) => {
            const circleStep = i + 1;
            return (
              <div key={i} className={cn('flex items-center', i < Q_STEP_LABELS.length - 1 ? 'flex-1' : 'flex-shrink-0')}>
                <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                  <div className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300',
                    circleStep < step ? 'bg-[var(--brand-navy)] border-[var(--brand-navy)] text-white' :
                    circleStep === step ? 'border-[var(--brand-navy)] text-[var(--brand-navy)]' :
                    'border-border text-muted-foreground'
                  )}>
                    {circleStep < step ? <Check className="w-3 h-3" /> : circleStep}
                  </div>
                  <span className={cn(
                    'hidden sm:block text-[10px] font-medium whitespace-nowrap',
                    circleStep === step ? 'text-[var(--brand-navy)]' : 'text-muted-foreground'
                  )}>{label}</span>
                </div>
                {i < Q_STEP_LABELS.length - 1 && (
                  <div className={cn(
                    'flex-1 h-px mx-2 mb-4 transition-colors duration-500',
                    circleStep < step ? 'bg-[var(--brand-navy)]' : 'bg-border'
                  )} />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Step 0: Context ────────────────────────────────────── */}
      {step === 0 && (
        <div className="tool-step-in">
          <h2 className="font-sans text-2xl sm:text-3xl font-bold mb-2" style={{ color: 'var(--brand-navy)' }}>
            What best describes your situation?
          </h2>
          <p className="text-muted-foreground mb-8">
            This tool covers two different services. Select the one that applies to you.
          </p>
          <div className="grid gap-4">
            <button
              onClick={() => selectContext('legal')}
              disabled={!!pendingContext}
              className={cn(
                'group w-full text-left rounded-xl border-2 p-6 transition-all',
                pendingContext === 'legal'
                  ? 'border-[var(--brand-azure-vivid)] bg-[var(--brand-azure-light)] shadow-md'
                  : 'border-border bg-card hover:border-[var(--brand-azure-vivid)] hover:shadow-md'
              )}
            >
              <div className="flex items-start gap-4">
                <div
                  className="flex items-center justify-center w-11 h-11 rounded-lg flex-shrink-0"
                  style={{ background: 'var(--brand-azure-light)', color: 'var(--brand-azure-dark)' }}
                >
                  <Scale className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-foreground text-lg mb-1">Legal Professional</div>
                  <div className="text-muted-foreground text-sm">
                    I am a solicitor, barrister, or legal professional looking for an expert witness for a court case or tribunal.
                  </div>
                </div>
                <ChevronRight className={cn(
                  'w-5 h-5 mt-1 flex-shrink-0 transition-transform',
                  pendingContext === 'legal' ? 'translate-x-1 text-[var(--brand-azure-vivid)]' : 'text-muted-foreground group-hover:translate-x-1'
                )} />
              </div>
            </button>

            <button
              onClick={() => selectContext('education')}
              disabled={!!pendingContext}
              className={cn(
                'group w-full text-left rounded-xl border-2 p-6 transition-all',
                pendingContext === 'education'
                  ? 'border-[var(--brand-azure-vivid)] bg-[var(--brand-azure-light)] shadow-md'
                  : 'border-border bg-card hover:border-[var(--brand-azure-vivid)] hover:shadow-md'
              )}
            >
              <div className="flex items-start gap-4">
                <div
                  className="flex items-center justify-center w-11 h-11 rounded-lg flex-shrink-0"
                  style={{ background: 'var(--brand-azure-light)', color: 'var(--brand-azure-dark)' }}
                >
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-foreground text-lg mb-1">Education Professional, Parent, or School</div>
                  <div className="text-muted-foreground text-sm">
                    I am a SENCO, teacher, parent, or school looking for a psychological assessment for a child or young person.
                  </div>
                </div>
                <ChevronRight className={cn(
                  'w-5 h-5 mt-1 flex-shrink-0 transition-transform',
                  pendingContext === 'education' ? 'translate-x-1 text-[var(--brand-azure-vivid)]' : 'text-muted-foreground group-hover:translate-x-1'
                )} />
              </div>
            </button>
          </div>
        </div>
      )}

      {/* ── Legal Q1 ───────────────────────────────────────────── */}
      {step === 1 && context === 'legal' && (
        <QuestionStep
          question={LEGAL_Q1}
          onSelect={(v) => answerLegal(v as LegalAnswer, 0)}
          onBack={() => setStep(0)}
        />
      )}

      {/* ── Legal Q2 ───────────────────────────────────────────── */}
      {step === 2 && context === 'legal' && (
        <QuestionStep
          question={LEGAL_Q2}
          onSelect={(v) => answerLegal(v as LegalAnswer, 1)}
          onBack={() => setStep(1)}
        />
      )}

      {/* ── Education Q1 ───────────────────────────────────────── */}
      {step === 1 && context === 'education' && (
        <QuestionStep
          question={EDUCATION_Q1}
          onSelect={(v) => answerEducation(v as EducationAnswer, 0)}
          onBack={() => setStep(0)}
        />
      )}

      {/* ── Education Q2 ───────────────────────────────────────── */}
      {step === 2 && context === 'education' && (
        <QuestionStep
          question={EDUCATION_Q2}
          onSelect={(v) => answerEducation(v as EducationAnswer, 1)}
          onBack={() => setStep(1)}
        />
      )}

      {/* ── Result ─────────────────────────────────────────────── */}
      {step === 3 && result && (
        <div className="space-y-6">
          {/* Back */}
          <BackButton onClick={() => setStep(2)} />

          {/* Recommendation */}
          <div className="tool-result-in">
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-4"
              style={{ background: 'var(--brand-azure-light)', color: 'var(--brand-azure-dark)' }}
            >
              Recommendation
            </span>
            <h2 className="font-sans text-2xl sm:text-3xl font-bold mb-3" style={{ color: 'var(--brand-navy)' }}>
              {result.title}
            </h2>
            <p className="text-muted-foreground leading-relaxed">{result.explanation}</p>
          </div>

          {/* Expert type + key uses */}
          <Card className="tool-result-in border border-border">
            <div className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="flex items-center justify-center w-9 h-9 rounded-lg flex-shrink-0"
                  style={{ background: 'var(--brand-azure-light)', color: 'var(--brand-azure-dark)' }}
                >
                  {result.icon === 'graduation' ? <GraduationCap className="w-4 h-4" /> :
                   result.icon === 'stethoscope' ? <Stethoscope className="w-4 h-4" /> :
                   <Brain className="w-4 h-4" />}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Expert type</p>
                  <p className="font-bold text-foreground text-sm">{result.who}</p>
                </div>
              </div>
              <h3 className="font-sans font-bold text-sm mb-3" style={{ color: 'var(--brand-navy)' }}>
                Typical uses
              </h3>
              <ul className="space-y-2">
                {result.keyUses.map((use) => (
                  <li key={use} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--brand-azure-vivid)' }} />
                    <span className="text-muted-foreground">{use}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          {/* Optional contact opt-in */}
          {!submitted ? (
            <div className="tool-result-in rounded-xl border-2 border-border p-5 space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <div
                  onClick={() => set({ wantsContact: !wantsContact })}
                  className={cn(
                    'mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all',
                    wantsContact
                      ? 'border-[var(--brand-azure-vivid)] bg-[var(--brand-azure-vivid)]'
                      : 'border-muted-foreground'
                  )}
                >
                  {wantsContact && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                </div>
                <div>
                  <span className="font-semibold text-sm text-foreground">
                    {context === 'legal'
                      ? 'I would like Psychology Direct to match me with the right expert'
                      : 'I would like Psychology Direct to help me find the right psychologist'}
                  </span>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Optional — tick this if you'd like a Client Manager to follow up with matched profiles and availability.
                  </p>
                </div>
              </label>

              {/* Contact form — only shown when opted in */}
              {wantsContact && (
                <div className="space-y-4 pt-2 border-t">
                  {/* Name row */}
                  <div className="grid grid-cols-[auto_1fr_1fr] gap-3 items-end">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium leading-none" htmlFor="pp-salutation">Title <Req /></label>
                      <select
                        id="pp-salutation"
                        value={contact.salutation}
                        onChange={e => updateContact('salutation', e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="">—</option>
                        {SALUTATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium leading-none" htmlFor="pp-firstName">First name <Req /></label>
                      <Input id="pp-firstName" value={contact.firstName} onChange={e => updateContact('firstName', e.target.value)} placeholder="Jane" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium leading-none" htmlFor="pp-lastName">Last name <Req /></label>
                      <Input id="pp-lastName" value={contact.lastName} onChange={e => updateContact('lastName', e.target.value)} placeholder="Smith" />
                    </div>
                  </div>

                  {/* Role + org */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium leading-none" htmlFor="pp-role">Your role <Req /></label>
                      <select
                        id="pp-role"
                        value={contact.role}
                        onChange={e => updateContact('role', e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="">Select role…</option>
                        {roles.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium leading-none" htmlFor="pp-company">Organisation <Req /></label>
                      <Input id="pp-company" value={contact.company} onChange={e => updateContact('company', e.target.value)} placeholder={context === 'education' ? 'Oakwood Primary School' : 'Smith & Co Solicitors'} />
                    </div>
                  </div>

                  {/* Email + phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium leading-none" htmlFor="pp-email">Email address <Req /></label>
                      <Input id="pp-email" type="email" value={contact.email} onChange={e => updateContact('email', e.target.value)} placeholder="jane@example.co.uk" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium leading-none" htmlFor="pp-phone">Phone number <Req /></label>
                      <Input id="pp-phone" type="tel" value={contact.phone} onChange={e => updateContact('phone', e.target.value)} placeholder="01234 567890" />
                    </div>
                  </div>

                  {/* Region */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium leading-none" htmlFor="pp-region">Region <Req /></label>
                    <select
                      id="pp-region"
                      value={contact.region}
                      onChange={e => updateContact('region', e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Select region…</option>
                      {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>

                  {/* Privacy */}
                  <label className="flex items-start gap-3 cursor-pointer">
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
                      <Link href="/privacy/" className="underline hover:text-foreground" target="_blank">privacy policy</Link>. <Req />
                    </span>
                  </label>

                  {error && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-3">{error}</p>
                  )}

                  <Button
                    onClick={handleSubmit}
                    disabled={!contactValid || submitting}
                    className="w-full font-semibold h-11"
                    style={{ background: 'var(--brand-navy)', color: 'white' }}
                  >
                    {submitting ? 'Sending…' : 'Send My Enquiry'}
                    {!submitting && <ArrowRight className="w-4 h-4 ml-1" />}
                  </Button>
                </div>
              )}

              {/* If not opting in, show simple contact links */}
              {!wantsContact && (
                <div className="flex flex-wrap gap-3 pt-1">
                  <Button asChild size="sm" style={{ background: 'var(--brand-navy)', color: 'white' }}>
                    <Link href="/contact/">Get in Touch <ArrowRight className="w-3.5 h-3.5 ml-1" /></Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <a href="tel:01306879975"><Phone className="w-3.5 h-3.5 mr-1" /> 01306 879 975</a>
                  </Button>
                </div>
              )}
            </div>
          ) : (
            /* Submitted confirmation */
            <div className="tool-result-in rounded-xl p-6" style={{ background: 'var(--brand-navy)' }}>
              <h3 className="font-sans font-bold text-base text-white mb-1">Enquiry received</h3>
              <p className="text-white/70 text-sm mb-4">
                Hi {contact.firstName}, a Client Manager will be in touch within 24 hours.
              </p>
              <p className="text-white/50 text-xs flex items-center gap-1.5">
                <Mail className="w-3 h-3" />
                Confirmation sent to {contact.email}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Shared sub-components ───────────────────────────────────────────────── */

function QuestionStep<T extends string>({
  question,
  onSelect,
  onBack,
}: {
  question: Question<T>;
  onSelect: (value: T) => void;
  onBack: () => void;
}) {
  const [pending, setPending] = useState<T | null>(null);

  function handleSelect(value: T) {
    setPending(value);
    setTimeout(() => onSelect(value), 200);
  }

  return (
    <div className="tool-step-in">
      <BackButton onClick={onBack} />

      {/* Micro-insight */}
      <div
        className="rounded-lg px-4 py-3 mb-6 text-sm leading-relaxed"
        style={{ background: 'var(--brand-bg-tint)', color: 'var(--brand-navy)' }}
      >
        <span className="font-semibold">Why this matters: </span>
        {question.insight}
      </div>

      <h2 className="font-sans text-2xl sm:text-3xl font-bold mb-2" style={{ color: 'var(--brand-navy)' }}>
        {question.title}
      </h2>
      <p className="text-muted-foreground mb-6">{question.subtitle}</p>

      <div className="space-y-3">
        {question.answers.map((answer, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(answer.value)}
            disabled={!!pending}
            className={cn(
              'group w-full text-left rounded-xl border-2 px-5 py-4 transition-all',
              pending === answer.value
                ? 'border-[var(--brand-azure-vivid)] bg-[var(--brand-azure-light)] shadow-md'
                : 'border-border bg-card hover:border-[var(--brand-azure-vivid)] hover:shadow-md'
            )}
          >
            <div className="flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-foreground text-sm sm:text-base">{answer.label}</div>
                {answer.sublabel && (
                  <div className="text-xs text-muted-foreground mt-0.5">{answer.sublabel}</div>
                )}
              </div>
              <ChevronRight className={cn(
                'w-4 h-4 mt-0.5 flex-shrink-0 transition-transform',
                pending === answer.value ? 'translate-x-1 text-[var(--brand-azure-vivid)]' : 'text-muted-foreground group-hover:translate-x-1'
              )} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

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

function Req() {
  return <span className="text-red-500">*</span>;
}
