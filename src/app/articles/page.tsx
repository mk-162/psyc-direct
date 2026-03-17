import { Metadata } from "next";
import client from "../../../tina/__generated__/client";
import { ArticlesIndex } from "@/components/ArticlesIndex";

export const metadata: Metadata = {
  title: "Articles | Cocoon",
  description:
    "Evidence-based health articles from the Cocoon clinical team. Longevity, nutrition, movement, mental health, sleep, and preventive care.",
};

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

export default async function ArticlesPage() {
  const articles: ArticleSummary[] = [];

  try {
    const res = await client.queries.articlesConnection();
    if (res.data?.articlesConnection.edges) {
      for (const edge of res.data.articlesConnection.edges) {
        if (!edge?.node) continue;
        const n = edge.node as any;
        articles.push({
          slug: n._sys.filename,
          title: n.title || "",
          description: n.description || "",
          featured_image: n.featured_image || "",
          category: n.category || "",
          date: n.date || "",
          author: n.author || "",
          read_time: n.read_time || "",
        });
      }
    }
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error(e);
  }

  // Sort by date descending
  articles.sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Extract unique categories
  const categories = Array.from(
    new Set(articles.map((a) => a.category).filter(Boolean))
  ).sort();

  return (
    <main>
      <ArticlesIndex articles={articles} categories={categories} />
    </main>
  );
}
