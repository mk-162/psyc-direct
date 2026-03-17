import React from 'react';
import Link from 'next/link';

interface EditorialMosaicProps {
  data: {
    headline: string;
    content: string;
    heroImage: string;
    sideImages: {
      image: string;
      alt?: string;
    }[];
    featureText?: string;
    theme?: 'off-white' | 'green' | 'grey' | 'terracotta';
  };
}

export const EditorialMosaic = ({ data }: EditorialMosaicProps) => {
  // Map themes to CSS background classes
  const themeClasses = {
    'off-white': 'section-mineral-white theme-light',
    'green': 'section-deep-green theme-dark',
    'grey': 'section-warm-stone theme-light',
    'terracotta': 'section-terracotta theme-dark'
  };

  const currentThemeClass = data.theme ? themeClasses[data.theme] : themeClasses['off-white'];

  return (
    <section className={`ds-section section-bleed editorial-mosaic-section ${currentThemeClass}`}>
      <div className="ds-container">
        
        {/* Top Hero Headline (A Personal Sanctuary style) */}
        <h2 className="editorial-mosaic-headline">
          {data.headline}
        </h2>

        {/* Full width hero image below headline */}
        <div className="editorial-mosaic-hero">
          <img 
            src={data.heroImage} 
            alt="Hero section" 
          />
        </div>

        {/* Bottom split content (Text left, Masonry right) */}
        <div className="editorial-mosaic-split">
          
          {/* Left Text Column */}
          <div className="editorial-mosaic-text">
            <div dangerouslySetInnerHTML={{ __html: data.content }} />
            
            {/* Small inset image below text if 3 images are provided */}
            {data.sideImages && data.sideImages.length > 1 && (
              <div className="editorial-mosaic-inset-image">
                <img 
                  src={data.sideImages[1].image} 
                  alt={data.sideImages[1].alt || ''} 
                />
              </div>
            )}
          </div>

          {/* Right Image/Feature Column */}
          <div>
            {/* Main side image */}
            {data.sideImages && data.sideImages.length > 0 && (
              <div className="editorial-mosaic-side-main">
                <img 
                  src={data.sideImages[0].image} 
                  alt={data.sideImages[0].alt || ''} 
                />
              </div>
            )}

            {/* Feature large text below image */}
            {data.featureText && (
              <h3 className="editorial-mosaic-feature">
                {data.featureText}
              </h3>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};