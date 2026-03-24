'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, ArrowRight, ChevronRight, X, Phone, Mail, CheckCircle2, FileText } from 'lucide-react';

export interface CaseStudyItem {
  slug: string;
  title: string;
  description?: string;
  sector?: string;
  featuredImage?: string;
}

const SECTORS = ['Education', 'Expert Witness'];

const SELLING_POINTS = [
  '24-hour CV and quote turnaround',
  'HCPC-registered, vetted experts',
  'Dedicated Client Manager',
  'Full administrative support',
  'Quality-assured reports',
  'Nationwide coverage',
];

const TOOLS = [
  { label: 'Fee Calculator', href: '/tools/fee-calculator/', desc: 'Estimate expert costs' },
  { label: 'Psychologist or Psychiatrist?', href: '/tools/psychologist-or-psychiatrist/', desc: 'Find the right expert type' },
  { label: 'Suitability Checker', href: '/tools/suitability-checker/', desc: 'Check case suitability' },
];

function CaseStudyCardLarge({ cs }: { cs: CaseStudyItem }) {
  return (
    <Link href={`/case-studies/${cs.slug}/`}>
      <Card className="group bg-background border border-border hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex flex-col lg:flex-row">
          {cs.featuredImage && (
            <div className="lg:w-2/5 h-56 lg:h-auto overflow-hidden rounded-t-md lg:rounded-l-md lg:rounded-tr-none relative">
              <Image
                src={cs.featuredImage}
                alt={cs.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
          )}
          <div className="flex-1 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
            {cs.sector && (
              <span className="text-[var(--brand-azure-vivid)] text-xs font-bold uppercase tracking-wide mb-2">
                {cs.sector}
              </span>
            )}
            <h2 className="font-sans text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-3 leading-snug">
              {cs.title}
            </h2>
            {cs.description && (
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-4 line-clamp-3">
                {cs.description}
              </p>
            )}
            <span className="text-[var(--brand-azure-vivid)] text-sm font-semibold inline-flex items-center gap-1">
              Read case study <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

function CaseStudyCard({ cs }: { cs: CaseStudyItem }) {
  return (
    <Link href={`/case-studies/${cs.slug}/`}>
      <Card className="group bg-background border border-border hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
        {cs.featuredImage && (
          <div className="h-44 overflow-hidden rounded-t-md relative">
            <Image
              src={cs.featuredImage}
              alt={cs.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          </div>
        )}
        <div className="p-5 flex flex-col flex-1">
          {cs.sector && (
            <span className="text-[var(--brand-azure-vivid)] text-[10px] font-bold uppercase tracking-wide mb-1">
              {cs.sector}
            </span>
          )}
          <h3 className="font-sans text-base font-bold text-foreground mb-2 leading-snug">{cs.title}</h3>
          {cs.description && (
            <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
              {cs.description}
            </p>
          )}
          <span className="text-[var(--brand-azure-vivid)] text-xs font-semibold inline-flex items-center gap-0.5 mt-auto">
            Read <ChevronRight className="w-3 h-3" />
          </span>
        </div>
      </Card>
    </Link>
  );
}

export function CaseStudiesIndex({ caseStudies }: { caseStudies: CaseStudyItem[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string | null>(null);

  const filteredStudies = useMemo(() => {
    let results = caseStudies;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (cs) =>
          cs.title.toLowerCase().includes(q) ||
          cs.description?.toLowerCase().includes(q) ||
          cs.sector?.toLowerCase().includes(q)
      );
    }
    if (selectedSector) results = results.filter((cs) => cs.sector === selectedSector);
    return results;
  }, [caseStudies, searchQuery, selectedSector]);

  const featuredStudy = caseStudies[0];
  const hasActiveFilters = searchQuery || selectedSector;
  const gridStudies = hasActiveFilters
    ? filteredStudies
    : filteredStudies.filter((cs) => cs.slug !== featuredStudy?.slug);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSector(null);
  };

  const sectorCounts = useMemo(
    () =>
      SECTORS.reduce<Record<string, number>>((acc, s) => {
        acc[s] = caseStudies.filter((cs) => cs.sector === s).length;
        return acc;
      }, {}),
    [caseStudies]
  );

  return (
    <>
      {/* Hero */}
      <section
        className="py-12 sm:py-16"
        style={{ background: 'linear-gradient(135deg, var(--brand-hero-from), var(--brand-hero-to))' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
              Case Studies
            </h1>
            <p className="text-[var(--brand-azure-light)] text-base sm:text-lg leading-relaxed mb-8">
              Real examples of how Psychology Direct helps schools, local authorities, and legal professionals
              get the right expert at the right time.
            </p>
            <div className="max-w-lg mx-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <Input
                type="search"
                placeholder="Search case studies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 h-12 text-base"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sector filter bar */}
      <section className="py-4 border-b bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              size="sm"
              variant={selectedSector === null ? 'default' : 'secondary'}
              onClick={() => setSelectedSector(null)}
              className={selectedSector === null ? 'text-white' : ''}
              style={selectedSector === null ? { background: 'var(--brand-navy)' } : undefined}
            >
              All
            </Button>
            {SECTORS.map((sector) => (
              <Button
                key={sector}
                size="sm"
                variant={selectedSector === sector ? 'default' : 'secondary'}
                onClick={() => setSelectedSector(selectedSector === sector ? null : sector)}
                className={selectedSector === sector ? 'text-white' : ''}
                style={selectedSector === sector ? { background: 'var(--brand-navy)' } : undefined}
              >
                {sector}
                <span className="ml-1 text-xs opacity-70">({sectorCounts[sector] ?? 0})</span>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {hasActiveFilters && (
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="text-sm text-muted-foreground">Showing results for:</span>
            {searchQuery && (
              <Badge variant="secondary" className="gap-1">
                &ldquo;{searchQuery}&rdquo;
                <button onClick={() => setSearchQuery('')} aria-label="Clear search">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {selectedSector && (
              <Badge variant="secondary" className="gap-1">
                {selectedSector}
                <button onClick={() => setSelectedSector(null)} aria-label="Clear sector">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            <button
              onClick={clearFilters}
              className="text-xs font-semibold ml-2"
              style={{ color: 'var(--brand-azure-vivid)' }}
            >
              Clear all
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12">
          {/* Main column */}
          <div className="flex-1 min-w-0">
            {!hasActiveFilters && featuredStudy && (
              <div className="mb-10">
                <h2
                  className="font-sans text-sm font-bold uppercase tracking-wide mb-4"
                  style={{ color: 'var(--brand-azure-vivid)' }}
                >
                  Featured Case Study
                </h2>
                <CaseStudyCardLarge cs={featuredStudy} />
              </div>
            )}

            {filteredStudies.length === 0 ? (
              <div className="text-center py-16">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-sans text-lg font-bold text-foreground mb-2">No case studies found</h3>
                <p className="text-muted-foreground text-sm mb-4">Try adjusting your filters.</p>
                <Button variant="secondary" onClick={clearFilters}>
                  Clear filters
                </Button>
              </div>
            ) : (
              <div>
                <h2
                  className="font-sans text-sm font-bold uppercase tracking-wide mb-4"
                  style={{ color: 'var(--brand-azure-vivid)' }}
                >
                  {hasActiveFilters
                    ? `${filteredStudies.length} Case ${filteredStudies.length !== 1 ? 'Studies' : 'Study'} Found`
                    : 'All Case Studies'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {gridStudies.map((cs) => (
                    <CaseStudyCard key={cs.slug} cs={cs} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:w-72 xl:w-80 flex-shrink-0 space-y-6">
            <div className="lg:sticky lg:top-24 space-y-6">

              {/* Primary CTA */}
              <div className="rounded-xl p-6" style={{ background: 'var(--brand-navy)' }}>
                <h3 className="font-sans text-base font-bold text-white mb-2">Need an Expert?</h3>
                <p className="text-white/70 text-sm leading-relaxed mb-4">
                  Get matched with the right psychologist or psychiatrist within 24 hours.
                </p>
                <Button
                  asChild
                  size="sm"
                  className="w-full font-semibold"
                  style={{ background: 'var(--brand-azure)', color: 'var(--brand-navy)' }}
                >
                  <Link href="/contact/">
                    Get in Touch <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
                <div className="flex flex-col gap-2 mt-4">
                  <a
                    href="tel:01306879975"
                    className="flex items-center gap-2 text-white/80 hover:text-white text-xs transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" /> 01306 879 975
                  </a>
                  <a
                    href="mailto:enquiries@psychologydirect.co.uk"
                    className="flex items-center gap-2 text-white/80 hover:text-white text-xs transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" /> enquiries@psychologydirect.co.uk
                  </a>
                </div>
              </div>

              {/* Why choose us */}
              <div className="rounded-xl border border-border p-5">
                <h3
                  className="font-sans text-sm font-bold mb-3"
                  style={{ color: 'var(--brand-navy)' }}
                >
                  Why Choose Us
                </h3>
                <ul className="space-y-2.5">
                  {SELLING_POINTS.map((point) => (
                    <li key={point} className="flex gap-2 items-start text-xs">
                      <CheckCircle2
                        className="w-3.5 h-3.5 mt-0.5 shrink-0"
                        style={{ color: 'var(--brand-azure-vivid)' }}
                      />
                      <span className="text-muted-foreground">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sector links */}
              <div className="rounded-xl p-5" style={{ background: 'var(--brand-bg-tint)' }}>
                <h3
                  className="font-sans text-sm font-bold mb-3"
                  style={{ color: 'var(--brand-navy)' }}
                >
                  Browse by Sector
                </h3>
                <div className="space-y-2">
                  {SECTORS.map((sector) => (
                    <button
                      key={sector}
                      onClick={() => setSelectedSector(selectedSector === sector ? null : sector)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors text-left"
                      style={
                        selectedSector === sector
                          ? { background: 'var(--brand-azure-vivid)', color: 'white' }
                          : { color: 'var(--brand-navy)' }
                      }
                    >
                      <span>{sector}</span>
                      <span className="text-xs opacity-70">{sectorCounts[sector] ?? 0}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Useful tools */}
              <div className="rounded-xl border border-border p-5">
                <h3
                  className="font-sans text-sm font-bold mb-3"
                  style={{ color: 'var(--brand-navy)' }}
                >
                  Useful Tools
                </h3>
                <div className="space-y-3">
                  {TOOLS.map((tool) => (
                    <Link key={tool.href} href={tool.href} className="block group">
                      <div
                        className="text-sm font-semibold group-hover:underline"
                        style={{ color: 'var(--brand-azure-vivid)' }}
                      >
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
      </div>
    </>
  );
}
