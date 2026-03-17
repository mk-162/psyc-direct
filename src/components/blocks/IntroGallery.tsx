import React from 'react';

interface IntroGalleryProps {
  data: {
    headline: string;
    description: string;
    galleryItems: {
      image: string;
      caption?: string;
    }[];
    theme?: 'off-white' | 'green' | 'grey' | 'terracotta';
  };
}

export const IntroGallery = ({ data }: IntroGalleryProps) => {
  // Map themes to CSS background classes
  const themeClasses = {
    'off-white': 'section-mineral-white theme-light',
    'green': 'section-deep-green theme-dark',
    'grey': 'section-warm-stone theme-light',
    'terracotta': 'section-terracotta theme-dark'
  };

  const currentThemeClass = data.theme ? themeClasses[data.theme] : themeClasses['off-white'];

  return (
    <section className={`ds-section section-bleed intro-gallery-section ${currentThemeClass}`}>
      <div className="ds-container">
        
        {/* Intro Text Area (Left-aligned, large serif) */}
        <div className="intro-gallery-header">
          <h2 className="intro-gallery-headline">
            {data.headline}
          </h2>
          {data.description && (
            <p className="intro-gallery-desc">
              {data.description}
            </p>
          )}
        </div>

        {/* Asymmetric Gallery */}
        <div className="intro-gallery-grid">
          {data.galleryItems && data.galleryItems.map((item, index) => {
            return (
              <div key={index} className="intro-gallery-item">
                <div className="intro-gallery-image">
                  <img 
                    src={item.image} 
                    alt={item.caption || `Gallery image ${index + 1}`} 
                  />
                </div>
                {item.caption && (
                  <span className="intro-gallery-caption">
                    {item.caption}
                  </span>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};