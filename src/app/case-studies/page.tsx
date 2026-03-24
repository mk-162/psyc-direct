import { cache } from "react";
import { Metadata } from "next";
import client from "../../../tina/__generated__/client";
import { EditorialPageClient } from "@/components/blocks/EditorialPageClient";
import { SITE_URL } from "@/lib/tina-page-helpers";
import { Breadcrumb } from "@/components/Breadcrumb";

const getData = cache(async () => {
  try { return await client.queries.pages({ relativePath: "case-studies.json" }); }
  catch (e) { console.error("[case-studies]", e); return null; }
});

export async function generateMetadata(): Promise<Metadata> {
  const res = await getData();
  return {
    title: res?.data?.pages?.title || "Case Studies | Psychology Direct",
    description: res?.data?.pages?.description,
    alternates: { canonical: `${SITE_URL}/case-studies/` },
  };
}

export default async function CaseStudiesPage() {
  const res = await getData();
  if (res?.data?.pages) {
    return <><Breadcrumb path="/case-studies/" /><EditorialPageClient query={res.query} variables={res.variables} data={res.data} collection="pages" /></>;
  }
  return null;
}
