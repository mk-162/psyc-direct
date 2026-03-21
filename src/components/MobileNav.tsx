'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

interface NavItem {
  label: string;
  url: string;
  children?: { label: string; url: string }[];
}

export function MobileNav({ items, phone = '01306 879 975' }: { items: NavItem[]; phone?: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const telHref = `tel:${phone.replace(/\s/g, '')}`;

  return (
    <>
      <button
        className="md:hidden p-2 -mr-2"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? 'Close menu' : 'Open menu'}
      >
        {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {open && (
        <div
          id="mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-border shadow-lg z-50 max-h-[calc(100vh-4rem)] overflow-y-auto"
        >
          <nav className="px-4 py-4 space-y-1">
            {items.map((item) => (
              <div key={item.url}>
                <a
                  href={item.url}
                  className="block py-2.5 px-3 text-sm font-semibold rounded-md hover:bg-[var(--brand-bg-tint)] transition-colors"
                  style={{ color: 'var(--brand-navy)' }}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
                {item.children?.map((child) => (
                  <a
                    key={child.url}
                    href={child.url}
                    className="block py-2 px-6 text-sm text-muted-foreground hover:text-foreground hover:bg-[var(--brand-bg-tint)] rounded-md transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    {child.label}
                  </a>
                ))}
              </div>
            ))}
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
      )}
    </>
  );
}
