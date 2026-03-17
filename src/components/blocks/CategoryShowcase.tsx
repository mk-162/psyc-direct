import React from 'react';
import Link from 'next/link';

interface CategoryShowcaseData {
  eyebrow?: string;
  heading?: string;
  theme?: 'off-white' | 'green' | 'grey' | 'terracotta';
  items?: Array<{
    icon: string;
    label: string;
    description: string;
    count?: string;
    url: string;
  }>;
  // Legacy support
  categories?: Array<{
    icon: string;
    title: string;
    description: string;
    count?: string;
    url: string;
  }>;
}

export const CategoryShowcase = ({ data }: { data: CategoryShowcaseData }) => {
  const themeClass = data.theme === 'green' ? 'section-deep-green theme-dark'
    : data.theme === 'grey' ? 'section-warm-stone theme-light'
    : data.theme === 'terracotta' ? 'section-terracotta theme-dark'
    : 'section-mineral-white theme-light';

  return (
    <section className={`ds-section section-bleed ${themeClass}`}>
      <div className="ds-container">
        {(data.eyebrow || data.heading) && (
          <div className="section-header-center">
            {data.eyebrow && <div className="eyebrow">{data.eyebrow}</div>}
            {data.heading && <h2 className="heading-display-lg">{data.heading}</h2>}
          </div>
        )}
        <div className="category-showcase">
          {(data.items || data.categories || []).map((cat, i) => {
            const title = String(('label' in cat && (cat as any).label) ? (cat as any).label : ('title' in cat ? (cat as any).title : ''));
            return (
            <Link key={i} href={cat.url} className="category-card">
              <span className="category-card-arrow">→</span>
              <div className="category-card-icon">{cat.icon}</div>
              <h3 className="category-card-title">{title}</h3>
              <p className="category-card-desc">{cat.description}</p>
              {cat.count && <p className="category-card-count">{cat.count}</p>}
            </Link>
          );
          })}
        </div>
      </div>
    </section>
  );
};
