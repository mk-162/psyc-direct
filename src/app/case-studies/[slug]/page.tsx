import { cache } from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import client from "../../../../tina/__generated__/client";
import { CaseStudyArticle } from "@/components/CaseStudyArticle";
import { SITE_URL } from "@/lib/tina-page-helpers";

const getCached = cache(async (relativePath: string) => {
  try {
    return await client.queries.caseStudies({ relativePath });
  } catch (e) {
    console.error(`[tina] Failed to fetch case study "${relativePath}":`, e);
    return null;
  }
});

export async function generateStaticParams() {
  try {
    const tinaRes = await client.queries.caseStudiesConnection();
    const edges = tinaRes.data?.caseStudiesConnection?.edges ?? [];
    return edges
      .filter((edge: any) => edge?.node?._sys?.filename)
      .map((edge: any) => ({ slug: edge.node._sys.filename }));
  } catch (e) {
    console.error("[tina] caseStudiesConnection failed:", e);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const res = await getCached(`${slug}.md`);
  const cs = res?.data?.caseStudies;
  if (!cs) return { title: `${slug.replace(/-/g, " ")} | Psychology Direct` };
  return {
    title: `${cs.title} | Case Studies | Psychology Direct`,
    description: cs.description,
    alternates: { canonical: `${SITE_URL}/case-studies/${slug}/` },
    openGraph: {
      title: cs.title || undefined,
      description: cs.description || undefined,
      images: cs.featuredImage ? [{ url: cs.featuredImage }] : undefined,
      type: "article",
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const res = await getCached(`${slug}.md`);
  if (!res?.data?.caseStudies) return notFound();

  return (
    <CaseStudyArticle
      query={res.query}
      variables={res.variables}
      data={res.data}
    />
  );
}
