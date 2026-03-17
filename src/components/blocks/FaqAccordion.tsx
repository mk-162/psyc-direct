'use client';

import React, { useState } from 'react';

interface FaqAccordionData {
  eyebrow?: string;
  heading?: string;
  theme?: 'off-white' | 'green' | 'grey' | 'terracotta';
  items?: Array<{ question: string; answer: string }>;
}

export const FaqAccordion = ({ data }: { data: FaqAccordionData }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const themeClass = data.theme === 'green' ? 'section-deep-green theme-dark'
    : data.theme === 'grey' ? 'section-warm-stone theme-light'
    : data.theme === 'terracotta' ? 'section-terracotta theme-dark'
    : 'section-mineral-white theme-light';

  return (
    <section className={`section-editorial section-bleed ${themeClass}`}>
      <div className="faq-container">
        {(data.eyebrow || data.heading) && (
          <div className="faq-header">
            {data.eyebrow && <div className="eyebrow">{data.eyebrow}</div>}
            {data.heading && <h2 className="heading-display-lg">{data.heading}</h2>}
          </div>
        )}
        {data.items && data.items.length > 0 && (
          <div>
            {data.items.map((item, i) => (
              <div key={i} className="faq-divider">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="faq-toggle"
                >
                  {item.question}
                  <span className={`faq-toggle-icon${openIndex === i ? ' faq-toggle-icon--open' : ''}`}>+</span>
                </button>
                {openIndex === i && (
                  <div className="faq-answer-body">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
