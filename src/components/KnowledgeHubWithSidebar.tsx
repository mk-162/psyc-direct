'use client';

import { useState, useEffect } from 'react';
import { useTina } from 'tinacms/dist/react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { EditButton } from './EditButton';
import { ArticleSidebar, ServiceMatch } from './ArticleSidebar';

interface Props {
  query: string;
  variables: { relativePath: string };
  data: any;
  relatedServices: ServiceMatch[];
}

const TinaLive = (props: Props & { render: (data: any) => React.ReactNode }) => {
  const { data } = useTina({ query: props.query, variables: props.variables, data: props.data });
  return <>{props.render(data)}</>;
};

export const KnowledgeHubWithSidebar = (props: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    setIsEditing(window.self !== window.top);
  }, []);

  const render = (data: any) => (
    <Inner data={data} variables={props.variables} relatedServices={props.relatedServices} />
  );

  if (isEditing) return <TinaLive {...props} render={render} />;
  return render(props.data);
};

function Inner({ data, variables, relatedServices }: {
  data: any;
  variables: { relativePath: string };
  relatedServices: ServiceMatch[];
}) {
  const rootKey = Object.keys(data).find(
    (key) => data[key] && typeof data[key] === 'object' && ('body' in data[key] || 'title' in data[key])
  );
  const page = rootKey ? data[rootKey] : null;
  if (!page) return null;

  const filename = variables.relativePath.replace(/\.(md|json|mdx)$/, '');

  return (
    <div className="tina-live-preview-wrapper">
      {/* Hero */}
      <section className="article-hero section-bleed section-mineral-white theme-light">
        <div className="article-hero-inner">
          <h1 className="article-hero-title">{page.title}</h1>
          {page.description && <p className="article-hero-description">{page.description}</p>}
        </div>
      </section>

      {/* Featured image */}
      {page.featured_image && page.show_hero_image && (
        <section className="article-featured-image section-bleed">
          <img src={page.featured_image} alt={page.title || ''} />
        </section>
      )}

      {/* Body + Sidebar */}
      <section className="article-content-section section-bleed section-mineral-white theme-light">
        <div className="article-layout">
          <article className="article-body editorial-content">
            {page.body && <TinaMarkdown content={page.body} />}
          </article>
          <ArticleSidebar
            tags={page.tags}
            relatedServices={relatedServices}
            ctaHeading="Need guidance?"
            ctaText="Our clinical team can help you understand what matters for your health."
          />
        </div>
      </section>

      <EditButton collection={rootKey || 'knowledgeHubPages'} filename={filename} />
    </div>
  );
}
