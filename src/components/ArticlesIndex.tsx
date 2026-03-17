'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ArticleSummary {
  slug: string;
  title: string;
  description: string;
  featured_image: string;
  category: string;
  date: string;
  author: string;
  read_time: string;
}

interface Props {
  articles: ArticleSummary[];
  categories: string[];
}

export function ArticlesIndex({ articles, categories }: Props) {
  const [active, setActive] = useState<string | null>(null);

  const filtered = active
    ? articles.filter((a) => a.category === active)
    : articles;

  return (
    <>
      {/* Hero */}
      <section className="article-hero section-bleed section-mineral-white theme-light">
        <div className="article-hero-inner">
          <h1 className="article-hero-title">Articles</h1>
          <p className="article-hero-description">
            Evidence-based health guidance from our clinical team.
          </p>
        </div>
      </section>

      {/* Category filters */}
      {categories.length > 0 && (
        <section className="articles-filters section-bleed section-mineral-white theme-light">
          <div className="articles-filters-inner">
            <button
              className={`articles-filter-chip ${active === null ? 'articles-filter-chip--active' : ''}`}
              onClick={() => setActive(null)}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`articles-filter-chip ${active === cat ? 'articles-filter-chip--active' : ''}`}
                onClick={() => setActive(active === cat ? null : cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Article grid */}
      <section className="articles-grid-section section-bleed section-mineral-white theme-light">
        <div className="articles-grid">
          {filtered.map((article) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="articles-card"
            >
              {article.featured_image && (
                <div className="articles-card-image">
                  <img src={article.featured_image} alt={article.title} />
                </div>
              )}
              <div className="articles-card-body">
                {article.category && (
                  <span className="articles-card-category">{article.category}</span>
                )}
                <h2 className="articles-card-title">{article.title}</h2>
                {article.description && (
                  <p className="articles-card-desc">{article.description}</p>
                )}
                <div className="articles-card-meta">
                  {article.author && <span>{article.author}</span>}
                  {article.read_time && <span>{article.read_time} read</span>}
                </div>
              </div>
            </Link>
          ))}
          {filtered.length === 0 && (
            <p className="articles-empty">No articles in this category yet.</p>
          )}
        </div>
      </section>
    </>
  );
}
