import { useMemo } from "react";
import { Link, useParams } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Clock,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Newspaper,
  FolderOpen,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { BLOG_CATEGORIES, getBlogPostsByCategory, type BlogPost } from "@/lib/blog-posts";
import { CTASidebar } from "@/components/cta-widgets";

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <Card
        className="group bg-background border-none hover-elevate cursor-pointer h-full flex flex-col"
        data-testid={`card-catblog-${post.id}`}
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
          <h3 className="font-sans text-base font-bold text-foreground mb-2 leading-snug line-clamp-2" data-testid={`text-catblog-title-${post.id}`}>
            {post.title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1 line-clamp-2">
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between gap-2 mt-auto">
            <span className="text-xs text-muted-foreground">
              {new Date(post.publishedDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            </span>
            <span className="text-[#066aab] text-xs font-semibold inline-flex items-center gap-0.5">
              Read <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default function BlogCategory() {
  const params = useParams<{ slug: string }>();
  const category = useMemo(
    () => BLOG_CATEGORIES.find((c) => c.slug === params.slug),
    [params.slug]
  );
  const posts = useMemo(
    () => (category ? getBlogPostsByCategory(category.name) : []),
    [category]
  );

  if (!category) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center" data-testid="category-not-found">
          <div className="text-center px-4">
            <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="font-serif text-2xl font-bold text-foreground mb-2">Category not found</h1>
            <p className="text-muted-foreground mb-6">
              The category you're looking for doesn't exist.
            </p>
            <Link href="/blog">
              <Button data-testid="button-back-to-blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="bg-[#032552] dark:bg-[#021b3d] py-12 sm:py-16" data-testid="section-blog-cat-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Newspaper className="w-5 h-5 text-[#2eabe0]" />
              <span className="text-[#2eabe0] font-sans text-xs font-bold uppercase tracking-widest">Blog</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4" data-testid="text-blog-cat-heading">
              {category.name}
            </h1>
            <p className="text-[#cee4f7] text-base sm:text-lg leading-relaxed">
              {posts.length} post{posts.length !== 1 ? "s" : ""} in this category
            </p>
          </div>
        </div>
      </section>

      <nav className="border-b bg-background" data-testid="blog-cat-breadcrumb">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <ol className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
            <li>
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            </li>
            <ChevronRight className="w-3 h-3" />
            <li>
              <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            </li>
            <ChevronRight className="w-3 h-3" />
            <li className="text-foreground font-medium">{category.name}</li>
          </ol>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14" data-testid="section-blog-cat-content">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12">
          <div className="flex-1 min-w-0">
            {posts.length === 0 ? (
              <div className="text-center py-16" data-testid="blog-cat-empty-state">
                <Newspaper className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-sans text-lg font-bold text-foreground mb-2">No posts yet</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  We haven't published any posts in this category yet. Check back soon.
                </p>
                <Link href="/blog">
                  <Button variant="secondary" data-testid="button-blog-cat-back">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Blog
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {posts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            )}

            <div className="mt-8">
              <Link href="/blog">
                <Button variant="secondary" data-testid="button-blog-cat-back-bottom">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  All Blog Posts
                </Button>
              </Link>
            </div>
          </div>

          <aside className="lg:w-72 xl:w-80 flex-shrink-0 space-y-8" data-testid="sidebar-blog-cat">
            <CTASidebar />

            <div>
              <h3 className="font-sans text-sm font-bold uppercase tracking-wide text-foreground mb-3">
                All Categories
              </h3>
              <ul className="space-y-1">
                {BLOG_CATEGORIES.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={`/blog/category/${cat.slug}`}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                        cat.slug === params.slug
                          ? "bg-[#066aab] text-white"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                      data-testid={`link-blog-cat-${cat.slug}`}
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
                <Button size="sm" className="w-full" data-testid="button-blog-cat-sidebar-contact">
                  Get in Touch
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </aside>
        </div>
      </div>

      <footer className="bg-[#021b3d] dark:bg-[#010f22] py-8" data-testid="footer-blog-cat">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <img src="https://www.psychologydirect.co.uk/wp-content/themes/psychologydirect-2018/images/svg/footer-logo.svg" alt="Psychology Direct" className="h-8 w-auto" />
          <p className="text-[#cee4f7]/50 text-xs">
            &copy; {new Date().getFullYear()} Psychology Direct. All rights reserved.
          </p>
          <nav className="flex items-center gap-4">
            <Link href="/" className="text-[#cee4f7]/50 text-xs hover:text-white transition-colors">Home</Link>
            <Link href="/blog" className="text-[#cee4f7]/50 text-xs hover:text-white transition-colors">Blog</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
