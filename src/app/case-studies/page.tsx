import { cache } from "react";
import { Metadata } from "next";
import client from "../../../tina/__generated__/client";
import { CaseStudiesIndex, type CaseStudyItem } from "@/components/CaseStudiesIndex";
import { SITE_URL } from "@/lib/tina-page-helpers";

export const metadata: Metadata = {
  title: "Case Studies | Psychology Direct",
  description: "Real examples of how Psychology Direct helps schools, local authorities, and legal professionals get the right psychological expert at the right time.",
  alternates: { canonical: `${SITE_URL}/case-studies/` },
};

const getData = cache(async (): Promise<CaseStudyItem[]> => {
  try {
    const res = await client.queries.caseStudiesConnection();
    const edges = res.data?.caseStudiesConnection?.edges ?? [];
    return edges
      .filter((e: any) => e?.node)
      .map((e: any) => ({
        slug: e.node._sys.filename,
        title: e.node.title ?? "",
        description: e.node.description ?? undefined,
        sector: e.node.sector ?? undefined,
        featuredImage: e.node.featuredImage ?? undefined,
      }));
  } catch (err) {
    console.error("[case-studies] Failed to fetch:", err);
    return [];
  }
});

export default async function CaseStudiesPage() {
  const caseStudies = await getData();
  return <CaseStudiesIndex caseStudies={caseStudies} />;
}
