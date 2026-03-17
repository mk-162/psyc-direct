import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Phone } from 'lucide-react';

interface CtaInlineData {
  heading?: string;
  bodyText?: string;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}

export const CtaInline = ({ data }: { data: CtaInlineData }) => {
  if (!data.heading) return null;

  return (
    <section className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 sm:p-8 border-none bg-[var(--brand-bg-tint)]">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <div
              className="flex-shrink-0 w-12 h-12 rounded-md flex items-center justify-center"
              style={{ background: 'var(--brand-navy)' }}
            >
              <Phone className="w-5 h-5 text-[var(--brand-azure)]" />
            </div>
            <div className="flex-1">
              <h3 className="font-sans text-lg font-bold mb-2" style={{ color: 'var(--brand-navy)' }}>
                {data.heading}
              </h3>
              {data.bodyText && (
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{data.bodyText}</p>
              )}
              <div className="flex flex-col sm:flex-row gap-3">
                {data.primaryCtaText && data.primaryCtaLink && (
                  <Button asChild size="default" className="font-semibold text-white" style={{ background: 'var(--brand-navy)' }}>
                    <Link href={data.primaryCtaLink}>
                      {data.primaryCtaText}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                )}
                {data.secondaryCtaText && data.secondaryCtaLink && (
                  <Button asChild size="default" variant="outline">
                    <Link href={data.secondaryCtaLink}>{data.secondaryCtaText}</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};
