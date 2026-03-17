'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { parseItalic } from '@/lib/parseItalic';
import { useBasket } from '@/lib/basket';

interface HeroButtonData {
  text?: string;
  action?: 'link' | 'add-to-basket';
  url?: string;
  productId?: string;
}

interface HeroProps {
  data: {
    eyebrow?: string;
    headline?: string;
    subtitle?: string;
    image?: string;
    primaryButtonText?: string;
    primaryButtonAction?: 'link' | 'add-to-basket';
    primaryButtonUrl?: string;
    primaryButtonProductId?: string;
    secondaryButtonText?: string;
    secondaryButtonAction?: 'link' | 'add-to-basket';
    secondaryButtonUrl?: string;
    secondaryButtonProductId?: string;
    theme?: 'off-white' | 'green' | 'grey' | 'terracotta';
  };
}

interface Product {
  id: string;
  name: string;
  price: number;
}

function HeroButton({ text, action, url, productId, className }: HeroButtonData & { className: string }) {
  const { addItem } = useBasket();
  const [product, setProduct] = useState<Product | null>(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (action === 'add-to-basket' && productId) {
      fetch('/api/products')
        .then(r => r.json())
        .then(d => {
          const found = (d.products || []).find((p: Product) => p.id === productId);
          if (found) setProduct(found);
        })
        .catch(() => {});
    }
  }, [action, productId]);

  if (action === 'add-to-basket') {
    const handleAdd = () => {
      if (!product) return;
      addItem({ productId: product.id, name: product.name, price: product.price });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    };

    return (
      <button className={className} onClick={handleAdd} disabled={!product}>
        {added ? 'Added ✓' : text}
      </button>
    );
  }

  // Default: link
  if (!url) return null;
  return (
    <Link href={url} className={className}>
      {text}
    </Link>
  );
}

export const Hero = ({ data }: HeroProps) => {
  const themeClasses = {
    'off-white': 'theme-light section-mineral-white',
    'green': 'theme-dark section-deep-green',
    'grey': 'theme-light section-warm-stone',
    'terracotta': 'theme-dark section-terracotta'
  };

  const currentThemeClass = data.theme ? themeClasses[data.theme] : themeClasses['green'];

  const isDark = data.theme === 'green' || data.theme === 'terracotta' || !data.theme;
  // Use CSS custom property for dynamic image, keep gradient in CSS class
  const bgStyle = data.image ? {
    ['--hero-bg-image' as string]: `url('${data.image}')`
  } : {};

  const hasPrimary = data.primaryButtonText && (data.primaryButtonUrl || data.primaryButtonProductId);
  const hasSecondary = data.secondaryButtonText && (data.secondaryButtonUrl || data.secondaryButtonProductId);

  return (
    <header
      className={`hero-header ${currentThemeClass} ${data.image ? 'hero-has-bg-image' : ''}`}
      style={bgStyle}
      data-hero-dark={isDark ? 'true' : undefined}
    >
      <div className="hero-content">
        {data.eyebrow && <span className="hero-eyebrow">{data.eyebrow}</span>}
        {data.headline && <h1 className="hero-title">{parseItalic(data.headline)}</h1>}
        {data.subtitle && <p className="hero-subtitle">{data.subtitle}</p>}

        {(hasPrimary || hasSecondary) && (
          <div className="hero-actions">
            {hasPrimary && (
              <HeroButton
                text={data.primaryButtonText}
                action={data.primaryButtonAction || 'link'}
                url={data.primaryButtonUrl}
                productId={data.primaryButtonProductId}
                className="btn btn-primary btn-lg"
              />
            )}
            {hasSecondary && (
              <HeroButton
                text={data.secondaryButtonText}
                action={data.secondaryButtonAction || 'link'}
                url={data.secondaryButtonUrl}
                productId={data.secondaryButtonProductId}
                className="btn btn-secondary btn-lg"
              />
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Hero;
