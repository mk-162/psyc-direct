import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Clock,
  ArrowRight,
  ChevronRight,
  Tag,
  Newspaper,
  X,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { BLOG_POSTS, BLOG_CATEGORIES, BLOG_TAGS, searchBlogPosts, type BlogPost } from "@/lib/blog-posts";
import { CTABanner, CTASidebar } from "@/components/cta-widgets";

function BlogCardLarge({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <Card
        className="group bg-background border-none hover-elevate cursor-pointer"
        data-testid={`card-featured-blog-${post.id}`}
      >
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/2 h-56 lg:h-auto overflow-hidden rounded-t-md lg:rounded-l-md lg:rounded-tr-none">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              data-testid={`img-featured-blog-${post.id}`}
            />
          </div>
          <div className="flex-1 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="inline-block px-3 py-1 rounded-full bg-[#032552] dark:bg-[#066aab]/20 text-[#2eabe0] text-xs font-bold uppercase tracking-wide">
                {post.category}
              </span>
              <span className="text-muted-foreground text-xs flex items-center gap-1">
                <Clock className="w-3 h-3" /> {post.readTime} min read
              </span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-3 leading-snug" data-testid={`text-featured-blog-title-${post.id}`}>
              {post.title}
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-4 line-clamp-3">
              {post.excerpt}
            </p>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{post.author}</span>
                <span className="mx-1">·</span>
                {new Date(post.publishedDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
              </div>
              <span className="text-[#066aab] text-sm font-semibold inline-flex items-center gap-1">
                Read post <ArrowRight className="w-4 h-4" />
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
    <Link href={`/blog/${post.slug}`}>
      <Card
        className="group bg-background border-none hover-elevate cursor-pointer h-full flex flex-col"
        data-testid={`card-blog-${post.id}`}
      >
        <div className="h-44 overflow-hidden rounded-t-md">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#032552] dark:bg-[#066aab]/20 text-[#2eabe0] text-[10px] font-bold uppercase tracking-wide">
              {post.category}
            </span>
            <span className="text-muted-foreground text-xs flex items-center gap-1">
              <Clock className="w-3 h-3" /> {post.readTime} min
            </span>
          </div>
          <h3 className="font-sans text-base font-bold text-foreground mb-2 leading-snug line-clamp-2" data-testid={`text-blog-title-${post.id}`}>
            {post.title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1 line-clamp-2">
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between gap-2 mt-auto">
            <span className="text-xs text-muted-foreground">{post.author}</span>
            <span className="text-[#066aab] text-xs font-semibold inline-flex items-center gap-0.5">
              Read <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

function BlogCardCompact({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <div
        className="group flex gap-4 p-4 rounded-md bg-background hover-elevate cursor-pointer"
        data-testid={`card-compact-blog-${post.id}`}
      >
        <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[#066aab] text-[10px] font-bold uppercase tracking-wide">{post.category}</span>
          <h4 className="font-sans text-sm font-bold text-foreground leading-snug line-clamp-2 mt-0.5">
            {post.title}
          </h4>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{post.readTime} min read</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredPosts = useMemo(() => {
    let results = BLOG_POSTS;
    if (searchQuery.trim()) {
      results = searchBlogPosts(searchQuery);
    }
    if (selectedCategory) {
      results = results.filter((p) => p.category === selectedCategory);
    }
    if (selectedTag) {
      results = results.filter((p) => p.tags.includes(selectedTag));
    }
    return results;
  }, [searchQuery, selectedCategory, selectedTag]);

  const featuredPost = BLOG_POSTS.find((p) => p.featured);
  const nonFeaturedPosts = filteredPosts.filter((p) => !p.featured || searchQuery || selectedCategory || selectedTag);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setSelectedTag(null);
  };

  const hasActiveFilters = searchQuery || selectedCategory || selectedTag;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="bg-[#032552] dark:bg-[#021b3d] py-12 sm:py-16" data-testid="section-blog-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Newspaper className="w-5 h-5 text-[#2eabe0]" />
              <span className="text-[#2eabe0] font-sans text-xs font-bold uppercase tracking-widest">Blog</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4" data-testid="text-blog-heading">
              News, Insights & Updates
            </h1>
            <p className="text-[#cee4f7] text-base sm:text-lg leading-relaxed mb-8">
              Stay informed with the latest from Psychology Direct — company news, industry analysis, expert profiles, and practical guidance.
            </p>
            <div className="max-w-lg mx-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <Input
                type="search"
                placeholder="Search blog posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 h-12 text-base"
                data-testid="input-blog-search"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-4 border-b bg-background" data-testid="section-blog-categories">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-wrap">
            <Button
              size="sm"
              variant={selectedCategory === null ? "default" : "secondary"}
              onClick={() => setSelectedCategory(null)}
              data-testid="button-blog-category-all"
            >
              All Posts
            </Button>
            {BLOG_CATEGORIES.map((cat) => (
              <Button
                key={cat.slug}
                size="sm"
                variant={selectedCategory === cat.name ? "default" : "secondary"}
                onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
                data-testid={`button-blog-category-${cat.slug}`}
              >
                {cat.name}
                <span className="ml-1 text-xs opacity-70">({cat.count})</span>
              </Button>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14" data-testid="section-blog-content">
        {hasActiveFilters && (
          <div className="flex items-center gap-2 mb-6 flex-wrap" data-testid="blog-active-filters">
            <span className="text-sm text-muted-foreground">Showing results for:</span>
            {searchQuery && (
              <Badge variant="secondary" className="gap-1">
                "{searchQuery}"
                <button onClick={() => setSearchQuery("")} aria-label="Clear search">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {selectedCategory && (
              <Badge variant="secondary" className="gap-1">
                {selectedCategory}
                <button onClick={() => setSelectedCategory(null)} aria-label="Clear category">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {selectedTag && (
              <Badge variant="secondary" className="gap-1">
                {selectedTag}
                <button onClick={() => setSelectedTag(null)} aria-label="Clear tag">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            <button onClick={clearFilters} className="text-xs text-[#066aab] font-semibold ml-2" data-testid="button-blog-clear-filters">
              Clear all
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12">
          <div className="flex-1 min-w-0">
            {!hasActiveFilters && featuredPost && (
              <div className="mb-10">
                <h2 className="font-sans text-sm font-bold uppercase tracking-wide text-[#066aab] mb-4" data-testid="text-blog-featured-label">
                  Featured Post
                </h2>
                <BlogCardLarge post={featuredPost} />
              </div>
            )}

            {filteredPosts.length === 0 ? (
              <div className="text-center py-16" data-testid="blog-empty-state">
                <Newspaper className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-sans text-lg font-bold text-foreground mb-2">No posts found</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  We couldn't find any posts matching your search. Try adjusting your filters.
                </p>
                <Button variant="secondary" onClick={clearFilters} data-testid="button-blog-clear-empty">
                  Clear filters
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-10">
                  <h2 className="font-sans text-sm font-bold uppercase tracking-wide text-[#066aab] mb-4" data-testid="text-blog-latest-label">
                    {hasActiveFilters ? `${filteredPosts.length} Post${filteredPosts.length !== 1 ? "s" : ""} Found` : "Latest Posts"}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {nonFeaturedPosts.slice(0, 4).map((post) => (
                      <BlogCard key={post.id} post={post} />
                    ))}
                  </div>
                </div>

                {!hasActiveFilters && (
                  <div className="mb-10">
                    <CTABanner />
                  </div>
                )}

                {nonFeaturedPosts.length > 4 && (
                  <div className="mb-10">
                    <h2 className="font-sans text-sm font-bold uppercase tracking-wide text-[#066aab] mb-4" data-testid="text-blog-more-label">
                      More Posts
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {nonFeaturedPosts.slice(4).map((post) => (
                        <BlogCard key={post.id} post={post} />
                      ))}
                    </div>
                  </div>
                )}

                {!hasActiveFilters && (
                  <div className="mb-10">
                    <h2 className="font-sans text-sm font-bold uppercase tracking-wide text-[#066aab] mb-4">
                      Quick Reads
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {BLOG_POSTS.slice(0, 4).map((post) => (
                        <BlogCardCompact key={post.id} post={post} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <aside className="lg:w-72 xl:w-80 flex-shrink-0 space-y-8" data-testid="sidebar-blog">
            <CTASidebar />

            <div>
              <h3 className="font-sans text-sm font-bold uppercase tracking-wide text-foreground mb-3" data-testid="text-blog-tags-label">
                Popular Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {BLOG_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      selectedTag === tag
                        ? "bg-[#066aab] text-white"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                    data-testid={`button-blog-tag-${tag.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <Tag className="w-3 h-3 inline mr-1" />
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-sans text-sm font-bold uppercase tracking-wide text-foreground mb-3" data-testid="text-blog-categories-sidebar-label">
                Categories
              </h3>
              <ul className="space-y-1">
                {BLOG_CATEGORIES.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={`/blog/category/${cat.slug}`}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedCategory === cat.name
                          ? "bg-[#066aab] text-white"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                      data-testid={`button-blog-sidebar-category-${cat.slug}`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-xs opacity-70">{cat.count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-md bg-[#f0f5ff] dark:bg-[#0d1929] p-5">
              <h3 className="font-sans text-sm font-bold text-foreground mb-2">Need an Expert?</h3>
              <p className="text-muted-foreground text-xs leading-relaxed mb-3">
                Connect with the right psychologist or psychiatrist for your case today.
              </p>
              <Link href="/#contact">
                <Button size="sm" className="w-full" data-testid="button-blog-sidebar-contact">
                  Get in Touch
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </aside>
        </div>
      </div>

      <footer className="bg-[#021b3d] dark:bg-[#010f22] py-8" data-testid="footer-blog">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <img src="https://www.psychologydirect.co.uk/wp-content/themes/psychologydirect-2018/images/svg/footer-logo.svg" alt="Psychology Direct" className="h-8 w-auto" />
          <p className="text-[#cee4f7]/50 text-xs">
            &copy; {new Date().getFullYear()} Psychology Direct. All rights reserved.
          </p>
          <nav className="flex items-center gap-4">
            <Link href="/" className="text-[#cee4f7]/50 text-xs hover:text-white transition-colors">Home</Link>
            <Link href="/blog" className="text-[#cee4f7]/50 text-xs hover:text-white transition-colors">Blog</Link>
            <Link href="/knowledge-hub" className="text-[#cee4f7]/50 text-xs hover:text-white transition-colors">Knowledge Hub</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
