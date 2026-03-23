import Link from 'next/link';
import { Card } from '@/components/ui/card';
import {
  ArrowRight,
  Briefcase,
  Heart,
  Gavel,
  Scale,
  Shield,
  GraduationCap,
  Building2,
  FileText,
  type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Heart,
  Gavel,
  Scale,
  Shield,
  Briefcase,
  GraduationCap,
  Building2,
  FileText,
};

interface PracticeAreaCardsData {
  heading?: string;
  cards?: {
    title: string;
    description?: string;
    iconHint?: string;
    link?: string;
  }[];
}

export const PracticeAreaCards = ({ data }: { data: PracticeAreaCardsData }) => {
  if (!data.cards?.length) return null;

  return (
    <section className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-[var(--brand-bg-tint)]">
      <div className="max-w-7xl mx-auto">
        {data.heading && (
          <h2 className="font-sans text-2xl sm:text-3xl font-bold mb-10 text-center" style={{ color: 'var(--brand-navy)' }}>
            {data.heading}
          </h2>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {data.cards.map((card, i) => (
            <Card
              key={i}
              className="p-5 bg-background border border-border flex flex-col hover:shadow-md hover:border-[var(--brand-azure-light)] transition-all"
            >
              <div
                className="w-10 h-10 rounded-md flex items-center justify-center mb-4 flex-shrink-0"
                style={{ background: 'var(--brand-bg-tint)' }}
              >
                {(() => { const Icon = (card.iconHint && iconMap[card.iconHint]) || Briefcase; return <Icon className="w-5 h-5" style={{ color: 'var(--brand-azure-vivid)' }} />; })()}
              </div>
              <h3 className="font-sans text-sm font-bold mb-2" style={{ color: 'var(--brand-navy)' }}>
                {card.title}
              </h3>
              {card.description && (
                <p className="text-muted-foreground text-xs leading-relaxed flex-1 mb-3">{card.description}</p>
              )}
              {card.link && (
                <Link
                  href={card.link}
                  className="inline-flex items-center text-xs font-semibold gap-1 mt-auto hover:underline"
                  style={{ color: 'var(--brand-azure-vivid)' }}
                >
                  View area
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
