import { notFound } from "next/navigation";
import { Metadata } from "next";
import client from "../../../../tina/__generated__/client";
import { EditorialPageClient } from "@/components/blocks/EditorialPageClient";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const tinaData = await client.queries.about({ relativePath: `${slug}.json` });
    if (tinaData.data.about) {
      return {
        title: tinaData.data.about.title,
        description: tinaData.data.about.description,
        alternates: { canonical: `https://www.psychologydirect.co.uk/about/${slug}/` },
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
    const tinaRes = await client.queries.aboutConnection();
    if (tinaRes.data?.aboutConnection.edges) {
      tinaRes.data.aboutConnection.edges.forEach((edge) => {
        if (edge?.node?._sys.filename && edge.node._sys.filename !== "overview") {
          paths.push({ slug: edge.node._sys.filename });
        }
      });
    }
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error(e);
  }
  return paths;
}

export default async function AboutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const res = await client.queries.about({ relativePath: `${slug}.json` });
    if (res.data?.about) {
      return (
        <main>
          <EditorialPageClient query={res.query} variables={res.variables} data={res.data} collection="about" />
        </main>
      );
    }
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error(e);
  }
  return notFound();
}
