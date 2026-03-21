'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ArrowRight, ArrowLeft, RotateCcw, HelpCircle } from 'lucide-react';

/* ── Types ─────────────────────────────────────────────────────────────── */

type Recommendation = 'psychologist' | 'psychiatrist' | 'both' | 'educational' | 'either';

interface Answer {
  label: string;
  recommendation: Recommendation;
}

interface Question {
  title: string;
  subtitle: string;
  answers: Answer[];
}

/* ── Question data ─────────────────────────────────────────────────────── */

const QUESTIONS: Question[] = [
  {
    title: "What's Your Main Need?",
    subtitle: 'Select the option that best describes what you need an expert for.',
    answers: [
      { label: 'Assess behaviour, cognition, or family dynamics', recommendation: 'psychologist' },
      { label: 'Diagnose mental health or assess psychiatric status', recommendation: 'psychiatrist' },
      { label: 'Both behaviour AND psychiatric diagnosis', recommendation: 'both' },
      { label: 'Not sure', recommendation: 'either' },
    ],
  },
  {
    title: 'Does the Case Involve Medical Diagnosis?',
    subtitle: 'This helps determine whether you need a clinical or medical expert.',
    answers: [
      { label: 'No — behaviour, capacity, parenting, psychological impact', recommendation: 'psychologist' },
      { label: 'Yes — mental illness, medication, psychiatric diagnosis', recommendation: 'psychiatrist' },
      { label: 'Possibly — both factors are at play', recommendation: 'both' },
    ],
  },
  {
    title: 'Which Best Describes Your Case?',
    subtitle: 'The area of law can influence which type of expert is most appropriate.',
    answers: [
      { label: 'Family law', recommendation: 'psychologist' },
      { label: 'Criminal law', recommendation: 'either' },
      { label: 'Civil / Personal Injury', recommendation: 'psychologist' },
      { label: 'EHCP / school assessment', recommendation: 'educational' },
      { label: 'Employment / discrimination', recommendation: 'either' },
      { label: 'Immigration', recommendation: 'either' },
    ],
  },
];

/* ── Result cards ──────────────────────────────────────────────────────── */

interface ResultInfo {
  title: string;
  explanation: string;
  ctaText: string;
}

const RESULT_MAP: Record<string, ResultInfo> = {
  psychologist: {
    title: 'You Likely Need a Psychologist',
    explanation:
      'Based on your answers, a psychologist is best placed to help. They can assess behaviour, cognition, parenting capacity, learning needs, and psychological impact — without a psychiatric medical diagnosis.',
    ctaText: 'Find a Psychologist',
  },
  psychiatrist: {
    title: 'You Likely Need a Psychiatrist',
    explanation:
      'Your case appears to involve psychiatric assessment or medical diagnosis. A psychiatrist — a medically qualified doctor specialising in mental health — can diagnose conditions, comment on medication, and provide clinical opinions.',
    ctaText: 'Find a Psychiatrist',
  },
  both: {
    title: 'You May Need Both',
    explanation:
      'Your case involves both psychological and psychiatric factors. We often coordinate joint instructions with a psychologist and psychiatrist working alongside each other to provide comprehensive evidence.',
    ctaText: 'Discuss Your Case',
  },
  educational: {
    title: 'You Likely Need an Educational Psychologist',
    explanation:
      'For EHCP assessments, school placements, or educational needs, an educational psychologist is the right expert. They specialise in learning, development, and educational provision.',
    ctaText: 'Book an Assessment',
  },
  either: {
    title: 'Either Could Help — Let Us Advise',
    explanation:
      'Your case could benefit from either a psychologist or psychiatrist depending on the specific issues. Our team can review the details and recommend the right expert for your needs.',
    ctaText: 'Get Expert Advice',
  },
};

/* ── Component ─────────────────────────────────────────────────────────── */

