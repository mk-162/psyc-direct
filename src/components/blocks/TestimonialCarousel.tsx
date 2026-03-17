'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface TestimonialCarouselData {
  heading?: string;
  testimonials?: {
    quote: string;
    name?: string;
    title?: string;
    organization?: string;
  }[];
}

export const TestimonialCarousel = ({ data }: { data: TestimonialCarouselData }) => {
  const [current, setCurrent] = useState(0);
  const items = data.testimonials ?? [];
  if (!items.length) return null;
  const t = items[current];

  return (
    <section className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-[var(--brand-bg-tint)]">
      <div className="max-w-7xl mx-auto">
        {data.heading && (
          <h2 className="font-sans text-2xl sm:text-3xl font-bold text-center mb-10" style={{ color: 'var(--brand-navy)' }}>
            {data.heading}
          </h2>
        )}
        <div className="max-w-3xl mx-auto text-center">
          <Quote className="w-10 h-10 mx-auto mb-6" style={{ color: 'var(--brand-azure)', opacity: 0.4 }} />
          <blockquote className="font-serif text-lg sm:text-xl lg:text-2xl text-foreground leading-relaxed mb-6">
            &ldquo;{t.quote}&rdquo;
          </blockquote>
          <div className="font-sans text-sm font-bold text-foreground">{t.name}</div>
          <div className="text-muted-foreground text-sm">
            {[t.title, t.organization].filter(Boolean).join(', ')}
          </div>
          {items.length > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button
                size="icon"
                variant="outline"
                onClick={() => setCurrent((p) => (p === 0 ? items.length - 1 : p - 1))}
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="flex gap-2">
                {items.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className="w-2.5 h-2.5 rounded-full transition-colors"
                    style={{ background: i === current ? 'var(--brand-azure)' : 'var(--muted)' }}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>
              <Button
                size="icon"
                variant="outline"
                onClick={() => setCurrent((p) => (p === items.length - 1 ? 0 : p + 1))}
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
