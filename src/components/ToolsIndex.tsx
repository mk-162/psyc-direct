import Link from 'next/link';
import { ArrowRight, Calculator, Scale, HelpCircle, ClipboardCheck, Clock, BookOpen, CheckSquare, ChevronRight, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

/* ── Tool definitions ───────────────────────────────────────────────────── */

interface Tool {
  slug: string;
  label: string;
  tagline: string;
  description: string;
  icon: React.ElementType;
  audience: string;
  time: string;
  cta: string;
  status: 'live' | 'coming-soon';
  featured?: boolean;
}

const TOOLS: Tool[] = [
  {
    slug: 'legal-assessment',
    label: 'Case Assessment Tool',
    tagline: 'Does Your Case Need Expert Evidence?',
    description: 'Four steps to find out whether your case needs a psychological or psychiatric expert witness — with legal citations for your case type and a 24-hour match.',
    icon: Scale,
    audience: 'Solicitors & Legal Teams',
    time: '3 minutes',
    cta: 'Start Assessment',
    status: 'live',
    featured: true,
  },
  {
    slug: 'psychologist-or-psychiatrist',
    label: 'Psychologist or Psychiatrist?',
    tagline: 'Which Type of Expert Do You Need?',
    description: 'Not sure whether your case requires a psychologist or a psychiatrist? Answer a few questions and get a clear recommendation with next steps.',
    icon: HelpCircle,
    audience: 'Solicitors, HR & Case Managers',
    time: '2 minutes',
    cta: 'Find Out Now',
    status: 'live',
    featured: true,
  },
  {
    slug: 'fee-calculator',
    label: 'Fee Estimator',
    tagline: 'Estimate Your Expert Witness Costs',
    description: 'Get an indicative fee range for your expert witness instruction based on expert type, area of law, and timeline. Exact costs confirmed after case review.',
    icon: Calculator,
    audience: 'Solicitors & Cost Draftsmen',
    time: '1 minute',
    cta: 'Calculate Fees',
    status: 'live',
    featured: true,
  },
  {
    slug: 'suitability-checker',
    label: 'Suitability Checker',
    tagline: 'Is Your Case Suitable for Expert Evidence?',
    description: 'A quick 4-question guide to whether instructing a psychology or psychiatry expert witness is likely to benefit your case.',
    icon: ClipboardCheck,
    audience: 'Solicitors',
    time: '1 minute',
    cta: 'Check Suitability',
    status: 'live',
    featured: false,
  },
];

const COMING_SOON: { label: string; description: string; icon: React.ElementType; audience: string }[] = [
  {
    label: 'EHCP Assessment Planner',
    description: 'Help schools, parents, and local authorities determine whether an Educational Psychologist is needed — and which type of assessment is appropriate.',
    icon: BookOpen,
    audience: 'Schools, SENCOs & Parents',
  },
  {
    label: 'Court Deadline Calculator',
    description: 'Enter your court or tribunal date. Get a timeline showing when you need to instruct an expert, file reports, and serve evidence.',
    icon: Clock,
    audience: 'Solicitors & Litigants',
  },
  {
    label: 'Expert Instruction Checklist',
    description: 'A step-by-step guide to drafting a compliant Letter of Instruction — covering the key questions your expert report must address.',
    icon: CheckSquare,
    audience: 'Solicitors & Paralegals',
  },
];

/* ── Component ──────────────────────────────────────────────────────────── */

export function ToolsIndex() {
  const featuredTools = TOOLS.filter((t) => t.featured && t.status === 'live');
  const otherTools = TOOLS.filter((t) => !t.featured && t.status === 'live');

  return (
    <>
      {/* Hero */}
      <section
        className="py-14 sm:py-20"
        style={{ background: 'linear-gradient(135deg, var(--brand-hero-from), var(--brand-hero-to))' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[var(--brand-azure-light)] text-sm font-semibold uppercase tracking-widest mb-3">
            Free Tools
          </p>
          <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
            The Psychology Direct Toolbox
          </h1>
          <p className="text-[var(--brand-azure-light)] text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Free tools for legal professionals, HR teams, schools, and anyone navigating the expert assessment process. Get clarity in minutes — no obligation.
          </p>
        </div>
      </section>

      {/* Featured tools */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h2
          className="font-sans text-sm font-bold uppercase tracking-wide mb-6"
          style={{ color: 'var(--brand-azure-vivid)' }}
        >
          Tools
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {featuredTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} large />
          ))}
        </div>

        {/* Secondary tools */}
        {otherTools.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-16">
            {otherTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} large={false} />
            ))}
          </div>
        )}

        {/* Coming soon */}
        <div className="border-t pt-12">
          <div className="flex items-center justify-between mb-6">
            <h2
              className="font-sans text-sm font-bold uppercase tracking-wide"
              style={{ color: 'var(--brand-azure-vivid)' }}
            >
              Coming Soon
            </h2>
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ background: 'var(--brand-bg-tint)', color: 'var(--brand-navy)' }}
            >
              In Development
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {COMING_SOON.map((tool) => (
              <div
                key={tool.label}
                className="rounded-xl border-2 border-dashed border-border bg-background p-5"
              >
                <div
                  className="flex items-center justify-center w-9 h-9 rounded-lg mb-3"
                  style={{ background: 'var(--brand-bg-tint)', color: 'var(--brand-azure-vivid)' }}
                >
                  <tool.icon className="w-4.5 h-4.5" />
                </div>
                <p
                  className="text-xs font-bold uppercase tracking-wide mb-1"
                  style={{ color: 'var(--brand-azure-vivid)' }}
                >
                  {tool.audience}
                </p>
                <h3 className="font-sans font-bold text-base text-foreground mb-2">{tool.label}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{tool.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA strip */}
        <div
          className="mt-16 rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-6"
          style={{ background: 'var(--brand-navy)' }}
        >
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-sans text-xl font-bold text-white mb-2">
              Prefer to speak to someone?
            </h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Our Client Managers have 15+ years of experience. Call for a free, no-obligation discussion about your case.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <Button
              asChild
              className="font-semibold"
              style={{ background: 'var(--brand-azure)', color: 'var(--brand-navy)' }}
            >
              <Link href="/contact/">
                Get in Touch <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:text-white">
              <a href="tel:01306879975">
                <Phone className="w-4 h-4 mr-1" /> 01306 879 975
              </a>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Tool card ───────────────────────────────────────────────────────────── */

function ToolCard({ tool, large }: { tool: Tool; large: boolean }) {
  const Icon = tool.icon;

  return (
    <Link href={`/tools/${tool.slug}/`} className="group block h-full">
      <div
        className="h-full rounded-xl border-2 border-border bg-card p-6 flex flex-col transition-all group-hover:border-[var(--brand-azure-vivid)] group-hover:shadow-md"
      >
        {/* Icon + label row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0"
            style={{ background: 'var(--brand-azure-light)', color: 'var(--brand-azure-dark)' }}
          >
            <Icon className="w-5 h-5" />
          </div>
          <span
            className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full flex-shrink-0"
            style={{ background: 'var(--brand-bg-tint)', color: 'var(--brand-navy)' }}
          >
            {tool.time}
          </span>
        </div>

        {/* Audience */}
        <p
          className="text-xs font-bold uppercase tracking-wide mb-1"
          style={{ color: 'var(--brand-azure-vivid)' }}
        >
          {tool.audience}
        </p>

        {/* Title + description */}
        <h3 className={`font-sans font-bold text-foreground mb-2 leading-snug ${large ? 'text-lg' : 'text-base'}`}>
          {tool.tagline}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed flex-1">{tool.description}</p>

        {/* CTA */}
        <div
          className="mt-5 flex items-center gap-1 text-sm font-semibold group-hover:gap-2 transition-all"
          style={{ color: 'var(--brand-azure-vivid)' }}
        >
          {tool.cta} <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}
