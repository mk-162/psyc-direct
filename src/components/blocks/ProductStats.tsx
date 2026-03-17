import React from 'react';
import { parseItalic } from '@/lib/parseItalic';

interface ProductStatsData {
  eyebrow?: string;
  heading?: string;
  description?: string;
  stats?: Array<{ value: string; label: string }>;
  buttonText?: string;
  buttonUrl?: string;
  image?: string;
  theme?: 'off-white' | 'green' | 'grey' | 'terracotta';
}

export const ProductStats = ({ data }: { data: ProductStatsData }) => {
  const themeClass = data.theme === 'green' ? 'section-deep-green theme-dark'
    : data.theme === 'grey' ? 'section-warm-stone theme-light'
    : data.theme === 'terracotta' ? 'section-terracotta theme-dark'
    : 'section-mineral-white theme-light';

  return (
    <section className={`section-editorial section-bleed ${themeClass}`}>
      <div className="ds-container">
      <div className={`product-stats-grid${data.image ? ' product-stats-grid--with-image' : ''}`}>
        <div>
          {data.eyebrow && <div className="eyebrow">{data.eyebrow}</div>}
          {data.heading && <h2 className="heading-display-lg">{parseItalic(data.heading)}</h2>}
          {data.description && <p className="body-editorial mb-4">{data.description}</p>}
          {data.stats && data.stats.length > 0 && (
            <div className="product-stats">
              {data.stats.map((stat, i) => (
                <div key={i}>
                  <div className="product-stat-value">{stat.value}</div>
                  <div className="product-stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
          {data.buttonText && data.buttonUrl && (
            <a href={data.buttonUrl} className="ds-btn ds-btn-primary">{data.buttonText}</a>
          )}
        </div>
        {data.image && (
          <div className="product-stats-image">
            <img src={data.image} alt="" />
          </div>
        )}
      </div>
      </div>
    </section>
  );
};
