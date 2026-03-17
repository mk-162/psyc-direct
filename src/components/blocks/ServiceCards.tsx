import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

interface ServiceCardsData {
  heading?: string;
  subheading?: string;
  cards?: {
    title: string;
    description?: string;
    link?: string;
    iconHint?: string;
  }[];
}

export const ServiceCards = ({ data }: { data: ServiceCardsData }) => {
  if (!data.cards?.length) return null;
  const cols = data.cards.length <= 2 ? data.cards.length : 3;

  return (
    <section className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {(data.heading || data.subheading) && (
          <div className="text-center mb-10">
            {data.heading && (
              <h2 className="font-sans text-2xl sm:text-3xl font-bold mb-3" style={{ color: 'var(--brand-navy)' }}>
                {data.heading}
              </h2>
            )}
            {data.subheading && (
              <p className="text-muted-foreground text-base max-w-2xl mx-auto">{data.subheading}</p>
            )}
          </div>
        )}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${cols} gap-6`}>
          {data.cards.map((card, i) => (
            <Card
              key={i}
              className="p-6 bg-[var(--brand-bg-tint)] border-0 flex flex-col hover:shadow-md transition-shadow"
            >
              <h3 className="font-sans text-base font-bold mb-3" style={{ color: 'var(--brand-navy)' }}>
                {card.title}
              </h3>
              {card.description && (
                <p className="text-muted-foreground text-sm leading-relaxed flex-1 mb-4">{card.description}</p>
              )}
              {card.link && (
                <Link
                  href={card.link}
                  className="inline-flex items-center text-sm font-semibold gap-1 mt-auto hover:underline"
                  style={{ color: 'var(--brand-azure-vivid)' }}
                >
                  Learn more
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
