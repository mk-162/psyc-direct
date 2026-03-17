import React from 'react';
import Link from 'next/link';

interface FeaturedLinksData {
  theme?: 'off-white' | 'green' | 'grey' | 'terracotta';
  cards?: Array<{
    eyebrow?: string;
    label?: string;
    title?: string;
    description: string;
    ctaText?: string;
    url: string;
  }>;
  links?: Array<{
    eyebrow?: string;
    title?: string;
    description: string;
    ctaText?: string;
    url: string;
  }>;
}

export const FeaturedLinks = ({ data }: { data: FeaturedLinksData }) => {
  const themeClass = data.theme === 'green' ? 'section-deep-green theme-dark'
    : data.theme === 'grey' ? 'section-warm-stone theme-light'
    : data.theme === 'terracotta' ? 'section-terracotta theme-dark'
    : 'section-mineral-white theme-light';

  return (
    <section className={`ds-section section-bleed ${themeClass}`}>
      <div className="ds-container">
        <div className="featured-link">
          {(data.cards || data.links || []).map((link, i) => {
            const title = String(('label' in link && (link as any).label) ? (link as any).label : (link as any).title || '');
            return (
            <Link key={i} href={link.url} className="featured-link-card">
              {link.eyebrow && <div className="eyebrow">{link.eyebrow}</div>}
              <h3 className="featured-link-title">{title}</h3>
              <p className="featured-link-desc">{link.description}</p>
              <span className="featured-link-cta">{link.ctaText || 'Explore'} →</span>
            </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
