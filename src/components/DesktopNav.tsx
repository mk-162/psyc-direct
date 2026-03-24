'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface NavItem {
  label: string;
  url: string;
  children?: { label: string; url: string }[];
}

export function DesktopNav({ items }: { items: NavItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLElement>(null);

  const open = (i: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenIndex(i);
  };

  const close = () => {
    timeoutRef.current = setTimeout(() => setOpenIndex(null), 150);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenIndex(null);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <nav ref={navRef} aria-label="Main navigation" className="hidden md:flex items-center gap-1">
      {items.map((item, i) => {
        const hasChildren = item.children && item.children.length > 0;
        const isOpen = openIndex === i;

        return (
          <div
            key={item.url}
            className="relative"
            onMouseEnter={() => hasChildren && open(i)}
            onMouseLeave={close}
          >
            {hasChildren ? (
              <button
                type="button"
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground hover:text-[var(--brand-azure-vivid)] transition-colors rounded-md"
                aria-expanded={isOpen}
                aria-haspopup="true"
                onClick={() => setOpenIndex(isOpen ? null : i)}
              >
                {item.label}
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
            ) : (
              <a
                href={item.url}
                className="flex items-center px-3 py-2 text-sm font-medium text-foreground hover:text-[var(--brand-azure-vivid)] transition-colors rounded-md"
              >
                {item.label}
              </a>
            )}

            {hasChildren && isOpen && (
              <div
                className="absolute top-full left-0 pt-1 z-50"
                onMouseEnter={() => open(i)}
                onMouseLeave={close}
              >
                <div className="bg-white rounded-lg shadow-lg border border-border py-2 min-w-[220px]">
                  {item.children!.map((child) => (
                    <a
                      key={child.url}
                      href={child.url}
                      className="block px-4 py-2 text-sm text-foreground hover:bg-[var(--brand-bg-tint)] hover:text-[var(--brand-azure-vivid)] transition-colors"
                    >
                      {child.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
