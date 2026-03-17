import React from 'react';
import Link from 'next/link';

interface SignatureFooterProps {
  data: {
    eyebrow?: string;
    headline?: string;
    buttonPrimaryText?: string;
    buttonPrimaryUrl?: string;
    buttonSecondaryText?: string;
    buttonSecondaryUrl?: string;
    theme?: 'off-white' | 'green' | 'grey' | 'terracotta';
  };
}

export const SignatureFooter = ({ data }: SignatureFooterProps) => {
  const themeClass = data.theme === 'green' ? 'section-deep-green theme-dark'
    : data.theme === 'terracotta' ? 'section-terracotta theme-dark'
    : data.theme === 'grey' ? 'section-warm-stone theme-light'
    : 'section-mineral-white theme-light';

  return (
    <section className={`ds-section section-bleed signature-footer ${themeClass}`}>
      <div className="ds-container signature-footer-content">
        
        {/* Eyebrow */}
        {data.eyebrow && (
          <span className="signature-eyebrow">
            {data.eyebrow}
          </span>
        )}

        {/* Script/Display Headline */}
        {data.headline && (
          <h2 className="signature-headline">
            {/* Simple parser to make text italic if wrapped in *asterisks* */}
            {data.headline.split('*').map((part, i) => 
              i % 2 === 1 ? <span key={i} className="italic">{part}</span> : part
            )}
          </h2>
        )}

        {/* Buttons Stacked */}
        <div className="signature-actions">
          {data.buttonPrimaryText && data.buttonPrimaryUrl && (
            <Link href={data.buttonPrimaryUrl} className="signature-btn signature-btn-primary">
              {data.buttonPrimaryText}
            </Link>
          )}

          {data.buttonSecondaryText && data.buttonSecondaryUrl && (
            <Link href={data.buttonSecondaryUrl} className="signature-btn signature-btn-secondary">
              {data.buttonSecondaryText}
            </Link>
          )}
        </div>

      </div>
    </section>
  );
};