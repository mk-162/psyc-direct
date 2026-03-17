import { notFound } from "next/navigation";
import { Metadata } from "next";
import client from "../../../../tina/__generated__/client";
import { ArticlePage } from "@/components/ArticlePage";
import { getRelatedServices } from "@/lib/relatedServices";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const tinaData = await client.queries.articles({
      relativePath: `${slug}.md`,
    });
    if (tinaData.data.articles) {
      return {
        title: (tinaData.data.articles.title || "") + " | Cocoon",
        description: tinaData.data.articles.description,
      };
    }
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error(e);
  }
  return {};
}

export async function generateStaticParams() {
  const paths: { slug: string }[] = [];
  try {
    const tinaRes = await client.queries.articlesConnection();
    if (tinaRes.data?.articlesConnection.edges) {
      tinaRes.data.articlesConnection.edges.forEach((edge) => {
        if (edge?.node?._sys.filename) {
          paths.push({ slug: edge.node._sys.filename });
        }
      });
    }
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error(e);
  }
  return paths;
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const res = await client.queries.articles({
      relativePath: `${slug}.md`,
    });
    if (res.data?.articles) {
      const tags = (res.data.articles as any).tags || [];
      const relatedServices = await getRelatedServices(tags);

      return (
        <main>
          <ArticlePage
            query={res.query}
            variables={res.variables}
            data={res.data}
            relatedServices={relatedServices}
          />
        </main>
      );
    }
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error(e);
  }

  return notFound();
}
