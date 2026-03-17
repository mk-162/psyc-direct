import React from 'react';

interface IncludedGridData {
  eyebrow?: string;
  heading?: string;
  theme?: 'off-white' | 'green' | 'grey' | 'terracotta';
  categories?: Array<{ title: string; items?: string[] }>;
}

export const IncludedGrid = ({ data }: { data: IncludedGridData }) => {
  const themeClass = data.theme === 'green' ? 'section-deep-green theme-dark'
    : data.theme === 'grey' ? 'section-warm-stone theme-light'
    : data.theme === 'terracotta' ? 'section-terracotta theme-dark'
    : 'section-mineral-white theme-light';

  return (
    <section className={`section-editorial section-bleed ${themeClass}`}>
      <div className="container-wide">
        {(data.eyebrow || data.heading) && (
          <div className="included-grid-header">
            {data.eyebrow && <div className="eyebrow">{data.eyebrow}</div>}
            {data.heading && <h2 className="heading-display-lg">{data.heading}</h2>}
          </div>
        )}
        {data.categories && data.categories.length > 0 && (
          <div className="included-grid-columns">
            {data.categories.map((cat, i) => (
              <div key={i}>
                <h3 className="included-category-title">{cat.title}</h3>
                {cat.items && cat.items.length > 0 && (
                  <ul className="included-list">
                    {cat.items.map((item, j) => (
                      <li key={j} className="included-list-item">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
