import React from 'react';

interface TimelineData {
  eyebrow?: string;
  heading?: string;
  theme?: 'off-white' | 'green' | 'grey' | 'terracotta';
  steps?: Array<{ number: string; title: string; description: string }>;
}

export const Timeline = ({ data }: { data: TimelineData }) => {
  const themeClass = data.theme === 'green' ? 'section-deep-green theme-dark'
    : data.theme === 'grey' ? 'section-warm-stone theme-light'
    : data.theme === 'terracotta' ? 'section-terracotta theme-dark'
    : 'section-mineral-white theme-light';

  return (
    <section className={`section-editorial section-bleed ${themeClass}`}>
      <div className="timeline-container">
        {(data.eyebrow || data.heading) && (
          <div className="timeline-header">
            {data.eyebrow && <div className="eyebrow">{data.eyebrow}</div>}
            {data.heading && <h2 className="heading-display-lg">{data.heading}</h2>}
          </div>
        )}
        {data.steps && data.steps.length > 0 && (
          <div className="timeline-steps">
            <div className="timeline-line" />
            {data.steps.map((step, i) => (
              <div key={i} className="timeline-step">
                <div className="timeline-step-number">{step.number}</div>
                <h3 className="timeline-step-title">{step.title}</h3>
                <p className="timeline-step-desc">{step.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
