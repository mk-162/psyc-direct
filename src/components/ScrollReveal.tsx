'use client';

import { useEffect, useRef, useState } from 'react';

export function ScrollReveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setRevealed(true);
      return;
    }

    // Small delay to let the hidden state render before observing
    requestAnimationFrame(() => {
      setMounted(true);

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.unobserve(el);
          }
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
      );

      observer.observe(el);
    });

    return () => setMounted(false);
  }, []);

  // Server render + before mount: fully visible (no flash)
  // After mount: apply animation classes
  const cls = mounted
    ? `scroll-reveal ${revealed ? 'scroll-revealed' : ''} ${className}`
    : className;

  return (
    <div ref={ref} className={cls}>
      {children}
    </div>
  );
}
