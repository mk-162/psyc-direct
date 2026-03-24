import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

interface CaseStudyCardsData {
  heading?: string;
  caseStudies?: {
    title: string;
    summary?: string;
    sector?: string;
    link?: string;
    thumbnail?: string;
  }[];
}

export const CaseStudyCards = ({ data }: { data: CaseStudyCardsData }) => {
  const items = data.caseStudies ?? [];
  if (!items.length) return null;

  return (
    <section className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {data.heading && (
          <h2 className="font-sans text-2xl sm:text-3xl font-bold mb-10 text-center" style={{ color: 'var(--brand-navy)' }}>
            {data.heading}
          </h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((cs, i) => (
            <Card key={i} className={`${cs.thumbnail ? 'p-0 overflow-hidden' : 'p-6'} bg-background flex flex-col hover:shadow-md hover:-translate-y-1 transition-all duration-200`}>
              {cs.thumbnail && (
                <div className="relative aspect-[16/9] w-full">
                  <Image src={cs.thumbnail} alt={cs.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                </div>
              )}
              <div className={cs.thumbnail ? 'p-6 flex flex-col flex-1' : 'contents'}>
              {cs.sector && (
                <Badge variant="secondary" className="self-start mb-4 text-xs font-semibold">
                  {cs.sector}
                </Badge>
              )}
              <h3 className="font-sans text-base font-bold mb-3" style={{ color: 'var(--brand-navy)' }}>
                {cs.title}
              </h3>
              {cs.summary && (
                <p className="text-muted-foreground text-sm leading-relaxed flex-1 mb-4">{cs.summary}</p>
              )}
              {cs.link && (
                <Link
                  href={cs.link}
                  className="inline-flex items-center text-sm font-semibold gap-1 mt-auto hover:underline"
                  style={{ color: 'var(--brand-azure-vivid)' }}
                >
                  Read case study
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
