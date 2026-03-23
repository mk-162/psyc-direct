import Image from 'next/image';
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
    image?: string;
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
              className={`${card.image ? 'p-0 overflow-hidden' : 'p-6'} bg-[var(--brand-bg-tint)] border-0 flex flex-col hover:shadow-md transition-shadow`}
            >
              {card.image && (
                <div className="relative aspect-[16/9] w-full">
                  <Image src={card.image} alt={card.title} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                </div>
              )}
              <div className={card.image ? 'p-6 flex flex-col flex-1' : 'contents'}>
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
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
