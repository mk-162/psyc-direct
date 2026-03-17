import React from 'react';
import Link from 'next/link';

interface LinkDirectoryData {
  sectionTitle?: string;
  title?: string;
  viewAllText?: string;
  viewAllUrl?: string;
  compact?: boolean;
  theme?: 'off-white' | 'green' | 'grey' | 'terracotta';
  entries?: Array<{
    label?: string;
    title?: string;
    description?: string;
    url: string;
  }>;
  links?: Array<{
    title?: string;
    description?: string;
    url: string;
  }>;
}

export const LinkDirectory = ({ data }: { data: LinkDirectoryData }) => {
  const themeClass = data.theme === 'green' ? 'section-deep-green theme-dark'
    : data.theme === 'grey' ? 'section-warm-stone theme-light'
    : data.theme === 'terracotta' ? 'section-terracotta theme-dark'
    : 'section-mineral-white theme-light';

  return (
    <section className={`ds-section section-bleed ${themeClass}`}>
      <div className={`ds-container link-directory-section ${data.compact ? 'link-directory-compact' : ''}`}>
        <div className="link-directory-header">
          <h2 className="link-directory-title">{data.sectionTitle || data.title}</h2>
          {data.viewAllUrl && (
            <Link href={data.viewAllUrl} className="link-directory-viewall">
              {data.viewAllText || 'View All'} →
            </Link>
          )}
        </div>
        <div className="link-directory-grid">
          {(data.entries || data.links || []).map((link, i) => {
            const title = String(('label' in link && (link as any).label) ? (link as any).label : (link as any).title || '');
            return (
            <Link key={i} href={link.url} className="link-directory-item">
              <div className="link-directory-item-content">
                <span className="link-directory-item-title">{title}</span>
                {link.description && (
                  <span className="link-directory-item-desc">{link.description}</span>
                )}
              </div>
              <span className="link-directory-item-arrow">→</span>
            </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
