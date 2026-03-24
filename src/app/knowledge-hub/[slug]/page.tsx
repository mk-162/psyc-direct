import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/tina-page-helpers";
import { KnowledgeHubArticle } from "@/components/KnowledgeHubArticle";
import { ARTICLES, getArticleBySlug } from "@/lib/articles";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: `${article.title} | Psychology Direct`,
    description: article.excerpt,
    alternates: { canonical: `${SITE_URL}/knowledge-hub/${slug}/` },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [{ url: article.image }],
    },
  };
}

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return notFound();
  return <KnowledgeHubArticle slug={slug} />;
}
