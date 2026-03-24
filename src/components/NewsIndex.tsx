'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, ArrowRight, ChevronRight, Newspaper, X } from 'lucide-react';
import { BLOG_POSTS, BLOG_CATEGORIES, searchBlogPosts, type BlogPost } from '@/lib/blog-posts';

function BlogCardLarge({ post }: { post: BlogPost }) {
  return (
    <Link href={`/news/${post.slug}`}>
      <Card className="group bg-background border border-border hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/2 h-56 lg:h-auto overflow-hidden rounded-t-md lg:rounded-l-md lg:rounded-tr-none relative">
            <Image src={post.image} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 1024px) 100vw, 50vw" />
          </div>
          <div className="flex-1 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
            <span className="text-[var(--brand-azure-vivid)] text-xs font-bold uppercase tracking-wide mb-2">{post.category}</span>
            <h2 className="font-sans text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-3 leading-snug">
              {post.title}
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <span className="text-sm text-muted-foreground">
                {new Date(post.publishedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
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

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/news/${post.slug}`}>
      <Card className="group bg-background border border-border hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
        <div className="h-44 overflow-hidden rounded-t-md relative">
          <Image src={post.image} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 640px) 100vw, 50vw" />
        </div>
        <div className="p-5 flex flex-col flex-1">
          <span className="text-[var(--brand-azure-vivid)] text-[10px] font-bold uppercase tracking-wide mb-1">{post.category}</span>
          <h3 className="font-sans text-base font-bold text-foreground mb-2 leading-snug line-clamp-2">{post.title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1 line-clamp-2">{post.excerpt}</p>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-xs text-muted-foreground">
              {new Date(post.publishedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
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

export function NewsIndex() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');

  // Sync category with URL param
  const urlCategory = searchParams.get('category');
  const selectedCategory = useMemo(() => {
    if (!urlCategory) return null;
    const match = BLOG_CATEGORIES.find((c) => c.slug === urlCategory);
    return match ? match.name : null;
  }, [urlCategory]);

  function setSelectedCategory(name: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (name === null) {
      params.delete('category');
    } else {
      const slug = BLOG_CATEGORIES.find((c) => c.name === name)?.slug ?? '';
      params.set('category', slug);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const filteredPosts = useMemo(() => {
    let results = BLOG_POSTS;
    if (searchQuery.trim()) results = searchBlogPosts(searchQuery);
    if (selectedCategory) results = results.filter((p) => p.category === selectedCategory);
    return results;
  }, [searchQuery, selectedCategory]);

  const featuredPost = BLOG_POSTS.find((p) => p.featured);
  const nonFeaturedPosts = filteredPosts.filter((p) => !p.featured || searchQuery || selectedCategory);
  const hasActiveFilters = searchQuery || selectedCategory;

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
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
                placeholder="Search posts..."
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
              variant={selectedCategory === null ? 'default' : 'secondary'}
              onClick={() => setSelectedCategory(null)}
              className={selectedCategory === null ? 'text-white' : ''}
              style={selectedCategory === null ? { background: 'var(--brand-navy)' } : undefined}
            >
              All Posts
            </Button>
            {BLOG_CATEGORIES.map((cat) => (
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
<button onClick={clearFilters} className="text-xs font-semibold ml-2" style={{ color: 'var(--brand-azure-vivid)' }}>Clear all</button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12">
          {/* Main column */}
          <div className="flex-1 min-w-0">
            {!hasActiveFilters && featuredPost && (
              <div className="mb-10">
                <h2 className="font-sans text-sm font-bold uppercase tracking-wide mb-4" style={{ color: 'var(--brand-azure-vivid)' }}>Featured Post</h2>
                <BlogCardLarge post={featuredPost} />
              </div>
            )}

            {filteredPosts.length === 0 ? (
              <div className="text-center py-16">
                <Newspaper className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-sans text-lg font-bold text-foreground mb-2">No posts found</h3>
                <p className="text-muted-foreground text-sm mb-4">Try adjusting your filters.</p>
                <Button variant="secondary" onClick={clearFilters}>Clear filters</Button>
              </div>
            ) : (
              <div>
                <h2 className="font-sans text-sm font-bold uppercase tracking-wide mb-4" style={{ color: 'var(--brand-azure-vivid)' }}>
                  {hasActiveFilters ? `${filteredPosts.length} Post${filteredPosts.length !== 1 ? 's' : ''} Found` : 'Latest Posts'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {nonFeaturedPosts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:w-72 xl:w-80 flex-shrink-0 space-y-8">
            {/* Categories */}
            <div>
              <h3 className="font-sans text-sm font-bold uppercase tracking-wide text-foreground mb-3">Categories</h3>
              <ul className="space-y-1">
                {BLOG_CATEGORIES.map((cat) => (
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
          </aside>
        </div>
      </div>
    </>
  );
}
