'use client';

import { useState, useEffect } from 'react';
import { useTina } from 'tinacms/dist/react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { EditButton } from './EditButton';
import { ArticleSidebar, ServiceMatch } from './ArticleSidebar';

interface ArticlePageProps {
  query: string;
  variables: { relativePath: string };
  data: any;
  relatedServices: ServiceMatch[];
}

/** Only mounts useTina inside CMS iframe */
const TinaLiveArticle = (props: ArticlePageProps & { render: (data: any) => React.ReactNode }) => {
  const { data } = useTina({ query: props.query, variables: props.variables, data: props.data });
  return <>{props.render(data)}</>;
};

export const ArticlePage = (props: ArticlePageProps) => {
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    setIsEditing(window.self !== window.top);
  }, []);

  const renderArticle = (data: any) => (
    <ArticleInner data={data} variables={props.variables} relatedServices={props.relatedServices} />
  );

  if (isEditing) {
    return <TinaLiveArticle {...props} render={renderArticle} />;
  }

  return renderArticle(props.data);
};

function ArticleInner({ data, variables, relatedServices }: {
  data: any;
  variables: { relativePath: string };
  relatedServices: ServiceMatch[];
}) {
  const article = data.articles;
  if (!article) return null;

  const filename = variables.relativePath.replace(/\.(md|json|mdx)$/, '');
  const publishDate = article.date ? new Date(article.date).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  }) : null;

  return (
    <div className="tina-live-preview-wrapper">
      {/* Hero */}
      <section className="article-hero section-bleed section-mineral-white theme-light">
        <div className="article-hero-inner">
          {article.category && <div className="article-category-tag">{article.category}</div>}
          <h1 className="article-hero-title">{article.title}</h1>
          {article.description && <p className="article-hero-description">{article.description}</p>}
          <div className="article-meta-bar">
            {article.author && (
              <div className="article-author">
                <span className="article-author-name">{article.author}</span>
                {article.author_role && <span className="article-author-role">{article.author_role}</span>}
              </div>
            )}
            {publishDate && <span className="article-date">{publishDate}</span>}
            {article.read_time && <span className="article-read-time">{article.read_time} read</span>}
          </div>
        </div>
      </section>

      {/* Featured image */}
      {article.featured_image && (
        <section className="article-featured-image section-bleed">
          <img src={article.featured_image} alt={article.title || ''} />
        </section>
      )}

      {/* Body + Sidebar */}
      <section className="article-content-section section-bleed section-mineral-white theme-light">
        <div className="article-layout">
          <article className="article-body editorial-content">
            <TinaMarkdown content={article.body} />
          </article>
          <ArticleSidebar tags={article.tags} relatedServices={relatedServices} />
        </div>
      </section>

      <EditButton collection="articles" filename={filename} />
    </div>
  );
}
