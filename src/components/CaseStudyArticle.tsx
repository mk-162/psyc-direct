'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTina } from 'tinacms/dist/react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, ChevronRight, Phone, Mail, CheckCircle2 } from 'lucide-react';

const TOOLS = [
  { label: 'Fee Calculator', href: '/tools/fee-calculator/', desc: 'Estimate expert costs' },
  { label: 'Suitability Checker', href: '/tools/suitability-checker/', desc: 'Check case suitability' },
  { label: 'Psychologist or Psychiatrist?', href: '/tools/psychologist-or-psychiatrist/', desc: 'Find the right expert type' },
];

const SELLING_POINTS = [
  '24-hour CV and quote turnaround',
  'HCPC-registered, vetted experts',
  'Dedicated Client Manager',
  'Full administrative support',
  'Quality-assured reports',
  'Nationwide coverage',
];

interface CaseStudyArticleProps {
  query: string;
  variables: { relativePath: string };
  data: any;
}

export function CaseStudyArticle({ query, variables, data: initialData }: CaseStudyArticleProps) {
  const { data } = useTina({ query, variables, data: initialData });
  const cs = data.caseStudies;
  if (!cs) return null;

  const sector = cs.sector || '';

  return (
    <>
      {/* Breadcrumb */}
      <nav className="border-b bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <ol className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
            <li><Link href="/" className="hover:text-foreground transition-colors">Home</Link></li>
            <ChevronRight className="w-3 h-3" />
            <li><Link href="/case-studies/" className="hover:text-foreground transition-colors">Case Studies</Link></li>
            <ChevronRight className="w-3 h-3" />
            <li className="text-foreground font-medium truncate max-w-[200px] sm:max-w-none">{cs.title}</li>
          </ol>
        </div>
      </nav>

      <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12">
          {/* Main content */}
          <div className="flex-1 min-w-0 max-w-3xl">
            {/* Header */}
            <div className="mb-6">
              {sector && (
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide text-[var(--brand-azure)] bg-[var(--brand-navy)] mb-4">
                  {sector}
                </span>
              )}
              <h1 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-4">
                {cs.title}
              </h1>
              {cs.description && (
                <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-6">
                  {cs.description}
                </p>
              )}
              <div className="border-t mb-8" />
            </div>

            {/* Featured image */}
            {cs.featuredImage && (
              <div className="rounded-md overflow-hidden mb-8 relative h-48 sm:h-64 lg:h-72">
                <Image src={cs.featuredImage} alt={cs.title || ''} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 66vw" />
              </div>
            )}

            {/* Body */}
            <div className="prose prose-sm sm:prose max-w-none mb-8 prose-headings:font-sans prose-headings:text-foreground prose-h2:text-xl prose-h2:sm:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-p:text-muted-foreground prose-p:leading-relaxed prose-li:text-muted-foreground prose-strong:text-foreground prose-blockquote:border-l-[var(--brand-azure-vivid)] prose-blockquote:text-foreground prose-blockquote:font-serif prose-blockquote:not-italic">
              <TinaMarkdown content={cs.body} />
            </div>

            {/* Back link */}
            <div className="mt-8 pt-6 border-t">
              <Button asChild variant="secondary">
                <Link href="/case-studies/"><ArrowLeft className="w-4 h-4 mr-2" /> All Case Studies</Link>
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-72 xl:w-80 flex-shrink-0 space-y-8">
            <div className="lg:sticky lg:top-24 space-y-8">
              {/* CTA */}
              <div className="rounded-xl p-6" style={{ background: 'var(--brand-navy)' }}>
                <h3 className="font-sans text-base font-bold text-white mb-2">Need an Expert?</h3>
                <p className="text-white/70 text-sm leading-relaxed mb-4">
                  Get matched with the right psychologist or psychiatrist within 24 hours.
                </p>
                <Button asChild size="sm" className="w-full font-semibold" style={{ background: 'var(--brand-azure)', color: 'var(--brand-navy)' }}>
                  <Link href="/contact/">Get in Touch <ArrowRight className="w-4 h-4 ml-1" /></Link>
                </Button>
                <div className="flex flex-col gap-2 mt-4">
                  <a href="tel:01306879975" className="flex items-center gap-2 text-white/80 hover:text-white text-xs transition-colors">
                    <Phone className="w-3.5 h-3.5" /> 01306 879 975
                  </a>
                  <a href="mailto:enquiries@psychologydirect.co.uk" className="flex items-center gap-2 text-white/80 hover:text-white text-xs transition-colors">
                    <Mail className="w-3.5 h-3.5" /> enquiries@psychologydirect.co.uk
                  </a>
                </div>
              </div>

              {/* Why choose us */}
              <div className="rounded-xl border border-border p-5">
                <h3 className="font-sans text-sm font-bold mb-3" style={{ color: 'var(--brand-navy)' }}>Why Choose Us</h3>
                <ul className="space-y-2.5">
                  {SELLING_POINTS.map((point) => (
                    <li key={point} className="flex gap-2 items-start text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: 'var(--brand-azure-vivid)' }} />
                      <span className="text-muted-foreground">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tools */}
              <div className="rounded-xl p-5" style={{ background: 'var(--brand-bg-tint)' }}>
                <h3 className="font-sans text-sm font-bold mb-3" style={{ color: 'var(--brand-navy)' }}>Useful Tools</h3>
                <div className="space-y-3">
                  {TOOLS.map((tool) => (
                    <Link key={tool.href} href={tool.href} className="block group">
                      <div className="text-sm font-semibold group-hover:underline" style={{ color: 'var(--brand-azure-vivid)' }}>
                        {tool.label}
                      </div>
                      <div className="text-xs text-muted-foreground">{tool.desc}</div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </article>
    </>
  );
}
