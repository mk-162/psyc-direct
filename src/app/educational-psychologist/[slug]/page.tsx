import { notFound } from "next/navigation";
import { Metadata } from "next";
import client from "../../../../tina/__generated__/client";
import { EditorialPageClient } from "@/components/blocks/EditorialPageClient";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const tinaData = await client.queries.education({ relativePath: `${slug}.json` });
    if (tinaData.data.education) {
      return {
        title: tinaData.data.education.title,
        description: tinaData.data.education.description,
        alternates: { canonical: `https://www.psychologydirect.co.uk/educational-psychologist/${slug}/` },
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
    const tinaRes = await client.queries.educationConnection();
    if (tinaRes.data?.educationConnection.edges) {
      tinaRes.data.educationConnection.edges.forEach((edge) => {
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

export default async function EducationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const res = await client.queries.education({ relativePath: `${slug}.json` });
    if (res.data?.education) {
      return (
        <main>
          <EditorialPageClient query={res.query} variables={res.variables} data={res.data} collection="education" />
        </main>
      );
    }
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error(e);
  }
  return notFound();
}
