import React from 'react';
import { TinaMarkdown } from "tinacms/dist/rich-text";

interface ContentWithMediaProps {
  data: {
    headline?: string;
    content?: any;
    image?: string;
    imagePosition?: 'left' | 'right';
    theme?: 'off-white' | 'green' | 'grey' | 'terracotta';
  };
}

export const ContentWithMedia = ({ data }: ContentWithMediaProps) => {
  const themeClasses = {
    'off-white': 'theme-light section-mineral-white',
    'green': 'theme-dark section-deep-green',
    'grey': 'theme-light section-warm-stone',
    'terracotta': 'theme-dark section-terracotta'
  };

  const currentThemeClass = data.theme ? themeClasses[data.theme] : themeClasses['off-white'];
  const isImageRight = data.imagePosition === 'right' || !data.imagePosition;

  return (
    <section className={`ds-section section-bleed ${currentThemeClass}`}>
      <div className="ds-container">
        {/* We use CSS grid via globals.css or inline flex layout classes */}
        <div className={`content-media-grid ${isImageRight ? 'media-right' : 'media-left'}`}>
          {/* Content Side */}
          <div className="content-side">
            {data.headline && <h2 className="ds-section-title">{data.headline}</h2>}
            <div className="ds-section-description">
              {data.content && <TinaMarkdown content={data.content} />}
            </div>
          </div>
          
          {/* Media Side */}
          {data.image && (
            <div className="media-side">
              <img src={data.image} alt={data.headline || 'Media content'} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContentWithMedia;
