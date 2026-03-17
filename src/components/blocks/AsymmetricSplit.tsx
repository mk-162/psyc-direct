import React from 'react';

interface AsymmetricSplitData {
  eyebrow?: string;
  heading?: string;
  body?: string;
  bodyText?: string;
  image?: string;
  buttonText?: string;
  buttonUrl?: string;
  mediaPosition?: 'left' | 'right';
  theme?: 'off-white' | 'green' | 'grey' | 'terracotta';
}

export const AsymmetricSplit = ({ data }: { data: AsymmetricSplitData }) => {
  const themeClass = data.theme === 'green' ? 'section-deep-green theme-dark'
    : data.theme === 'grey' ? 'section-warm-stone theme-light'
    : data.theme === 'terracotta' ? 'section-terracotta theme-dark'
    : 'section-mineral-white theme-light';

  const mediaLeft = data.mediaPosition === 'left';

  return (
    <section className={`section-editorial section-bleed ${themeClass}`}>
      <div className={`grid-asymmetric${mediaLeft ? '' : '-wide'}`}>
        <div className={mediaLeft ? 'order-2' : ''}>
          {data.eyebrow && <div className="eyebrow">{data.eyebrow}</div>}
          {data.heading && <h2 className="heading-display-lg">{data.heading}</h2>}
          {data.bodyText && <p className="body-editorial mb-4">{data.bodyText}</p>}
          {data.buttonText && data.buttonUrl && (
            <a href={data.buttonUrl} className="ds-btn ds-btn-primary">{data.buttonText}</a>
          )}
        </div>
        {data.image && (
          <div className={`grid-asymmetric-image${mediaLeft ? ' order-1' : ''}`}>
            <img src={data.image} alt="" />
          </div>
        )}
      </div>
    </section>
  );
};
