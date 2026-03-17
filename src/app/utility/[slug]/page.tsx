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
    const tinaData = await client.queries.utility({ relativePath: `${slug}.md` });
    if (tinaData.data.utility) {
      return {
        title: (tinaData.data.utility.title || "") + " | Psychology Direct" || `${slug.replace(/-/g, " ")} | Psychology Direct`,
        description: tinaData.data.utility.description,
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
    const tinaRes = await client.queries.utilityConnection();
    if (tinaRes.data?.utilityConnection.edges) {
      tinaRes.data.utilityConnection.edges.forEach((edge) => {
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
    const res = await client.queries.utility({ relativePath: `${slug}.md` });
    if (res.data?.utility) {
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
