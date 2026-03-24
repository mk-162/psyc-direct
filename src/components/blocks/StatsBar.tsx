interface StatsBarData {
  stats?: { value: string; label: string }[];
}

export const StatsBar = ({ data }: { data: StatsBarData }) => {
  if (!data.stats?.length) return null;

  return (
    <section className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className={`grid grid-cols-2 ${data.stats.length >= 4 ? 'lg:grid-cols-4' : data.stats.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-8`}>
          {data.stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div
                className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mb-2"
                style={{ color: 'var(--brand-navy)' }}
              >
                {stat.value}
              </div>
              <div className="text-sm font-medium text-muted-foreground leading-snug">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
