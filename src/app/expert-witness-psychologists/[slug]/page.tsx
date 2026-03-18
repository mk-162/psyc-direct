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
    const tinaData = await client.queries.expertWitness({ relativePath: `${slug}.json` });
    if (tinaData.data.expertWitness) {
      return {
        title: tinaData.data.expertWitness.title || `${slug.replace(/-/g, " ")} | Psychology Direct`,
        description: tinaData.data.expertWitness.description,
        alternates: {
          canonical: `https://www.psychologydirect.co.uk/expert-witness-psychologists/${slug}/`,
        },
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
    const tinaRes = await client.queries.expertWitnessConnection();
    if (tinaRes.data?.expertWitnessConnection.edges) {
      tinaRes.data.expertWitnessConnection.edges.forEach((edge) => {
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

export default async function ExpertWitnessPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const res = await client.queries.expertWitness({ relativePath: `${slug}.json` });
    if (res.data?.expertWitness) {
      return (
        <main>
          <EditorialPageClient
            query={res.query}
            variables={res.variables}
            data={res.data}
            collection="expertWitness"
          />
        </main>
      );
    }
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error(e);
  }

  return notFound();
}
