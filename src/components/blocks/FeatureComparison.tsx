import { CheckCircle2, X } from 'lucide-react';

interface FeatureComparisonData {
  heading?: string;
  col1Header?: string;
  col2Header?: string;
  rows?: {
    feature: string;
    col1?: string;
    col2?: string;
  }[];
}

const CellValue = ({ value, isHighlighted }: { value?: string; isHighlighted?: boolean }) => {
  if (!value) return <><X aria-hidden="true" className="w-5 h-5 text-muted-foreground/40 mx-auto" /><span className="sr-only">No</span></>;
  const lower = value.toLowerCase();
  if (lower === 'yes' || lower === '✓' || lower === 'true') {
    return <><CheckCircle2 aria-hidden="true" className="w-5 h-5 mx-auto" style={{ color: 'var(--brand-azure)' }} /><span className="sr-only">Yes</span></>;
  }
  if (lower === 'no' || lower === '✗' || lower === 'false') {
    return <><X aria-hidden="true" className="w-5 h-5 text-muted-foreground/40 mx-auto" /><span className="sr-only">No</span></>;
  }
  return (
    <span
      className={`text-sm font-medium ${isHighlighted ? '' : 'text-muted-foreground'}`}
      style={isHighlighted ? { color: 'var(--brand-azure-vivid)' } : undefined}
    >
      {value}
    </span>
  );
};

export const FeatureComparison = ({ data }: { data: FeatureComparisonData }) => {
  const rows = data.rows ?? [];
  if (!rows.length) return null;

  return (
    <section className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-5xl mx-auto">
        {data.heading && (
          <h2 className="font-sans text-2xl sm:text-3xl font-bold text-center mb-10" style={{ color: 'var(--brand-navy)' }}>
            {data.heading}
          </h2>
        )}
        <div className="overflow-x-auto rounded-md border border-border">
          <table className="w-full min-w-[500px]">
            <thead style={{ background: 'var(--brand-navy)' }}>
              <tr>
                <th className="text-left py-4 px-5 text-sm font-semibold text-white/80 w-1/2">Feature</th>
                <th className="text-center py-4 px-5 text-sm font-bold text-[var(--brand-azure)] w-1/4">
                  {data.col1Header || 'Psychology Direct'}
                </th>
                <th className="text-center py-4 px-5 text-sm font-semibold text-white/60 w-1/4">
                  {data.col2Header || 'Alternative'}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-t border-border odd:bg-background even:bg-[var(--brand-bg-tint)]">
                  <td className="py-3 px-5 text-sm text-foreground">{row.feature}</td>
                  <td className="py-3 px-5 text-center">
                    <CellValue value={row.col1} isHighlighted />
                  </td>
                  <td className="py-3 px-5 text-center">
                    <CellValue value={row.col2} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
