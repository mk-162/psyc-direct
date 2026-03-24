import { ChevronRight } from 'lucide-react';

/** Human-readable labels for URL segments */
const segmentLabels: Record<string, string> = {
  'expert-witness-psychologists': 'Expert Witness',
  'educational-psychologist': 'Education',
  'about': 'About',
  'case-studies': 'Case Studies',
  'resources': 'Resources',
  'tools': 'Tools',
  'news': 'News',
  'faqs': 'FAQs',
  'contact': 'Contact',
  'utility': 'Legal',
  // Sub-page slugs
  'family': 'Family Law',
  'criminal': 'Criminal Law',
  'civil-personal-injury': 'Personal Injury & Civil',
  'clinical-negligence': 'Clinical Negligence',
  'employment': 'Employment',
  'asylum-immigration': 'Immigration & Asylum',
  'prison-law': 'Prison Law',
  'pricing': 'Pricing',
  'process': 'Our Process',
  'schools-academies-colleges': 'Schools & Academies',
  'local-authorities': 'Local Authorities',
  'mats': 'Multi-Academy Trusts',
  'higher-education': 'Higher Education',
  'ehcp-assessments': 'EHCP Assessments',
  'specialist-assessments': 'Specialist Assessments',
  'meet-the-team': 'Meet the Team',
  'quality-assurance': 'Quality Assurance',
  'testimonials': 'Testimonials',
  'training': 'Training',
  'careers': 'Careers',
  'events': 'Events',
  'how-we-work': 'How We Work',
  'privacy-policy': 'Privacy Policy',
  'terms-conditions': 'Terms & Conditions',
  'cookie-policy': 'Cookie Policy',
  'accessibility': 'Accessibility',
  'complaints-policy': 'Complaints Policy',
  'fee-calculator': 'Fee Calculator',
  'psychologist-or-psychiatrist': 'Psychologist or Psychiatrist?',
  'suitability-checker': 'Suitability Checker',
};

function labelFor(segment: string): string {
  return segmentLabels[segment] || segment.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

interface BreadcrumbProps {
  path: string;
}

export function Breadcrumb({ path }: BreadcrumbProps) {
  // Don't show on homepage
  if (!path || path === '/') return null;

  const segments = path.replace(/^\/|\/$/g, '').split('/');
  if (segments.length === 0 || (segments.length === 1 && !segments[0])) return null;

  // Build crumb chain: Home → Section → Sub-page
  const crumbs: { label: string; href: string }[] = [
    { label: 'Home', href: '/' },
  ];

  let accumulated = '';
  for (const seg of segments) {
    accumulated += `/${seg}`;
    crumbs.push({ label: labelFor(seg), href: `${accumulated}/` });
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className="px-4 sm:px-6 lg:px-8 py-2 bg-[var(--brand-bg-tint)] border-b border-border"
    >
      <div className="max-w-7xl mx-auto">
        <ol className="flex items-center gap-1 text-xs text-muted-foreground overflow-x-auto">
          {crumbs.map((crumb, i) => {
            const isLast = i === crumbs.length - 1;
            return (
              <li key={crumb.href} className="flex items-center gap-1 whitespace-nowrap">
                {i > 0 && <ChevronRight aria-hidden="true" className="w-3 h-3 flex-shrink-0 opacity-40" />}
                {isLast ? (
                  <span aria-current="page" className="font-medium text-foreground">
                    {crumb.label}
                  </span>
                ) : (
                  <a href={crumb.href} className="hover:text-foreground transition-colors">
                    {crumb.label}
                  </a>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
