'use client';

import { useState, useEffect } from 'react';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('cookie-consent')) setVisible(true);
  }, []);

  if (!visible) return null;

  const accept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setVisible(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 py-3 shadow-lg sm:flex sm:items-center sm:justify-between sm:gap-4" style={{ background: 'var(--brand-navy)' }}>
      <p className="text-sm text-white/90">
        We use cookies to improve your experience. By continuing, you agree to our{' '}
        <a href="/cookie-policy/" className="underline font-medium text-white">cookie policy</a>.
      </p>
      <button
        onClick={accept}
        className="mt-2 sm:mt-0 shrink-0 px-5 py-2 rounded-md text-sm font-semibold"
        style={{ background: 'var(--brand-azure)', color: 'var(--brand-navy)' }}
      >
        Accept
      </button>
    </div>
  );
}
