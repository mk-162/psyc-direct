import React from 'react';

interface HeroImmersiveData {
  eyebrow?: string;
  headline?: string;
  subtitle?: string;
  image?: string;
  discoverText?: string;
  discoverUrl?: string;
  theme?: 'off-white' | 'green' | 'grey' | 'terracotta';
}

export const HeroImmersive = ({ data }: { data: HeroImmersiveData }) => {
  const themeClass = data.theme === 'green' ? 'section-deep-green theme-dark'
    : data.theme === 'grey' ? 'section-warm-stone theme-light'
    : data.theme === 'terracotta' ? 'section-terracotta theme-dark'
    : 'section-mineral-white theme-light';

  return (
    <section className={`hero-immersive section-bleed ${themeClass}`}>
      {data.image && (
        <>
          <img src={data.image} alt="" className="hero-immersive-image" />
          <div className="hero-immersive-overlay" />
        </>
      )}
      <div className="hero-immersive-content">
        {data.eyebrow && <div className="eyebrow-hero">{data.eyebrow}</div>}
        {data.headline && <h1 className="heading-display-xl text-cream">{data.headline}</h1>}
        {data.subtitle && <p className="hero-immersive-body">{data.subtitle}</p>}
        {data.discoverText && data.discoverUrl && (
          <a href={data.discoverUrl} className="hero-discover-link">
            {data.discoverText}
          </a>
        )}
      </div>
    </section>
  );
};
