'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AlertCircle, CheckCircle2, TriangleAlert, X, ExternalLink } from 'lucide-react';

interface AlertBannerData {
  type?: 'info' | 'warning' | 'success';
  text?: string;
  ctaText?: string;
  ctaLink?: string;
}

export const AlertBanner = ({ data }: { data: AlertBannerData }) => {
  const [visible, setVisible] = useState(true);
  if (!visible || !data.text) return null;

  const styles = {
    info: { bg: 'var(--brand-navy)', Icon: AlertCircle },
    success: { bg: '#059669', Icon: CheckCircle2 },
    warning: { bg: '#d97706', Icon: TriangleAlert },
  };
  const { bg, Icon } = styles[data.type ?? 'info'];

  return (
    <div className="relative px-4 py-3 text-center text-sm text-white" style={{ background: bg }}>
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap">
        <Icon className="w-4 h-4 flex-shrink-0" />
        <span>{data.text}</span>
        {data.ctaText && data.ctaLink && (
          <Link
            href={data.ctaLink}
            className="font-semibold underline underline-offset-2 hover:no-underline inline-flex items-center gap-1"
          >
            {data.ctaText}
            <ExternalLink className="w-3 h-3" />
          </Link>
        )}
      </div>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
