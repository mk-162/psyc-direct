'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ArrowRight, ArrowLeft, RotateCcw, ClipboardCheck, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

/* ── Types ─────────────────────────────────────────────────────────────── */

interface AnswerOption {
  label: string;
  score: number;
}

interface Question {
  title: string;
  subtitle: string;
  answers: AnswerOption[];
}

/* ── Question data ─────────────────────────────────────────────────────── */

const QUESTIONS: Question[] = [
  {
    title: 'What Type of Proceeding?',
    subtitle: 'Select the area of law your case falls under.',
    answers: [
      { label: 'Family Law', score: 1 },
      { label: 'Criminal', score: 1 },
      { label: 'Civil / Personal Injury', score: 1 },
      { label: 'Employment', score: 1 },
      { label: 'Immigration', score: 1 },
      { label: 'Other / Not sure', score: 0 },
    ],
  },
  {
    title: 'Is There Dispute About Psychological or Medical Factors?',
    subtitle: 'Expert evidence is most useful when there are contested issues the court needs help understanding.',
    answers: [
      { label: 'Yes', score: 2 },
      { label: 'Partially', score: 1 },
      { label: 'No', score: 0 },
      { label: 'Not sure', score: 1 },
    ],
  },
  {
    title: 'Would Expert Evidence Help the Court Understand?',
    subtitle: 'Courts appoint experts when their specialist knowledge aids decision-making.',
    answers: [
      { label: 'Yes', score: 2 },
      { label: 'Maybe', score: 1 },
      { label: 'Unlikely', score: 0 },
      { label: 'Unsure', score: 1 },
    ],
  },
  {
    title: 'Have You Considered Instructing an Expert?',
    subtitle: 'We help at every stage, whether you\'re sure or just exploring.',
    answers: [
      { label: 'Yes, I want validation of this decision', score: 1 },
      { label: 'No, I wasn\'t sure if it was appropriate', score: 1 },
      { label: 'No, I thought it would be too expensive', score: 0 },
      { label: 'I don\'t know where to start', score: 1 },
    ],
  },
];

/* ── Result definitions ────────────────────────────────────────────────── */

interface ResultInfo {
  level: 'high' | 'medium' | 'low';
  title: string;
  explanation: string;
  ctaText: string;
}

function getResultInfo(score: number): ResultInfo {
  if (score >= 4) {
    return {
      level: 'high',
      title: 'Highly Likely to Benefit',
      explanation:
        'Based on your answers, instructing an expert witness is very likely to strengthen your case. Expert psychological or psychiatric evidence can help the court understand disputed issues, support your legal arguments, and improve outcomes for your client.',
      ctaText: 'Instruct an Expert',
    };
  }
  if (score >= 2) {
    return {
      level: 'medium',
      title: 'Worth Exploring',
      explanation:
        'There are indications that expert evidence could add value to your case. We recommend a brief discussion with our team to assess whether instruction would be proportionate and helpful. There is no obligation and no fee for this initial conversation.',
      ctaText: 'Discuss Your Case',
    };
  }
  return {
    level: 'low',
    title: 'May Not Be Needed',
    explanation:
      'Based on your answers, expert evidence may not be necessary for your case at this stage. However, if the circumstances change or if you\'d like a second opinion, our team is happy to advise at no cost.',
    ctaText: 'Get Free Advice',
  };
}

/* ── Component ─────────────────────────────────────────────────────────── */

export function SuitabilityChecker() {
  const [step, setStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);

  const totalSteps = QUESTIONS.length;
  const isFinished = step >= totalSteps;

  function handleSelect(score: number) {
    const next = [...selectedAnswers];
    next[step] = score;
    setSelectedAnswers(next);
    setStep(step + 1);
  }

  function handleBack() {
    if (step > 0) setStep(step - 1);
  }

  function handleReset() {
    setStep(0);
    setSelectedAnswers([]);
  }

  const totalScore = selectedAnswers.reduce((sum, s) => sum + s, 0);
  const progressPercent = Math.round(((isFinished ? totalSteps : step) / totalSteps) * 100);

  const resultInfo = getResultInfo(totalScore);

  const levelIcon = {
    high: <CheckCircle2 className="w-8 h-8" style={{ color: '#16a34a' }} />,
    medium: <AlertCircle className="w-8 h-8" style={{ color: 'var(--brand-azure-dark)' }} />,
    low: <XCircle className="w-8 h-8 text-muted-foreground" />,
  };

  const levelBadgeStyle = {
    high: { background: '#dcfce7', color: '#166534' },
    medium: { background: 'var(--brand-azure-light)', color: 'var(--brand-azure-dark)' },
    low: { background: 'hsl(var(--muted))', color: 'hsl(var(--muted-foreground))' },
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3 mb-1">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-md"
            style={{ background: 'var(--brand-azure-light)', color: 'var(--brand-azure-dark)' }}
          >
            <ClipboardCheck className="w-5 h-5" />
          </div>
          <CardTitle className="font-serif" style={{ color: 'var(--brand-navy)' }}>
            Do You Need an Expert Witness?
          </CardTitle>
        </div>
        <CardDescription>
          Answer four quick questions to find out whether instructing a psychology or psychiatry expert
          witness is likely to help your case.
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
                  onClick={() => handleSelect(answer.score)}
                  className={cn(
                    'w-full text-left rounded-md border px-4 py-3 text-sm font-medium transition-colors',
                    'hover:border-[var(--brand-azure)] hover:bg-[var(--brand-azure-light)]',
                    'border-border bg-card text-foreground'
                  )}
                >
                  {answer.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Result */}
            <div
              className="rounded-md p-6 text-center"
              style={{ background: 'var(--brand-bg-tint)' }}
            >
              <div className="flex justify-center mb-3">
                {levelIcon[resultInfo.level]}
              </div>
              <Badge className="mb-3" style={levelBadgeStyle[resultInfo.level]}>
                Score: {totalScore}/{QUESTIONS.length * 2}
              </Badge>
              <h3
                className="text-xl font-bold font-serif mb-3"
                style={{ color: 'var(--brand-navy)' }}
              >
                {resultInfo.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto">
                {resultInfo.explanation}
              </p>
            </div>

            {/* CTA */}
            <div
              className="rounded-md p-5 flex flex-col sm:flex-row items-center gap-4"
              style={{ background: 'var(--brand-navy)', color: 'white' }}
            >
              <div className="flex-1 text-center sm:text-left">
                <p className="font-semibold text-sm">Speak to our team</p>
                <p className="text-xs text-white/70 mt-1">
                  No-obligation advice on whether expert evidence is right for your case.
                </p>
              </div>
              <Button
                asChild
                size="default"
                className="font-semibold"
                style={{ background: 'var(--brand-azure)', color: 'var(--brand-navy)' }}
              >
                <a href="/contact/">
                  {resultInfo.ctaText}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </Button>
            </div>
          </div>
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
