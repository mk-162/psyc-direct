import React from 'react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';

interface RichTextData {
  body?: any;
}

export const RichText = ({ data }: { data: RichTextData }) => {
  if (!data.body) return null;

  return (
    <section className="rich-text-section">
      <div className="container-narrow editorial-content">
        <TinaMarkdown content={data.body} />
      </div>
    </section>
  );
};
