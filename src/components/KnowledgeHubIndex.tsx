'use client';

import { useState, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, ArrowRight, ChevronRight, BookOpen, X, Tag } from 'lucide-react';
import { ARTICLES, ARTICLE_CATEGORIES, ARTICLE_TAGS, searchArticles, type Article } from '@/lib/articles';

function ArticleCardLarge({ article }: { article: Article }) {
  return (
    <Link href={`/knowledge-hub/${article.slug}/`}>
      <Card className="group bg-background border border-border hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/2 h-56 lg:h-auto overflow-hidden rounded-t-md lg:rounded-l-md lg:rounded-tr-none relative">
            <Image src={article.image} alt={article.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 1024px) 100vw, 50vw" />
          </div>
          <div className="flex-1 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
            <span className="text-[var(--brand-azure-vivid)] text-xs font-bold uppercase tracking-wide mb-2">{article.category}</span>
            <h2 className="font-sans text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-3 leading-snug">
              {article.title}
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-4 line-clamp-3">{article.excerpt}</p>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <span className="text-sm text-muted-foreground">
                {new Date(article.publishedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
              <span className="text-[var(--brand-azure-vivid)] text-sm font-semibold inline-flex items-center gap-1">
                Read more <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/knowledge-hub/${article.slug}/`}>
      <Card className="group bg-background border border-border hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
        <div className="h-44 overflow-hidden rounded-t-md relative">
          <Image src={article.image} alt={article.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 640px) 100vw, 50vw" />
        </div>
        <div className="p-5 flex flex-col flex-1">
          <span className="text-[var(--brand-azure-vivid)] text-[10px] font-bold uppercase tracking-wide mb-1">{article.category}</span>
          <h3 className="font-sans text-base font-bold text-foreground mb-2 leading-snug line-clamp-2">{article.title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1 line-clamp-2">{article.excerpt}</p>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-xs text-muted-foreground">
              {new Date(article.publishedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
            <span className="text-[var(--brand-azure-vivid)] text-xs font-semibold inline-flex items-center gap-0.5">
              Read <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export function KnowledgeHubIndex() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');

  const urlCategory = searchParams.get('category');
  const urlTag = searchParams.get('tag');

  const selectedCategory = useMemo(() => {
    if (!urlCategory) return null;
    const match = ARTICLE_CATEGORIES.find((c) => c.slug === urlCategory);
    return match ? match.name : null;
  }, [urlCategory]);

  const selectedTag = useMemo(() => urlTag || null, [urlTag]);

  function setSelectedCategory(name: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (name === null) {
      params.delete('category');
    } else {
      const slug = ARTICLE_CATEGORIES.find((c) => c.name === name)?.slug ?? '';
      params.set('category', slug);
    }
    params.delete('tag');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function setSelectedTag(tag: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (tag === null) {
      params.delete('tag');
    } else {
      params.set('tag', tag);
    }
    params.delete('category');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const filteredArticles = useMemo(() => {
    let results = ARTICLES;
    if (searchQuery.trim()) results = searchArticles(searchQuery);
    if (selectedCategory) results = results.filter((a) => a.category === selectedCategory);
    if (selectedTag) results = results.filter((a) => a.tags.includes(selectedTag));
    return results;
  }, [searchQuery, selectedCategory, selectedTag]);

  const featuredArticle = ARTICLES.find((a) => a.featured);
  const nonFeaturedArticles = filteredArticles.filter((a) => !a.featured || searchQuery || selectedCategory || selectedTag);
  const hasActiveFilters = searchQuery || selectedCategory || selectedTag;

  const clearFilters = () => {
    setSearchQuery('');
    router.push(pathname, { scroll: false });
  };

  return (
    <>
      {/* Hero */}
      <section className="py-12 sm:py-16" style={{ background: 'linear-gradient(135deg, var(--brand-hero-from), var(--brand-hero-to))' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
              Resources &amp; Insights for Legal Professionals
            </h1>
            <p className="text-[var(--brand-azure-light)] text-base sm:text-lg leading-relaxed mb-8">
              Expert articles, guides, and practical advice on psychological evidence in legal cases.
            </p>
            <div className="max-w-lg mx-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <Input
                type="search"
                placeholder="Search articles, topics, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 h-12 text-base"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category bar */}
      <section className="py-4 border-b bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-wrap">
            <Button
              size="sm"
              variant={selectedCategory === null && !selectedTag ? 'default' : 'secondary'}
              onClick={() => setSelectedCategory(null)}
              className={selectedCategory === null && !selectedTag ? 'text-white' : ''}
              style={selectedCategory === null && !selectedTag ? { background: 'var(--brand-navy)' } : undefined}
            >
              All Articles
            </Button>
            {ARTICLE_CATEGORIES.map((cat) => (
              <Button
                key={cat.slug}
                size="sm"
                variant={selectedCategory === cat.name ? 'default' : 'secondary'}
                onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
                className={selectedCategory === cat.name ? 'text-white' : ''}
                style={selectedCategory === cat.name ? { background: 'var(--brand-navy)' } : undefined}
              >
                {cat.name}
                <span className="ml-1 text-xs opacity-70">({cat.count})</span>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {hasActiveFilters && (
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="text-sm text-muted-foreground">Showing results for:</span>
            {searchQuery && (
              <Badge variant="secondary" className="gap-1">
                &ldquo;{searchQuery}&rdquo;
                <button onClick={() => setSearchQuery('')} aria-label="Clear search"><X className="w-3 h-3" /></button>
              </Badge>
            )}
            {selectedCategory && (
              <Badge variant="secondary" className="gap-1">
                {selectedCategory}
                <button onClick={() => setSelectedCategory(null)} aria-label="Clear category"><X className="w-3 h-3" /></button>
              </Badge>
            )}
            {selectedTag && (
              <Badge variant="secondary" className="gap-1">
                {selectedTag}
                <button onClick={() => setSelectedTag(null)} aria-label="Clear tag"><X className="w-3 h-3" /></button>
              </Badge>
            )}
            <button onClick={clearFilters} className="text-xs font-semibold ml-2" style={{ color: 'var(--brand-azure-vivid)' }}>Clear all</button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12">
          {/* Main column */}
          <div className="flex-1 min-w-0">
            {!hasActiveFilters && featuredArticle && (
              <div className="mb-10">
                <h2 className="font-sans text-sm font-bold uppercase tracking-wide mb-4" style={{ color: 'var(--brand-azure-vivid)' }}>Featured Article</h2>
                <ArticleCardLarge article={featuredArticle} />
              </div>
            )}

            {filteredArticles.length === 0 ? (
              <div className="text-center py-16">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-sans text-lg font-bold text-foreground mb-2">No articles found</h3>
                <p className="text-muted-foreground text-sm mb-4">Try adjusting your search or filters.</p>
                <Button variant="secondary" onClick={clearFilters}>Clear filters</Button>
              </div>
            ) : (
              <div>
                <h2 className="font-sans text-sm font-bold uppercase tracking-wide mb-4" style={{ color: 'var(--brand-azure-vivid)' }}>
                  {hasActiveFilters ? `${filteredArticles.length} Article${filteredArticles.length !== 1 ? 's' : ''} Found` : 'Latest Articles'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {nonFeaturedArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:w-72 xl:w-80 flex-shrink-0 space-y-8">
            {/* CTA */}
            <div className="rounded-xl p-5" style={{ background: 'var(--brand-bg-tint)' }}>
              <h3 className="font-sans text-sm font-bold mb-2" style={{ color: 'var(--brand-navy)' }}>Need an Expert?</h3>
              <p className="text-muted-foreground text-xs leading-relaxed mb-3">
                Connect with the right psychologist or psychiatrist for your case today.
              </p>
              <Button asChild size="sm" className="w-full font-semibold text-white" style={{ background: 'var(--brand-navy)' }}>
                <Link href="/contact/">
                  Get in Touch <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>

            {/* Popular Topics */}
            <div>
              <h3 className="font-sans text-sm font-bold uppercase tracking-wide text-foreground mb-3">Popular Topics</h3>
              <div className="flex flex-wrap gap-2">
                {ARTICLE_TAGS.slice(0, 10).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
                    style={
                      selectedTag === tag
                        ? { background: 'var(--brand-azure-vivid)', color: 'white' }
                        : undefined
                    }
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-sans text-sm font-bold uppercase tracking-wide text-foreground mb-3">Categories</h3>
              <ul className="space-y-1">
                {ARTICLE_CATEGORIES.map((cat) => (
                  <li key={cat.slug}>
                    <button
                      onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors"
                      style={
                        selectedCategory === cat.name
                          ? { background: 'var(--brand-azure-vivid)', color: 'white' }
                          : undefined
                      }
                    >
                      <span>{cat.name}</span>
                      <span className="text-xs opacity-70">{cat.count}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
