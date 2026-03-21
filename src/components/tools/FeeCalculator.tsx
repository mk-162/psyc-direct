'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Phone, ArrowRight, Calculator, RotateCcw } from 'lucide-react';

/* ── Option types ──────────────────────────────────────────────────────── */

type ExpertType = 'psychologist' | 'psychiatrist' | 'not-sure';
type AreaOfLaw = 'family' | 'criminal' | 'civil-pi' | 'employment' | 'immigration' | 'other';
type Individuals = '1' | '2-3' | '4+' | 'unsure';
type Timeline = 'standard' | 'fast-track' | 'urgent';
type Funding = 'legal-aid' | 'private' | 'unsure';

/* ── Multiplier maps ───────────────────────────────────────────────────── */

const BASE_FEES: Record<ExpertType, number> = {
  psychologist: 1800,
  psychiatrist: 2200,
  'not-sure': 2000,
};

const AREA_MULTIPLIERS: Record<AreaOfLaw, number> = {
  family: 1.0,
  criminal: 0.9,
  'civil-pi': 1.1,
  employment: 1.0,
  immigration: 1.0,
  other: 1.0,
};

const INDIVIDUAL_MULTIPLIERS: Record<Individuals, number> = {
  '1': 1.0,
  '2-3': 1.8,
  '4+': 3.0,
  unsure: 1.5,
};

const TIMELINE_MULTIPLIERS: Record<Timeline, number> = {
  standard: 1.0,
  'fast-track': 1.3,
  urgent: 1.5,
};

/* ── Radio group helper ────────────────────────────────────────────────── */

