import { notFound } from "next/navigation";
import { Metadata } from "next";
import client from "../../../../tina/__generated__/client";
import { EditorialPageClient } from "@/components/blocks/EditorialPageClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const tinaData = await client.queries.utilityPages({ relativePath: `${slug}.md` });
    if (tinaData.data.utilityPages) {
      return {
        title: (tinaData.data.utilityPages.title || "") + " | Cocoon" || `${slug.replace(/-/g, " ")} | Cocoon`,
        description: tinaData.data.utilityPages.description,
      };
    }
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error(e);
    // Ignore and fallback
  }

  return {};
}

export async function generateStaticParams() {
  const paths: { slug: string }[] = [];

  try {
    const tinaRes = await client.queries.utilityPagesConnection();
    if (tinaRes.data?.utilityPagesConnection.edges) {
      tinaRes.data.utilityPagesConnection.edges.forEach((edge) => {
        if (edge?.node?._sys.filename && edge.node._sys.filename !== "contact") {
          paths.push({ slug: edge.node._sys.filename });
        }
      });
    }
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error(e);
    // ignore
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
    const res = await client.queries.utilityPages({ relativePath: `${slug}.md` });
    if (res.data?.utilityPages) {
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
    // Fallback to 404
  }

  return notFound();
}
