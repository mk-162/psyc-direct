'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavItem {
  label: string;
  url: string;
  children?: { label: string; url: string }[];
}

export function MobileNav({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);

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
                href="tel:01306879975"
                className="block py-2.5 px-3 text-sm font-semibold"
                style={{ color: 'var(--brand-azure-vivid)' }}
              >
                Call 01306 879 975
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
