import { notFound } from "next/navigation";
import { Metadata } from "next";
import client from "../../../tina/__generated__/client";
import { EditorialPageClient } from "@/components/blocks/EditorialPageClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const tinaData = await client.queries.pages({ relativePath: `${slug}.json` });
    if (tinaData.data.pages) {
      const rawTitle = tinaData.data.pages.title || `${slug.replace(/-/g, " ")}`;
      const title = rawTitle.includes('Psychology Direct') ? rawTitle : `${rawTitle} | Psychology Direct`;
      return {
        title,
        description: tinaData.data.pages.description,
        ...(slug === 'component-library' ? { robots: { index: false, follow: false } } : {}),
      };
    }
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error(e);
    // Ignore
  }

  return {};
}

export async function generateStaticParams() {
  const paths: { slug: string }[] = [];

  try {
    const tinaRes = await client.queries.pagesConnection();
    if (tinaRes.data?.pagesConnection.edges) {
      tinaRes.data.pagesConnection.edges.forEach((edge) => {
        if (edge?.node?._sys.filename) {
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
    const res = await client.queries.pages({ relativePath: `${slug}.json` });
    if (res.data?.pages) {
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
    // Fallback
  }

  return notFound();
}
