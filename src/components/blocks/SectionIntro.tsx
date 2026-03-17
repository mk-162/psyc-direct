import React from 'react';
import { parseItalic } from '@/lib/parseItalic';

interface SectionIntroData {
  eyebrow?: string;
  heading?: string;
  body?: string;
  bodyText?: string;
  theme?: 'off-white' | 'green' | 'grey' | 'terracotta';
}

export const SectionIntro = ({ data }: { data: SectionIntroData }) => {
  const themeClass = data.theme === 'green' ? 'section-deep-green theme-dark'
    : data.theme === 'grey' ? 'section-warm-stone theme-light'
    : data.theme === 'terracotta' ? 'section-terracotta theme-dark'
    : 'section-mineral-white theme-light';

  return (
    <section className={`section-editorial section-bleed ${themeClass}`}>
      <div className="section-intro-content">
        {data.eyebrow && <div className="eyebrow">{data.eyebrow}</div>}
        {data.heading && <h2 className="heading-display-lg">{parseItalic(data.heading)}</h2>}
        {data.bodyText && <p className="body-editorial">{data.bodyText}</p>}
      </div>
    </section>
  );
};
