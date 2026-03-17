'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TinaMarkdown } from 'tinacms/dist/rich-text';

interface TabbedContentData {
  heading?: string;
  tabs?: {
    label: string;
    content?: any;
  }[];
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
              <div className="prose prose-sm sm:prose max-w-none">
                {tab.content ? (
                  <TinaMarkdown content={tab.content} />
                ) : null}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};
