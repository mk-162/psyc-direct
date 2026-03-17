'use client';

import Link from 'next/link';

export interface ServiceMatch {
  title: string;
  slug: string;
  description: string;
  matchedTags: string[];
}

interface ArticleSidebarProps {
  tags?: (string | null)[];
  relatedServices: ServiceMatch[];
  ctaHeading?: string;
  ctaText?: string;
  ctaButtonText?: string;
  ctaButtonHref?: string;
  ctaLinkText?: string;
  ctaLinkHref?: string;
}

export function ArticleSidebar({
  tags,
  relatedServices,
  ctaHeading = 'Take the next step',
  ctaText = 'Concerned about your health? Our expert team is here to help with personalised screening and advice.',
  ctaButtonText = 'Book a Consultation',
  ctaButtonHref = '/utility/contact',
  ctaLinkText = 'Browse all services →',
  ctaLinkHref = '/services',
}: ArticleSidebarProps) {
  const validTags = (tags || []).filter(Boolean) as string[];

  return (
    <aside className="article-sidebar">
      {/* Tags */}
      {validTags.length > 0 && (
        <div className="sidebar-block">
          <h4 className="sidebar-heading">Topics</h4>
          <div className="sidebar-tags">
            {validTags.map((tag, i) => (
              <span key={i} className="sidebar-tag">{tag}</span>
            ))}
          </div>
        </div>
      )}

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <div className="sidebar-block">
          <h4 className="sidebar-heading">Related Services</h4>
          <div className="sidebar-services">
            {relatedServices.map((service, i) => (
              <Link key={i} href={`/services/${service.slug}`} className="sidebar-service-card">
                <span className="sidebar-service-title">{service.title}</span>
                <span className="sidebar-service-desc">{service.description}</span>
                <span className="sidebar-service-tags">
                  {service.matchedTags.map((t, j) => (
                    <span key={j} className="sidebar-service-tag">{t}</span>
                  ))}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="sidebar-block sidebar-cta">
        <h4 className="sidebar-heading">{ctaHeading}</h4>
        <p className="sidebar-cta-text">{ctaText}</p>
        <Link href={ctaButtonHref} className="ds-btn ds-btn-primary sidebar-cta-btn">
          {ctaButtonText}
        </Link>
        <Link href={ctaLinkHref} className="sidebar-cta-link">
          {ctaLinkText}
        </Link>
      </div>
    </aside>
  );
}
