import React from 'react';
import { parseItalic } from '@/lib/parseItalic';

interface PersonaCardsData {
  eyebrow?: string;
  heading?: string;
  theme?: 'off-white' | 'green' | 'grey' | 'terracotta';
  cards?: Array<{ title: string; description: string }>;
}

export const PersonaCards = ({ data }: { data: PersonaCardsData }) => {
  const themeClass = data.theme === 'green' ? 'section-deep-green theme-dark'
    : data.theme === 'grey' ? 'section-warm-stone theme-light'
    : data.theme === 'terracotta' ? 'section-terracotta theme-dark'
    : 'section-mineral-white theme-light';

  return (
    <section className={`section-editorial section-bleed ${themeClass}`}>
      <div className="container-wide">
        {(data.eyebrow || data.heading) && (
          <div className="persona-header">
            {data.eyebrow && <div className="eyebrow">{data.eyebrow}</div>}
            {data.heading && <h2 className="heading-display-lg">{parseItalic(data.heading)}</h2>}
          </div>
        )}
        {data.cards && data.cards.length > 0 && (
          <div className={`persona-grid ${[2, 4].includes(data.cards!.length) ? 'grid-cols-2' : 'grid-cols-3'}`}>
            {data.cards.map((card, i) => (
              <div key={i} className="persona-card">
                <h3 className="persona-card-title">{card.title}</h3>
                <p className="persona-card-desc">{card.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
