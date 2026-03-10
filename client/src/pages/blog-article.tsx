import { useMemo } from "react";
import { Link, useParams } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Clock,
  Calendar,
  User,
  Tag,
  ChevronRight,
  Newspaper,
  Share2,
} from "lucide-react";
import { getBlogPostBySlug, getRelatedBlogPosts, type BlogPost } from "@/lib/blog-posts";
import { BLOG_CATEGORIES } from "@/lib/blog-posts";
import { CTAInlineCard, CTASidebar } from "@/components/cta-widgets";
import { SiteHeader } from "@/components/site-header";

function RelatedBlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <Card
        className="group bg-background border-none hover-elevate cursor-pointer h-full flex flex-col"
        data-testid={`card-related-blog-${post.id}`}
      >
        <div className="h-36 overflow-hidden rounded-t-md">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-4 flex flex-col flex-1">
          <span className="text-[#066aab] text-[10px] font-bold uppercase tracking-wide mb-1">{post.category}</span>
          <h4 className="font-sans text-sm font-bold text-foreground leading-snug line-clamp-2 mb-2" data-testid={`text-related-blog-title-${post.id}`}>
            {post.title}
          </h4>
          <div className="flex items-center gap-2 mt-auto text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{post.readTime} min read</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default function BlogArticle() {
  const params = useParams<{ slug: string }>();
  const post = useMemo(() => getBlogPostBySlug(params.slug || ""), [params.slug]);
  const relatedPosts = useMemo(() => (post ? getRelatedBlogPosts(post) : []), [post]);

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center" data-testid="blog-article-not-found">
          <div className="text-center px-4">
            <Newspaper className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="font-serif text-2xl font-bold text-foreground mb-2">Post not found</h1>
            <p className="text-muted-foreground mb-6">
              The blog post you're looking for doesn't exist or has been moved.
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

  const categorySlug = BLOG_CATEGORIES.find((c) => c.name === post.category)?.slug || "";

  const contentParts = post.content.split("</h2>");
  const midPoint = Math.ceil(contentParts.length / 2);
  const firstHalf = contentParts.slice(0, midPoint).join("</h2>");
  const secondHalf = contentParts.slice(midPoint).join("</h2>");

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    author: { "@type": post.author === "Psychology Direct" ? "Organization" : "Person", name: post.author },
    publisher: { "@type": "Organization", name: "Psychology Direct" },
    datePublished: post.publishedDate,
    articleSection: post.category,
    keywords: post.tags.join(", "),
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <SiteHeader />

      <nav className="border-b bg-background" data-testid="blog-breadcrumb">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <ol className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap" itemScope itemType="https://schema.org/BreadcrumbList">
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <Link href="/" className="hover:text-foreground transition-colors">
                <span itemProp="name">Home</span>
              </Link>
              <meta itemProp="position" content="1" />
            </li>
            <ChevronRight className="w-3 h-3" />
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <Link href="/blog" className="hover:text-foreground transition-colors">
                <span itemProp="name">Blog</span>
              </Link>
              <meta itemProp="position" content="2" />
            </li>
            <ChevronRight className="w-3 h-3" />
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <Link href={`/blog/category/${categorySlug}`} className="hover:text-foreground transition-colors">
                <span itemProp="name">{post.category}</span>
              </Link>
              <meta itemProp="position" content="3" />
            </li>
            <ChevronRight className="w-3 h-3" />
            <li className="text-foreground font-medium truncate max-w-[200px] sm:max-w-none" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <span itemProp="name">{post.title}</span>
              <meta itemProp="position" content="4" />
            </li>
          </ol>
        </div>
      </nav>

      <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12" data-testid="blog-article-content" itemScope itemType="https://schema.org/BlogPosting">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12">
          <div className="flex-1 min-w-0 max-w-3xl">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <Link href={`/blog/category/${categorySlug}`}>
                  <span className="inline-block px-3 py-1 rounded-full bg-[#032552] dark:bg-[#066aab]/20 text-[#2eabe0] text-xs font-bold uppercase tracking-wide cursor-pointer" data-testid="badge-blog-category">
                    {post.category}
                  </span>
                </Link>
                {post.tags.map((tag) => (
                  <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px] font-medium cursor-pointer hover:text-foreground transition-colors">
                      <Tag className="w-2.5 h-2.5" />
                      {tag}
                    </span>
                  </Link>
                ))}
              </div>

              <h1
                className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-4"
                itemProp="headline"
                data-testid="text-blog-article-title"
              >
                {post.title}
              </h1>

              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-6" itemProp="description" data-testid="text-blog-article-excerpt">
                {post.excerpt}
              </p>

              <div className="flex items-center gap-4 flex-wrap text-sm text-muted-foreground border-y py-4 mb-8">
                <div className="flex items-center gap-2" data-testid="text-blog-article-author">
                  <User className="w-4 h-4" />
                  <span>
                    <span className="font-semibold text-foreground" itemProp="author">{post.author}</span>
                    <span className="mx-1">·</span>
                    {post.authorRole}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={post.publishedDate} itemProp="datePublished">
                    {new Date(post.publishedDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                  </time>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime} min read</span>
                </div>
                <button
                  className="ml-auto flex items-center gap-1.5 text-[#066aab] font-semibold text-xs"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: post.title, url: window.location.href });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                    }
                  }}
                  data-testid="button-blog-share"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>

            <div className="rounded-md overflow-hidden mb-8 h-48 sm:h-64 lg:h-80">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
                itemProp="image"
                data-testid="img-blog-article-hero"
              />
            </div>

            <div
              className="prose prose-slate dark:prose-invert max-w-none mb-8
                prose-headings:font-serif prose-headings:text-foreground
                prose-h2:text-xl prose-h2:sm:text-2xl prose-h2:mt-10 prose-h2:mb-4
                prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:text-[15px]
                prose-li:text-muted-foreground prose-li:text-[15px]
                prose-strong:text-foreground
                prose-ul:my-4 prose-li:my-1"
              dangerouslySetInnerHTML={{ __html: firstHalf }}
              data-testid="blog-article-body-first"
            />

            <div className="my-10">
              <CTAInlineCard />
            </div>

            <div
              className="prose prose-slate dark:prose-invert max-w-none mb-8
                prose-headings:font-serif prose-headings:text-foreground
                prose-h2:text-xl prose-h2:sm:text-2xl prose-h2:mt-10 prose-h2:mb-4
                prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:text-[15px]
                prose-li:text-muted-foreground prose-li:text-[15px]
                prose-strong:text-foreground
                prose-ul:my-4 prose-li:my-1"
              dangerouslySetInnerHTML={{ __html: secondHalf }}
              data-testid="blog-article-body-second"
            />

            <div className="border-t pt-6 mt-10">
              <h3 className="font-sans text-sm font-bold uppercase tracking-wide text-[#066aab] mb-3">
                Topics covered
              </h3>
              <div className="flex flex-wrap gap-2" data-testid="blog-article-tags">
                {post.tags.map((tag) => (
                  <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}>
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-xs font-medium cursor-pointer hover:text-foreground transition-colors">
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <Link href="/blog">
                <Button variant="secondary" data-testid="button-back-blog">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Blog
                </Button>
              </Link>
            </div>
          </div>

          <aside className="lg:w-72 xl:w-80 flex-shrink-0 space-y-8" data-testid="sidebar-blog-article">
            <div className="lg:sticky lg:top-24">
              <div className="space-y-8">
                <CTASidebar />

                {relatedPosts.length > 0 && (
                  <div>
                    <h3 className="font-sans text-sm font-bold uppercase tracking-wide text-foreground mb-3">
                      Related Posts
                    </h3>
                    <div className="space-y-4">
                      {relatedPosts.map((related) => (
                        <RelatedBlogCard key={related.id} post={related} />
                      ))}
                    </div>
                  </div>
                )}

                <div className="rounded-md bg-[#f0f5ff] dark:bg-[#0d1929] p-5">
                  <h3 className="font-sans text-sm font-bold text-foreground mb-2">Need an Expert?</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed mb-3">
                    Connect with the right psychologist or psychiatrist for your case today.
                  </p>
                  <Link href="/#contact">
                    <Button size="sm" className="w-full" data-testid="button-blog-article-sidebar-contact">
                      Get in Touch
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <section className="py-12 bg-[#f0f5ff] dark:bg-[#0d1929]" data-testid="section-blog-related">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-sans text-sm font-bold uppercase tracking-wide text-[#066aab] mb-6 text-center" data-testid="text-blog-related-label">
              You might also like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedPosts.map((related) => (
                <RelatedBlogCard key={related.id} post={related} />
              ))}
            </div>
          </div>
        </section>
      )}

      <footer className="bg-[#021b3d] dark:bg-[#010f22] py-8" data-testid="footer-blog-article">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <img src="/images/logo.png" alt="Psychology Direct" className="h-8 w-auto brightness-0 invert" />
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
