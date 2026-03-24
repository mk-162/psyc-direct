'use client';

import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';

interface NavItem {
  label: string;
  url: string;
  children?: { label: string; url: string }[];
}

export function MobileNav({ items, phone = '01306 879 975' }: { items: NavItem[]; phone?: string }) {
  const [open, setOpen] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  // Lock body scroll when menu is open, and auto-close on desktop resize
  useEffect(() => {
    if (!open) return;

    // Prevent scrollbar flicker: measure scrollbar width, then pad body
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener('resize', onResize);

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  const telHref = `tel:${phone.replace(/\s/g, '')}`;

  const toggleSection = (i: number) => {
    setExpandedIndex(expandedIndex === i ? null : i);
  };

  return (
    <>
      <button
        className="md:hidden p-2 -mr-2"
        onClick={() => { setOpen(!open); setExpandedIndex(null); }}
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? 'Close menu' : 'Open menu'}
      >
        {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 top-16 bg-black/20 z-40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="md:hidden fixed top-16 left-0 right-0 bottom-0 bg-white z-50 overflow-y-auto"
          >
            <nav className="px-4 py-4 space-y-1">
              {items.map((item, i) => {
                const hasChildren = item.children && item.children.length > 0;
                const isExpanded = expandedIndex === i;

                return (
                  <div key={item.url} className="border-b border-border/50 last:border-0">
                    {hasChildren ? (
                      <>
                        <button
                          type="button"
                          className="flex items-center justify-between w-full py-3 px-3 text-sm font-semibold rounded-md hover:bg-[var(--brand-bg-tint)] transition-colors"
                          style={{ color: 'var(--brand-navy)' }}
                          onClick={() => toggleSection(i)}
                          aria-expanded={isExpanded}
                        >
                          {item.label}
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                          />
                        </button>
                        <div
                          className={`overflow-hidden transition-all duration-200 ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                        >
                          <div className="pb-2 pl-2">
                            {item.children!.map((child) => (
                              <a
                                key={child.url}
                                href={child.url}
                                className="block py-2 px-4 text-sm text-muted-foreground hover:text-foreground hover:bg-[var(--brand-bg-tint)] rounded-md transition-colors"
                                onClick={() => setOpen(false)}
                              >
                                {child.label}
                              </a>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <a
                        href={item.url}
                        className="block py-3 px-3 text-sm font-semibold rounded-md hover:bg-[var(--brand-bg-tint)] transition-colors"
                        style={{ color: 'var(--brand-navy)' }}
                        onClick={() => setOpen(false)}
                      >
                        {item.label}
                      </a>
                    )}
                  </div>
                );
              })}
              <div className="pt-3 mt-3 border-t border-border">
                <a
                  href={telHref}
                  className="block py-2.5 px-3 text-sm font-semibold"
                  style={{ color: 'var(--brand-azure-vivid)' }}
                >
                  Call {phone}
                </a>
                <a
                  href="/contact/"
                  className="block mt-2 py-3 px-3 text-center text-sm font-semibold text-white rounded-md"
                  style={{ background: 'var(--brand-navy)' }}
                  onClick={() => setOpen(false)}
                >
                  Get in Touch
                </a>
              </div>
            </nav>
          </div>
        </>
      )}
    </>
  );
}