export function PsychOrPsychiatrist() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Recommendation[]>([]);

  const totalSteps = QUESTIONS.length;
  const isFinished = step >= totalSteps;

  function handleSelect(recommendation: Recommendation) {
    const next = [...answers];
    next[step] = recommendation;
    setAnswers(next);
    setStep(step + 1);
  }

  function handleBack() {
    if (step > 0) setStep(step - 1);
  }

  function handleReset() {
    setStep(0);
    setAnswers([]);
  }

  function getResult(): string {
    // Count each recommendation type
    const counts: Record<string, number> = {};
    for (const a of answers) {
      counts[a] = (counts[a] || 0) + 1;
    }

    // Educational is always a strong signal
    if (counts['educational']) return 'educational';

    // Both is a strong signal
    if (counts['both'] && counts['both'] >= 2) return 'both';

    // Find majority
    const psychCount = (counts['psychologist'] || 0);
    const psychiCount = (counts['psychiatrist'] || 0);
    const bothCount = (counts['both'] || 0);

    if (bothCount > 0 && psychCount > 0 && psychiCount > 0) return 'both';
    if (psychCount > psychiCount) return 'psychologist';
    if (psychiCount > psychCount) return 'psychiatrist';
    if (psychCount === psychiCount && psychCount > 0) return 'both';

    return 'either';
  }

  const progressPercent = Math.round(((isFinished ? totalSteps : step) / totalSteps) * 100);

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3 mb-1">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-md"
            style={{ background: 'var(--brand-azure-light)', color: 'var(--brand-azure-dark)' }}
          >
            <HelpCircle className="w-5 h-5" />
          </div>
          <CardTitle className="font-serif" style={{ color: 'var(--brand-navy)' }}>
            Psychologist or Psychiatrist?
          </CardTitle>
        </div>
        <CardDescription>
          Answer three quick questions and we&rsquo;ll recommend the right type of expert for your case.
        </CardDescription>
      </CardHeader>

      {/* Progress bar */}
      <div className="px-6 pb-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
          <span>
            {isFinished
              ? 'Complete'
              : `Question ${step + 1} of ${totalSteps}`}
          </span>
          <span>{progressPercent}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${progressPercent}%`,
              background: 'var(--brand-azure)',
            }}
          />
        </div>
      </div>

      <CardContent className="pt-4">
        {!isFinished ? (
          <div className="space-y-4">
            <div>
              <h3
                className="text-lg font-semibold mb-1"
                style={{ color: 'var(--brand-navy)' }}
              >
                {QUESTIONS[step].title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {QUESTIONS[step].subtitle}
              </p>
            </div>
            <div className="space-y-2">
              {QUESTIONS[step].answers.map((answer, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(answer.recommendation)}
                  className={cn(
                    'w-full text-left rounded-md border px-4 py-3 text-sm font-medium transition-colors',
                    'hover:border-[var(--brand-azure)] hover:bg-[var(--brand-azure-light)]',
                    answers[step] === answer.recommendation
                      ? 'border-[var(--brand-azure)] bg-[var(--brand-azure-light)] text-[var(--brand-navy)]'
                      : 'border-border bg-card text-foreground'
                  )}
                >
                  {answer.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          (() => {
            const resultKey = getResult();
            const info = RESULT_MAP[resultKey];
            return (
              <div className="space-y-6">
                <div
                  className="rounded-md p-6 text-center"
                  style={{ background: 'var(--brand-bg-tint)' }}
                >
                  <Badge
                    className="mb-3"
                    style={{ background: 'var(--brand-azure-light)', color: 'var(--brand-azure-dark)' }}
                  >
                    Recommendation
                  </Badge>
                  <h3
                    className="text-xl font-bold font-serif mb-3"
                    style={{ color: 'var(--brand-navy)' }}
                  >
                    {info.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto">
                    {info.explanation}
                  </p>
                </div>

                {/* CTA */}
                <div
                  className="rounded-md p-5 flex flex-col sm:flex-row items-center gap-4"
                  style={{ background: 'var(--brand-navy)', color: 'white' }}
                >
                  <div className="flex-1 text-center sm:text-left">
                    <p className="font-semibold text-sm">Need help choosing the right expert?</p>
                    <p className="text-xs text-white/70 mt-1">
                      Our team matches you with vetted, regulated professionals within 48 hours.
                    </p>
                  </div>
                  <Button
                    asChild
                    size="default"
                    className="font-semibold"
                    style={{ background: 'var(--brand-azure)', color: 'var(--brand-navy)' }}
                  >
                    <a href="/contact/">
                      {info.ctaText}
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </a>
                  </Button>
                </div>
              </div>
            );
          })()
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        {!isFinished && step > 0 ? (
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
        ) : (
          <div />
        )}
        {isFinished && (
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-1" />
            Start Again
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
