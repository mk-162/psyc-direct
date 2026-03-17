import React from 'react';

interface TestimonialData {
  quote?: string;
  authorName?: string;
  authorRole?: string;
  image?: string;
  theme?: 'off-white' | 'green' | 'grey' | 'terracotta';
}

export const Testimonial = ({ data }: { data: TestimonialData }) => {
  const themeClass = data.theme === 'green' ? 'section-deep-green theme-dark'
    : data.theme === 'grey' ? 'section-warm-stone theme-light'
    : data.theme === 'terracotta' ? 'section-terracotta theme-dark'
    : 'section-mineral-white theme-light';

  return (
    <section className={`section-editorial section-bleed ${themeClass}`}>
      <div className="testimonial-content">
        {data.quote && (
          <blockquote className="testimonial-blockquote">
            &ldquo;{data.quote}&rdquo;
          </blockquote>
        )}
        <div className="testimonial-attribution">
          {data.image && (
            <img src={data.image} alt={data.authorName || ''} className="testimonial-avatar" />
          )}
          <div className="testimonial-meta">
            {data.authorName && <div className="testimonial-name">{data.authorName}</div>}
            {data.authorRole && <div className="testimonial-role">{data.authorRole}</div>}
          </div>
        </div>
      </div>
    </section>
  );
};
