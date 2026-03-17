import React from 'react';
import { parseItalic } from '@/lib/parseItalic';

interface DarkCtaData {
  eyebrow?: string;
  heading?: string;
  body?: string;
  bodyText?: string;
  primaryButtonText?: string;
  primaryButtonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  theme?: 'off-white' | 'green' | 'grey' | 'terracotta';
}

export const DarkCta = ({ data }: { data: DarkCtaData }) => {
  const themeClass = data.theme === 'green' ? 'section-deep-green theme-dark'
    : data.theme === 'grey' ? 'section-warm-stone theme-light'
    : data.theme === 'terracotta' ? 'section-terracotta theme-dark'
    : 'section-mineral-white theme-light';

  return (
    <section className={`section-editorial section-bleed ${themeClass}`}>
      <div className="dark-cta-content">
        {data.eyebrow && <div className="eyebrow-light">{data.eyebrow}</div>}
        {data.heading && <h2 className="heading-display-dark">{parseItalic(data.heading)}</h2>}
        {data.bodyText && <p className="body-editorial-dark">{data.bodyText}</p>}
        <div className="dark-cta-buttons">
          {data.primaryButtonText && data.primaryButtonUrl && (
            <a href={data.primaryButtonUrl} className="ds-btn ds-btn-primary">{data.primaryButtonText}</a>
          )}
          {data.secondaryButtonText && data.secondaryButtonUrl && (
            <a href={data.secondaryButtonUrl} className="ds-btn ds-btn-secondary">
              {data.secondaryButtonText}
            </a>
          )}
        </div>
      </div>
    </section>
  );
};
