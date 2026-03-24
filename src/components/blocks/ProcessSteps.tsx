import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface ProcessStepsData {
  heading?: string;
  steps?: {
    number: number;
    title: string;
    description?: string;
  }[];
  ctaText?: string;
  ctaLink?: string;
}

export const ProcessSteps = ({ data }: { data: ProcessStepsData }) => {
  if (!data.steps?.length) return null;

  return (
    <section className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-[var(--brand-bg-tint)]">
      <div className="max-w-7xl mx-auto">
        {data.heading && (
          <h2 className="font-sans text-2xl sm:text-3xl font-bold text-center mb-12" style={{ color: 'var(--brand-navy)' }}>
            {data.heading}
          </h2>
        )}
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${data.steps.length >= 4 ? 'lg:grid-cols-4' : data.steps.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-8 relative`}>
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-8 left-[calc(12.5%+1rem)] right-[calc(12.5%+1rem)] h-px bg-[var(--brand-azure-light)] -z-0 pointer-events-none" />
          {data.steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center relative">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-white font-serif text-xl font-bold mb-5 shadow-sm relative z-10 flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, var(--brand-navy), var(--brand-azure-dark))' }}
              >
                {String(step.number).padStart(2, '0')}
              </div>
              <h3 className="font-sans text-sm font-bold mb-2" style={{ color: 'var(--brand-navy)' }}>
                {step.title}
              </h3>
              {step.description && (
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              )}
            </div>
          ))}
        </div>
        {data.ctaText && data.ctaLink && (
          <div className="text-center mt-10">
            <Button asChild size="lg" className="font-semibold text-white" style={{ background: 'var(--brand-navy)' }}>
              <Link href={data.ctaLink}>
                {data.ctaText}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
