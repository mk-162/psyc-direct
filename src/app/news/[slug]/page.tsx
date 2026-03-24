import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/tina-page-helpers";
import { getBlogPostBySlug, BLOG_POSTS } from "@/lib/blog-posts";
import { NewsArticle } from "@/components/NewsArticle";

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return { title: "Post Not Found | Psychology Direct" };
  return {
    title: `${post.title} | Psychology Direct`,
    description: post.excerpt,
    alternates: { canonical: `${SITE_URL}/news/${slug}/` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.image }],
      type: "article",
      publishedTime: post.publishedDate,
      authors: [post.author],
    },
  };
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        image: `${SITE_URL}${post.image}`,
        datePublished: post.publishedDate,
        author: {
          "@type": post.author === "Psychology Direct" ? "Organization" : "Person",
          name: post.author,
        },
        publisher: { "@id": `${SITE_URL}/#organization` },
        mainEntityOfPage: `${SITE_URL}/news/${slug}/`,
        wordCount: Math.round(post.readTime * 250),
        articleSection: post.category,
        keywords: post.tags,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "News", item: `${SITE_URL}/news/` },
          { "@type": "ListItem", position: 3, name: post.title },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <NewsArticle slug={slug} />
    </>
  );
}
