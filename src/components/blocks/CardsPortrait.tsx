import React from 'react';
import { parseItalic } from '@/lib/parseItalic';

interface CardsPortraitData {
  eyebrow?: string;
  heading?: string;
  theme?: 'off-white' | 'green' | 'grey' | 'terracotta';
  cards?: Array<{ image?: string; label?: string; title: string; description?: string }>;
}

export const CardsPortrait = ({ data }: { data: CardsPortraitData }) => {
  const themeClass = data.theme === 'green' ? 'section-deep-green theme-dark'
    : data.theme === 'grey' ? 'section-warm-stone theme-light'
    : data.theme === 'terracotta' ? 'section-terracotta theme-dark'
    : 'section-mineral-white theme-light';

  return (
    <section className={`section-editorial section-bleed ${themeClass}`}>
      <div className="container-wide">
        {(data.eyebrow || data.heading) && (
          <div className="section-intro">
            {data.eyebrow && <div className="eyebrow">{data.eyebrow}</div>}
            {data.heading && <h2 className="heading-display-lg">{parseItalic(data.heading)}</h2>}
          </div>
        )}
        {data.cards && data.cards.length > 0 && (
          <div className={`cards-portrait-grid ${[2, 4].includes(data.cards!.length) ? 'grid-cols-2' : 'grid-cols-3'}`}>
            {data.cards.map((card, i) => (
              <div key={i} className="card-portrait">
                {card.image && (
                  <div className="card-portrait-image">
                    <img src={card.image} alt={card.title} />
                  </div>
                )}
                {card.label && <div className="card-portrait-label">{card.label}</div>}
                <h3 className="card-portrait-title">{card.title}</h3>
                {card.description && <p className="card-portrait-desc">{card.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
