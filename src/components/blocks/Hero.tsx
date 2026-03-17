import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface HeroData {
  variant?: 'gradient' | 'image';
  headline?: string;
  subtitle?: string;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  backgroundImage?: string;
}

export const Hero = ({ data }: { data: HeroData }) => {
  const isImage = data.variant === 'image' && data.backgroundImage;

  return (
    <section
      className="relative overflow-hidden"
      style={
        isImage
          ? { backgroundImage: `url(${data.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
          : { background: 'linear-gradient(135deg, var(--brand-hero-from) 0%, var(--brand-hero-to) 100%)' }
      }
    >
      {/* Decorative overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[var(--brand-azure-vivid)]/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--brand-azure)]/10 rounded-full -translate-x-1/2 translate-y-1/2" />
      </div>
      {isImage && <div className="absolute inset-0 bg-[var(--brand-navy)]/60" />}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
        <div className="max-w-3xl">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-[3.25rem] font-bold text-white leading-tight mb-6">
            {data.headline || 'Psychology Direct'}
          </h1>
          {data.subtitle && (
            <p className="text-base sm:text-lg text-[var(--brand-azure-light)] leading-relaxed mb-8 max-w-2xl">
              {data.subtitle}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3">
            {data.primaryCtaText && data.primaryCtaLink && (
              <Button
                asChild
                size="lg"
                className="bg-[var(--brand-azure)] text-[var(--brand-navy)] hover:bg-[var(--brand-azure-light)] font-semibold"
              >
                <Link href={data.primaryCtaLink}>
                  {data.primaryCtaText}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            )}
            {data.secondaryCtaText && data.secondaryCtaLink && (
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 text-white bg-white/5 backdrop-blur-sm hover:bg-white/15"
              >
                <Link href={data.secondaryCtaLink}>
                  {data.secondaryCtaText}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
