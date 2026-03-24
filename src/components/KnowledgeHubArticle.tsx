'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Clock, Calendar, User, Tag, ChevronRight, Share2, BookOpen } from 'lucide-react';
import { getArticleBySlug, getRelatedArticles, ARTICLE_CATEGORIES, type Article } from '@/lib/articles';

function RelatedCard({ article }: { article: Article }) {
  return (
    <Link href={`/knowledge-hub/${article.slug}/`}>
      <Card className="group bg-background border border-border hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
        <div className="h-36 overflow-hidden rounded-t-md relative">
          <Image src={article.image} alt={article.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="33vw" />
        </div>
        <div className="p-4 flex flex-col flex-1">
          <span className="text-[var(--brand-azure-vivid)] text-[10px] font-bold uppercase tracking-wide mb-1">{article.category}</span>
          <h4 className="font-sans text-sm font-bold text-foreground leading-snug line-clamp-2 mb-2">{article.title}</h4>
          <div className="flex items-center gap-2 mt-auto text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{article.readTime} min read</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export function KnowledgeHubArticle({ slug }: { slug: string }) {
  const article = useMemo(() => getArticleBySlug(slug), [slug]);
  const relatedArticles = useMemo(() => (article ? getRelatedArticles(article) : []), [article]);

  if (!article) {
    return (
      <div className="flex-1 flex items-center justify-center py-32 px-4">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="font-sans text-2xl font-bold text-foreground mb-2">Article not found</h1>
          <p className="text-muted-foreground mb-6">The article you&apos;re looking for doesn&apos;t exist or has been moved.</p>
          <Button asChild variant="secondary">
            <Link href="/knowledge-hub/"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Knowledge Hub</Link>
          </Button>
        </div>
      </div>
    );
  }

  const categorySlug = ARTICLE_CATEGORIES.find((c) => c.name === article.category)?.slug || '';
  const publishDate = new Date(article.publishedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  // Split content at midpoint for mid-article CTA
  const contentParts = article.content.split('</h2>');
  const midPoint = Math.ceil(contentParts.length / 2);
  const firstHalf = contentParts.slice(0, midPoint).join('</h2>');
  const secondHalf = contentParts.slice(midPoint).join('</h2>');

  return (
    <>
      {/* Breadcrumb */}
      <nav className="border-b bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <ol className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
            <li><Link href="/" className="hover:text-foreground transition-colors">Home</Link></li>
            <ChevronRight className="w-3 h-3" />
            <li><Link href="/knowledge-hub/" className="hover:text-foreground transition-colors">Knowledge Hub</Link></li>
            <ChevronRight className="w-3 h-3" />
            <li>
              <Link href={`/knowledge-hub/?category=${categorySlug}`} className="hover:text-foreground transition-colors">
                {article.category}
              </Link>
            </li>
            <ChevronRight className="w-3 h-3" />
            <li className="text-foreground font-medium truncate max-w-[200px] sm:max-w-none">{article.title}</li>
          </ol>
        </div>
      </nav>

      <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12">
          {/* Main */}
          <div className="flex-1 min-w-0 max-w-3xl">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <Link href={`/knowledge-hub/?category=${categorySlug}`}>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide text-[var(--brand-azure)] bg-[var(--brand-navy)] cursor-pointer">
                    {article.category}
                  </span>
                </Link>
                {article.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px] font-medium">
                    <Tag className="w-2.5 h-2.5" />
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-4">
                {article.title}
              </h1>

              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-6">
                {article.excerpt}
              </p>

              <div className="flex items-center gap-4 flex-wrap text-sm text-muted-foreground border-y py-4 mb-8">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>
                    <span className="font-semibold text-foreground">{article.author}</span>
                    <span className="mx-1">&middot;</span>
                    {article.authorRole}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={article.publishedDate}>{publishDate}</time>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{article.readTime} min read</span>
                </div>
                <button
                  className="ml-auto flex items-center gap-1.5 font-semibold text-xs"
                  style={{ color: 'var(--brand-azure-vivid)' }}
                  onClick={() => {
                    if (typeof navigator !== 'undefined' && navigator.share) {
                      navigator.share({ title: article.title, url: window.location.href });
                    } else if (typeof navigator !== 'undefined') {
                      navigator.clipboard.writeText(window.location.href);
                    }
                  }}
                >
                  <Share2 className="w-4 h-4" /> Share
                </button>
              </div>
            </div>

            {/* Featured image */}
            <div className="rounded-md overflow-hidden mb-8 relative h-48 sm:h-64 lg:h-80">
              <Image src={article.image} alt={article.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 66vw" priority />
            </div>

            {/* Body first half */}
            <div
              className="prose prose-sm sm:prose max-w-none mb-8 prose-headings:font-sans prose-headings:text-foreground prose-h2:text-xl prose-h2:sm:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-p:text-muted-foreground prose-p:leading-relaxed prose-li:text-muted-foreground prose-strong:text-foreground prose-ul:my-4 prose-li:my-1"
              dangerouslySetInnerHTML={{ __html: firstHalf }}
            />

            {/* Mid-article CTA */}
            <div className="my-10 rounded-xl p-6 sm:p-8" style={{ background: 'var(--brand-bg-tint)' }}>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-sans text-lg font-bold mb-2" style={{ color: 'var(--brand-navy)' }}>Need an Expert for Your Case?</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Our team matches you with the right psychologist or psychiatrist within 24 hours.
                  </p>
                </div>
                <Button asChild className="font-semibold text-white shrink-0" style={{ background: 'var(--brand-navy)' }}>
                  <Link href="/contact/">Get in Touch <ArrowRight className="w-4 h-4 ml-1" /></Link>
                </Button>
              </div>
            </div>

            {/* Body second half */}
            {secondHalf.trim() && (
              <div
                className="prose prose-sm sm:prose max-w-none mb-8 prose-headings:font-sans prose-headings:text-foreground prose-h2:text-xl prose-h2:sm:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-p:text-muted-foreground prose-p:leading-relaxed prose-li:text-muted-foreground prose-strong:text-foreground prose-ul:my-4 prose-li:my-1"
                dangerouslySetInnerHTML={{ __html: secondHalf }}
              />
            )}

            {/* Tags footer */}
            <div className="border-t pt-6 mt-10">
              <h3 className="font-sans text-sm font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--brand-azure-vivid)' }}>
                Topics covered
              </h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Link key={tag} href={`/knowledge-hub/?tag=${encodeURIComponent(tag)}`}>
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-xs font-medium cursor-pointer hover:text-foreground transition-colors">
                      <Tag className="w-3 h-3" /> {tag}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <Button asChild variant="secondary">
                <Link href="/knowledge-hub/"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Knowledge Hub</Link>
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-72 xl:w-80 flex-shrink-0 space-y-8">
            <div className="lg:sticky lg:top-24 space-y-8">
              {/* CTA */}
              <div className="rounded-xl p-5" style={{ background: 'var(--brand-bg-tint)' }}>
                <h3 className="font-sans text-sm font-bold mb-2" style={{ color: 'var(--brand-navy)' }}>Need an Expert?</h3>
                <p className="text-muted-foreground text-xs leading-relaxed mb-3">
                  Connect with the right psychologist or psychiatrist for your case today.
                </p>
                <Button asChild size="sm" className="w-full font-semibold text-white" style={{ background: 'var(--brand-navy)' }}>
                  <Link href="/contact/">Get in Touch <ArrowRight className="w-4 h-4 ml-1" /></Link>
                </Button>
              </div>

              {/* Related articles */}
              {relatedArticles.length > 0 && (
                <div>
                  <h3 className="font-sans text-sm font-bold uppercase tracking-wide text-foreground mb-3">Related Articles</h3>
                  <div className="space-y-4">
                    {relatedArticles.map((related) => (
                      <RelatedCard key={related.id} article={related} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </article>

      {/* Related strip */}
      {relatedArticles.length > 0 && (
        <section className="py-12" style={{ background: 'var(--brand-bg-tint)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-sans text-sm font-bold uppercase tracking-wide text-center mb-6" style={{ color: 'var(--brand-azure-vivid)' }}>
              You might also like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedArticles.map((related) => (
                <RelatedCard key={related.id} article={related} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
