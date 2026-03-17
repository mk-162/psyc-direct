import { notFound } from "next/navigation";
import { Metadata } from "next";
import client from "../../../../tina/__generated__/client";
import { EditorialPageClient } from "@/components/blocks/EditorialPageClient";
import { KnowledgeHubWithSidebar } from "@/components/KnowledgeHubWithSidebar";
import { getRelatedServices } from "@/lib/relatedServices";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  // Try block page first for index
  try {
    const blockData = await client.queries.pages({
      relativePath: `knowledge-hub.json`,
    });
    if (slug === "index" && blockData.data?.pages) {
      return {
        title:
          (blockData.data.pages.title || "") + " | Cocoon" ||
          "Knowledge Hub | Cocoon",
        description: blockData.data.pages.description,
      };
    }
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error(e);
  }

  try {
    const tinaData = await client.queries.knowledgeHubPages({
      relativePath: `${slug}.md`,
    });
    if (tinaData.data.knowledgeHubPages) {
      return {
        title:
          (tinaData.data.knowledgeHubPages.title || "") + " | Cocoon" ||
          `${slug.replace(/-/g, " ")} | Cocoon Knowledge Hub`,
        description: tinaData.data.knowledgeHubPages.description,
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
    const tinaRes = await client.queries.knowledgeHubPagesConnection();
    if (tinaRes.data?.knowledgeHubPagesConnection.edges) {
      tinaRes.data.knowledgeHubPagesConnection.edges.forEach((edge) => {
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

  // For the index page, try block-based version first
  if (slug === "index") {
    try {
      const blockRes = await client.queries.pages({
        relativePath: `knowledge-hub.json`,
      });
      if (
        blockRes.data?.pages?.blocks &&
        blockRes.data.pages.blocks.length > 0
      ) {
        return (
          <main>
            <EditorialPageClient
              query={blockRes.query}
              variables={blockRes.variables}
              data={blockRes.data}
              collection="pages"
            />
          </main>
        );
      }
    } catch (e) {
      if (process.env.NODE_ENV === "development") console.error(e);
    }
  }

  try {
    const res = await client.queries.knowledgeHubPages({
      relativePath: `${slug}.md`,
    });
    if (res.data?.knowledgeHubPages) {
      const page = res.data.knowledgeHubPages as any;
      const tags = page.tags || [];
      const hasTags = tags.filter(Boolean).length > 0;

      // If the page has tags, render with sidebar; otherwise plain editorial
      if (hasTags) {
        const relatedServices = await getRelatedServices(tags);
        return (
          <main>
            <KnowledgeHubWithSidebar
              query={res.query}
              variables={res.variables}
              data={res.data}
              relatedServices={relatedServices}
            />
          </main>
        );
      }

      return (
        <main>
          <EditorialPageClient
            query={res.query}
            variables={res.variables}
            data={res.data}
          />
        </main>
      );
    }
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error(e);
  }

  return notFound();
}
