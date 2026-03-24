'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TabbedContentData {
  heading?: string;
  tabs?: {
    label: string;
    content?: string;
  }[];
}

/** Simple markdown-to-HTML for tab content (handles paragraphs, headings, lists, bold, links) */
function renderMarkdown(md: string) {
  const lines = md.split('\n');
  const html: string[] = [];
  let inList = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Close list if we're no longer in one
    if (inList && !trimmed.startsWith('- ') && !trimmed.startsWith('* ') && !/^\d+\.\s/.test(trimmed)) {
      html.push('</ul>');
      inList = false;
    }

    if (!trimmed) continue;

    // Headings
    if (trimmed.startsWith('### ')) {
      html.push(`<h3>${inline(trimmed.slice(4))}</h3>`);
    } else if (trimmed.startsWith('## ')) {
      html.push(`<h2>${inline(trimmed.slice(3))}</h2>`);
    }
    // Unordered list
    else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (!inList) { html.push('<ul>'); inList = true; }
      html.push(`<li>${inline(trimmed.slice(2))}</li>`);
    }
    // Ordered list
    else if (/^\d+\.\s/.test(trimmed)) {
      if (!inList) { html.push('<ul>'); inList = true; }
      html.push(`<li>${inline(trimmed.replace(/^\d+\.\s/, ''))}</li>`);
    }
    // Paragraph
    else {
      html.push(`<p>${inline(trimmed)}</p>`);
    }
  }

  if (inList) html.push('</ul>');
  return html.join('');
}

/** Inline markdown: bold, italic, links */
function inline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[var(--brand-azure-vivid)] hover:underline">$1</a>')
    .replace(/→\s*(\S+)/g, '→ <a href="$1" class="text-[var(--brand-azure-vivid)] hover:underline">$1</a>');
}

export const TabbedContent = ({ data }: { data: TabbedContentData }) => {
  const tabs = data.tabs ?? [];
  if (!tabs.length) return null;

  return (
    <section className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {data.heading && (
          <h2 className="font-sans text-2xl sm:text-3xl font-bold mb-8" style={{ color: 'var(--brand-navy)' }}>
            {data.heading}
          </h2>
        )}
        <Tabs defaultValue={tabs[0]?.label}>
          <TabsList className="flex-wrap h-auto gap-1 mb-8 bg-[var(--brand-bg-tint)] p-1">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.label}
                value={tab.label}
                className="text-sm font-medium data-[state=active]:bg-[var(--brand-navy)] data-[state=active]:text-white"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab) => (
            <TabsContent key={tab.label} value={tab.label}>
              {tab.content ? (
                <div
                  className="prose prose-sm sm:prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(tab.content) }}
                />
              ) : null}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};