function RadioGroup<T extends string>({
  label,
  name,
  value,
  onChange,
  options,
}: {
  label: string;
  name: string;
  value: T | '';
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-semibold" style={{ color: 'var(--brand-navy)' }}>
        {label}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <label
            key={opt.value}
            className={cn(
              'cursor-pointer rounded-md border px-4 py-2 text-sm font-medium transition-colors',
              value === opt.value
                ? 'border-[var(--brand-azure)] bg-[var(--brand-azure-light)] text-[var(--brand-navy)]'
                : 'border-border bg-card text-foreground hover:bg-muted'
            )}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="sr-only"
            />
            {opt.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/* ── Select helper ─────────────────────────────────────────────────────── */

function SelectField<T extends string>({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value: T | '';
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold" style={{ color: 'var(--brand-navy)' }}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <option value="">{placeholder || 'Select...'}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ── Main component ────────────────────────────────────────────────────── */

export function FeeCalculator() {
  const [expertType, setExpertType] = useState<ExpertType | ''>('');
  const [areaOfLaw, setAreaOfLaw] = useState<AreaOfLaw | ''>('');
  const [individuals, setIndividuals] = useState<Individuals | ''>('');
  const [timeline, setTimeline] = useState<Timeline | ''>('');
  const [funding, setFunding] = useState<Funding | ''>('');
  const [showResult, setShowResult] = useState(false);

  const isComplete = expertType && areaOfLaw && individuals && timeline && funding;

  function calculate() {
    if (!expertType || !areaOfLaw || !individuals || !timeline || !funding) return null;

    const base = BASE_FEES[expertType];
    const area = AREA_MULTIPLIERS[areaOfLaw];
    const indiv = INDIVIDUAL_MULTIPLIERS[individuals];
    const time = TIMELINE_MULTIPLIERS[timeline];
    const legalAid = funding === 'legal-aid' ? 0.75 : 1.0;

    const calculated = base * area * indiv * time * legalAid;
    const low = Math.round((calculated * 0.85) / 100) * 100;
    const high = Math.round((calculated * 1.15) / 100) * 100;

    return { low, high, base, area, indiv, time, legalAid, calculated };
  }

  function handleEstimate() {
    if (isComplete) setShowResult(true);
  }

  function handleReset() {
    setExpertType('');
    setAreaOfLaw('');
    setIndividuals('');
    setTimeline('');
    setFunding('');
    setShowResult(false);
  }

  const result = calculate();

  const expertLabels: Record<ExpertType, string> = {
    psychologist: 'Psychologist',
    psychiatrist: 'Psychiatrist',
    'not-sure': 'Not sure',
  };

  const areaLabels: Record<AreaOfLaw, string> = {
    family: 'Family',
    criminal: 'Criminal',
    'civil-pi': 'Civil / Personal Injury',
    employment: 'Employment',
    immigration: 'Immigration',
    other: 'Other',
  };

  const timelineLabels: Record<Timeline, string> = {
    standard: 'Standard (4-6 weeks)',
    'fast-track': 'Fast-track (2-3 weeks)',
    urgent: 'Urgent',
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3 mb-1">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-md"
            style={{ background: 'var(--brand-azure-light)', color: 'var(--brand-azure-dark)' }}
          >
            <Calculator className="w-5 h-5" />
          </div>
          <CardTitle className="font-serif" style={{ color: 'var(--brand-navy)' }}>
            Fee Estimator
          </CardTitle>
        </div>
        <CardDescription>
          Get an indicative fee range for your expert witness instruction. All figures are estimates
          &mdash; we&rsquo;ll confirm exact costs after reviewing your case.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {!showResult ? (
          <>
            {/* Q1: Expert type */}
            <RadioGroup<ExpertType>
              label="1. What type of expert do you need?"
              name="expert-type"
              value={expertType}
              onChange={setExpertType}
              options={[
                { value: 'psychologist', label: 'Psychologist' },
                { value: 'psychiatrist', label: 'Psychiatrist' },
                { value: 'not-sure', label: 'Not sure' },
              ]}
            />

            {/* Q2: Area of law */}
            <SelectField<AreaOfLaw>
              label="2. Area of law"
              value={areaOfLaw}
              onChange={setAreaOfLaw}
              placeholder="Select area of law..."
              options={[
                { value: 'family', label: 'Family' },
                { value: 'criminal', label: 'Criminal' },
                { value: 'civil-pi', label: 'Civil / Personal Injury' },
                { value: 'employment', label: 'Employment' },
                { value: 'immigration', label: 'Immigration' },
                { value: 'other', label: 'Other' },
              ]}
            />

            {/* Q3: Individuals */}
            <RadioGroup<Individuals>
              label="3. Number of individuals to assess"
              name="individuals"
              value={individuals}
              onChange={setIndividuals}
              options={[
                { value: '1', label: '1' },
                { value: '2-3', label: '2-3' },
                { value: '4+', label: '4+' },
                { value: 'unsure', label: 'Unsure' },
              ]}
            />

            {/* Q4: Timeline */}
            <RadioGroup<Timeline>
              label="4. Timeline"
              name="timeline"
              value={timeline}
              onChange={setTimeline}
              options={[
                { value: 'standard', label: 'Standard (4-6 weeks)' },
                { value: 'fast-track', label: 'Fast-track (2-3 weeks)' },
                { value: 'urgent', label: 'Urgent' },
              ]}
            />

            {/* Q5: Funding */}
            <RadioGroup<Funding>
              label="5. Funding"
              name="funding"
              value={funding}
              onChange={setFunding}
              options={[
                { value: 'legal-aid', label: 'Legal Aid' },
                { value: 'private', label: 'Private' },
                { value: 'unsure', label: 'Unsure' },
              ]}
            />
          </>
        ) : result ? (
          <div className="space-y-6">
            {/* Estimated range */}
            <div
              className="rounded-md p-6 text-center"
              style={{ background: 'var(--brand-bg-tint)' }}
            >
              <p className="text-sm font-medium text-muted-foreground mb-1">Estimated fee range</p>
              <p className="text-3xl font-bold font-serif" style={{ color: 'var(--brand-navy)' }}>
                &pound;{result.low.toLocaleString()} &ndash; &pound;{result.high.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Indicative only &mdash; exact fees confirmed after case review
              </p>
            </div>

            {/* Breakdown */}
            <div className="space-y-2 text-sm">
              <p className="font-semibold" style={{ color: 'var(--brand-navy)' }}>
                Breakdown
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-muted-foreground">
                <span>Expert type</span>
                <span className="font-medium text-foreground">{expertLabels[expertType as ExpertType]}</span>
                <span>Area of law</span>
                <span className="font-medium text-foreground">{areaLabels[areaOfLaw as AreaOfLaw]}</span>
                <span>Individuals</span>
                <span className="font-medium text-foreground">{individuals}</span>
                <span>Timeline</span>
                <span className="font-medium text-foreground">{timelineLabels[timeline as Timeline]}</span>
                <span>Funding</span>
                <span className="font-medium text-foreground">
                  {funding === 'legal-aid' ? 'Legal Aid (LAA rates)' : funding === 'private' ? 'Private' : 'Unsure'}
                </span>
              </div>
              {funding === 'legal-aid' && (
                <p className="text-xs text-muted-foreground mt-2">
                  Legal Aid fees reflect standard LAA rates, which are typically lower than private instruction.
                </p>
              )}
            </div>

            {/* CTA */}
            <div
              className="rounded-md p-5 flex flex-col sm:flex-row items-center gap-4"
              style={{ background: 'var(--brand-navy)', color: 'white' }}
            >
              <div className="flex-1 text-center sm:text-left">
                <p className="font-semibold text-sm">Ready to instruct an expert?</p>
                <p className="text-xs text-white/70 mt-1">
                  Speak with our team for a precise quote and to discuss your requirements.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  asChild
                  size="default"
                  className="font-semibold"
                  style={{ background: 'var(--brand-azure)', color: 'var(--brand-navy)' }}
                >
                  <a href="/contact/">
                    Instruct an Expert
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-white/30 text-white bg-white/5 hover:bg-white/15"
                >
                  <a href="tel:01306879975">
                    <Phone className="w-4 h-4 mr-1" />
                    01306 879 975
                  </a>
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </CardContent>

      <CardFooter className="flex justify-between">
        {!showResult ? (
          <Button
            onClick={handleEstimate}
            disabled={!isComplete}
            className="font-semibold"
            style={
              isComplete
                ? { background: 'var(--brand-azure)', color: 'var(--brand-navy)' }
                : undefined
            }
          >
            Get Estimate
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-1" />
            Start Again
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
