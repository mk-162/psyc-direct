import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface CtaBannerData {
  heading?: string;
  bodyText?: string;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}

export const CtaBanner = ({ data }: { data: CtaBannerData }) => {
  if (!data.heading) return null;

  return (
    <section className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div
          className="relative overflow-hidden rounded-md px-8 sm:px-12 py-10 sm:py-14 text-center sm:text-left"
          style={{ background: 'var(--brand-navy)' }}
        >
          {/* Decorative */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[var(--brand-azure-vivid)]/20 to-transparent" />
          </div>
          <div className="relative flex flex-col sm:flex-row items-center gap-8">
            <div className="flex-1">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-4">
                {data.heading}
              </h2>
              {data.bodyText && (
                <p className="text-white/70 text-sm sm:text-base leading-relaxed max-w-xl">
                  {data.bodyText}
                </p>
              )}
            </div>
            {(data.primaryCtaText || data.secondaryCtaText) && (
              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                {data.primaryCtaText && data.primaryCtaLink && (
                  <Button
                    asChild
                    size="lg"
                    className="font-semibold"
                    style={{ background: 'var(--brand-azure)', color: 'var(--brand-navy)' }}
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
                    className="border-white/30 text-white bg-white/5 hover:bg-white/15"
                  >
                    <Link href={data.secondaryCtaLink}>
                      {data.secondaryCtaText}
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
