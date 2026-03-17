import React from 'react';
import Link from 'next/link';
import { parseItalic } from '@/lib/parseItalic';

interface EditorialGridProps {
  data: {
    eyebrow?: string;
    headline?: string;
    items: {
      image: string;
      title: string;
      description: string;
      linkText?: string;
      linkUrl?: string;
    }[];
    theme?: 'off-white' | 'green' | 'grey' | 'terracotta';
  };
}

export const EditorialGrid = ({ data }: EditorialGridProps) => {
  // Map themes to CSS background classes
  const themeClasses = {
    'off-white': 'section-mineral-white theme-light',
    'green': 'section-deep-green theme-dark',
    'grey': 'section-warm-stone theme-light',
    'terracotta': 'section-terracotta theme-dark'
  };

  const currentThemeClass = data.theme ? themeClasses[data.theme] : themeClasses['off-white'];

  return (
    <section className={`ds-section section-bleed editorial-grid-section ${currentThemeClass}`}>
      <div className="ds-container">
        
        {/* Optional Header Section */}
        {(data.eyebrow || data.headline) && (
          <div className="editorial-grid-header">
            {data.eyebrow && (
              <span className="editorial-grid-eyebrow">
                {data.eyebrow}
              </span>
            )}
            {data.headline && (
              <h2 className="editorial-grid-headline">
                {parseItalic(data.headline)}
              </h2>
            )}
          </div>
        )}

        {/* The 3-Column Grid */}
        <div className="editorial-grid">
          {data.items && data.items.map((item, index) => (
            <div key={index} className="editorial-card">
              
              {/* Image Container - Fixed Aspect Ratio */}
              <div className="editorial-card-image">
                <img 
                  src={item.image} 
                  alt={item.title} 
                />
              </div>

              {/* Card Content */}
              <h3 className="editorial-card-tag">
                {item.title}
              </h3>
              
              <p className="editorial-card-desc">
                {item.description}
              </p>

              {item.linkText && item.linkUrl && (
                <Link href={item.linkUrl} className="editorial-card-link">
                  {item.linkText}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};