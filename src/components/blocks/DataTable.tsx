import React from 'react';

interface TableRow {
  [key: string]: string | number | boolean | null | undefined;
}

interface DataTableProps {
  data: {
    headline?: string;
    description?: string;
    eyebrow?: string;
    theme?: 'off-white' | 'green' | 'grey' | 'terracotta';
    columns: { key: string; label: string }[];
    rows: TableRow[];
    highlightColumn?: number;
    footnotes?: string[];
  };
}

export const DataTable = ({ data }: DataTableProps) => {
  const themeClass = data.theme === 'green' ? 'section-deep-green theme-dark'
    : data.theme === 'grey' ? 'section-warm-stone theme-light'
    : data.theme === 'terracotta' ? 'section-terracotta theme-dark'
    : 'section-mineral-white theme-light';

  return (
    <section className={`ds-section section-bleed ${themeClass}`}>
      <div className="ds-container">
        {(data.eyebrow || data.headline) && (
          <div className="section-intro">
            {data.eyebrow && <div className="eyebrow">{data.eyebrow}</div>}
            {data.headline && <h2 className="heading-display">{data.headline}</h2>}
            {data.description && <p className="body-editorial">{data.description}</p>}
          </div>
        )}
        
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                {data.columns.map((col, idx) => (
                  <th key={col.key} className={idx === data.highlightColumn ? 'highlight' : ''}>
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row, rowIdx) => (
                <tr key={rowIdx}>
                  {data.columns.map((col, colIdx) => (
                    <td key={col.key} className={colIdx === data.highlightColumn ? 'highlight' : ''}>
                      {row[col.key] || '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {data.footnotes && data.footnotes.length > 0 && (
          <div className="data-table-footnotes">
            {data.footnotes.map((note, idx) => (
              <p key={idx} className="footnote">{note}</p>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
