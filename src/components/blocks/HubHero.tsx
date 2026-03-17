import React from 'react';

interface HubHeroData {
  eyebrow?: string;
  headline: string;
  subtitle?: string;
  theme?: 'off-white' | 'green' | 'grey' | 'terracotta';
}

export const HubHero = ({ data }: { data: HubHeroData }) => {
  const themeClass = data.theme === 'green' ? 'section-deep-green theme-dark'
    : data.theme === 'grey' ? 'section-warm-stone theme-light'
    : data.theme === 'terracotta' ? 'section-terracotta theme-dark'
    : 'section-mineral-white theme-light';

  return (
    <section className={`ds-section section-bleed hub-hero ${themeClass}`}>
      <div className="ds-container">
        {data.eyebrow && <div className="eyebrow">{data.eyebrow}</div>}
        <h1 className="hub-hero-title">{data.headline}</h1>
        {data.subtitle && <p className="hub-hero-subtitle">{data.subtitle}</p>}
      </div>
    </section>
  );
};
