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
  BookOpen,
  Share2,
} from "lucide-react";
import { getArticleBySlug, getRelatedArticles, type Article } from "@/lib/articles";
import { CTAInlineCard, CTASidebar } from "@/components/cta-widgets";
import { SiteHeader } from "@/components/site-header";

function RelatedArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/knowledge-hub/${article.slug}`}>
      <Card
        className="group bg-background border-none hover-elevate cursor-pointer h-full flex flex-col"
        data-testid={`card-related-${article.id}`}
      >
        <div className="h-36 overflow-hidden rounded-t-md">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-4 flex flex-col flex-1">
          <span className="text-[#066aab] text-[10px] font-bold uppercase tracking-wide mb-1">{article.category}</span>
          <h4 className="font-sans text-sm font-bold text-foreground leading-snug line-clamp-2 mb-2" data-testid={`text-related-title-${article.id}`}>
            {article.title}
          </h4>
          <div className="flex items-center gap-2 mt-auto text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{article.readTime} min read</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default function ArticlePage() {
  const params = useParams<{ slug: string }>();
  const article = useMemo(() => getArticleBySlug(params.slug || ""), [params.slug]);
  const relatedArticles = useMemo(() => (article ? getRelatedArticles(article) : []), [article]);

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center" data-testid="article-not-found">
          <div className="text-center px-4">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="font-serif text-2xl font-bold text-foreground mb-2">Article not found</h1>
            <p className="text-muted-foreground mb-6">
              The article you're looking for doesn't exist or has been moved.
            </p>
            <Link href="/knowledge-hub">
              <Button data-testid="button-back-to-hub">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Knowledge Hub
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const contentParts = article.content.split("</h2>");
  const midPoint = Math.ceil(contentParts.length / 2);
  const firstHalf = contentParts.slice(0, midPoint).join("</h2>");
  const secondHalf = contentParts.slice(midPoint).join("</h2>");

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: article.image,
    author: { "@type": "Person", name: article.author },
    publisher: { "@type": "Organization", name: "Psychology Direct" },
    datePublished: article.publishedDate,
    articleSection: article.category,
    keywords: article.tags.join(", "),
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <SiteHeader />

      <nav className="border-b bg-background" data-testid="breadcrumb">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <ol className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap" itemScope itemType="https://schema.org/BreadcrumbList">
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <Link href="/">
                <a itemProp="item" className="hover:text-foreground transition-colors">
                  <span itemProp="name">Home</span>
                </a>
              </Link>
              <meta itemProp="position" content="1" />
            </li>
            <ChevronRight className="w-3 h-3" />
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <Link href="/knowledge-hub">
                <a itemProp="item" className="hover:text-foreground transition-colors">
                  <span itemProp="name">Knowledge Hub</span>
                </a>
              </Link>
              <meta itemProp="position" content="2" />
            </li>
            <ChevronRight className="w-3 h-3" />
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <Link href={`/knowledge-hub?category=${encodeURIComponent(article.category)}`}>
                <a itemProp="item" className="hover:text-foreground transition-colors">
                  <span itemProp="name">{article.category}</span>
                </a>
              </Link>
              <meta itemProp="position" content="3" />
            </li>
            <ChevronRight className="w-3 h-3" />
            <li className="text-foreground font-medium truncate max-w-[200px] sm:max-w-none" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <span itemProp="name">{article.title}</span>
              <meta itemProp="position" content="4" />
            </li>
          </ol>
        </div>
      </nav>

      <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12" data-testid="article-content" itemScope itemType="https://schema.org/Article">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12">
          <div className="flex-1 min-w-0 max-w-3xl">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <Link href={`/knowledge-hub?category=${encodeURIComponent(article.category)}`}>
                  <span className="inline-block px-3 py-1 rounded-full bg-[#032552] dark:bg-[#066aab]/20 text-[#2eabe0] text-xs font-bold uppercase tracking-wide cursor-pointer" data-testid="badge-article-category">
                    {article.category}
                  </span>
                </Link>
                {article.tags.map((tag) => (
                  <Link key={tag} href={`/knowledge-hub?tag=${encodeURIComponent(tag)}`}>
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
                data-testid="text-article-title"
              >
                {article.title}
              </h1>

              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-6" itemProp="description" data-testid="text-article-excerpt">
                {article.excerpt}
              </p>

              <div className="flex items-center gap-4 flex-wrap text-sm text-muted-foreground border-y py-4 mb-8">
                <div className="flex items-center gap-2" data-testid="text-article-author">
                  <User className="w-4 h-4" />
                  <span>
                    <span className="font-semibold text-foreground" itemProp="author">{article.author}</span>
                    <span className="mx-1">·</span>
                    {article.authorRole}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={article.publishedDate} itemProp="datePublished">
                    {new Date(article.publishedDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                  </time>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{article.readTime} min read</span>
                </div>
                <button
                  className="ml-auto flex items-center gap-1.5 text-[#066aab] font-semibold text-xs"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: article.title, url: window.location.href });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                    }
                  }}
                  data-testid="button-share"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>

            <div className="rounded-md overflow-hidden mb-8 h-48 sm:h-64 lg:h-80">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
                itemProp="image"
                data-testid="img-article-hero"
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
              data-testid="article-body-first"
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
              data-testid="article-body-second"
            />

            <div className="border-t pt-6 mt-10">
              <h3 className="font-sans text-sm font-bold uppercase tracking-wide text-[#066aab] mb-3">
                Topics covered
              </h3>
              <div className="flex flex-wrap gap-2" data-testid="article-tags">
                {article.tags.map((tag) => (
                  <Link key={tag} href={`/knowledge-hub?tag=${encodeURIComponent(tag)}`}>
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-xs font-medium cursor-pointer hover:text-foreground transition-colors">
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <Link href="/knowledge-hub">
                <Button variant="secondary" data-testid="button-back-hub">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Knowledge Hub
                </Button>
              </Link>
            </div>
          </div>

          <aside className="lg:w-72 xl:w-80 flex-shrink-0 space-y-8" data-testid="sidebar-article">
            <div className="lg:sticky lg:top-24">
              <div className="space-y-8">
                <CTASidebar />

                <div>
                  <h3 className="font-sans text-sm font-bold uppercase tracking-wide text-foreground mb-3">
                    Related Articles
                  </h3>
                  <div className="space-y-4">
                    {relatedArticles.map((related) => (
                      <RelatedArticleCard key={related.id} article={related} />
                    ))}
                  </div>
                </div>

                <div className="rounded-md bg-[#f0f5ff] dark:bg-[#0d1929] p-5">
                  <h3 className="font-sans text-sm font-bold text-foreground mb-2">Need an Expert?</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed mb-3">
                    Connect with the right psychologist or psychiatrist for your case today.
                  </p>
                  <Link href="/#contact">
                    <Button size="sm" className="w-full" data-testid="button-sidebar-contact-article">
                      Get in Touch
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </article>

      {relatedArticles.length > 0 && (
        <section className="py-12 bg-[#f0f5ff] dark:bg-[#0d1929]" data-testid="section-related">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-sans text-sm font-bold uppercase tracking-wide text-[#066aab] mb-6 text-center" data-testid="text-related-label">
              You might also like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedArticles.map((related) => (
                <RelatedArticleCard key={related.id} article={related} />
              ))}
            </div>
          </div>
        </section>
      )}

      <footer className="bg-[#021b3d] dark:bg-[#010f22] py-8" data-testid="footer-article">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <img src="/images/logo.png" alt="Psychology Direct" className="h-8 w-auto brightness-0 invert" />
          <p className="text-[#cee4f7]/50 text-xs">
            &copy; {new Date().getFullYear()} Psychology Direct. All rights reserved.
          </p>
          <nav className="flex items-center gap-4">
            <Link href="/">
              <a className="text-[#cee4f7]/50 text-xs hover:text-white transition-colors">Home</a>
            </Link>
            <Link href="/knowledge-hub">
              <a className="text-[#cee4f7]/50 text-xs hover:text-white transition-colors">Knowledge Hub</a>
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
