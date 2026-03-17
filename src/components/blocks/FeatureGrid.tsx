import React from 'react';

interface FeatureGridProps {
  data: {
    headline?: string;
    description?: string;
    features?: {
      title: string;
      description: string;
    }[];
    theme?: 'off-white' | 'green' | 'grey' | 'terracotta';
  };
}

export const FeatureGrid = ({ data }: FeatureGridProps) => {
  const themeClasses = {
    'off-white': 'theme-light section-mineral-white',
    'green': 'theme-dark section-deep-green',
    'grey': 'theme-light section-warm-stone',
    'terracotta': 'theme-dark section-terracotta'
  };

  const cardThemeClasses = {
    'off-white': 'card-surface',
    'green': 'card-deep',
    'grey': 'card-warm',
    'terracotta': 'card-sage'
  };

  const currentThemeClass = data.theme ? themeClasses[data.theme] : themeClasses['off-white'];
  const currentCardThemeClass = data.theme ? cardThemeClasses[data.theme] : cardThemeClasses['off-white'];

  return (
    <section className={`ds-section section-bleed ${currentThemeClass}`}>
      <div className="ds-container">
        {data.headline && <h2 className="ds-section-title">{data.headline}</h2>}
        {data.description && <p className="ds-section-description">{data.description}</p>}

        <div className="cards-grid">
          {data.features && data.features.map((feature, index) => (
            <div key={index} className={`card ${currentCardThemeClass}`}>
              <div className="card-content">
                <h3 className="card-title">{feature.title}</h3>
                <p className="card-description">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;
