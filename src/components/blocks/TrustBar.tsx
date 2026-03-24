import { CheckCircle2 } from 'lucide-react';

interface TrustBarData {
  items?: { text: string }[];
}

export const TrustBar = ({ data }: { data: TrustBarData }) => {
  if (!data.items?.length) return null;

  return (
    <section className="bg-[var(--brand-bg-tint)] border-y border-border py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 sm:gap-x-12">
          {data.items.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <CheckCircle2 aria-hidden="true" className="w-4 h-4 flex-shrink-0 text-[var(--brand-azure-vivid)]" />
              <span className="text-sm font-semibold text-foreground whitespace-nowrap">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
