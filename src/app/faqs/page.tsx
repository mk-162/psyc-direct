import { cache } from "react";
import { Metadata } from "next";
import client from "../../../tina/__generated__/client";
import { EditorialPageClient } from "@/components/blocks/EditorialPageClient";
import { SITE_URL } from "@/lib/tina-page-helpers";

const getData = cache(async () => {
  try { return await client.queries.pages({ relativePath: "faqs.json" }); }
  catch (e) { console.error("[faqs]", e); return null; }
});

export async function generateMetadata(): Promise<Metadata> {
  const res = await getData();
  return {
    title: res?.data?.pages?.title || "FAQs | Psychology Direct",
    description: res?.data?.pages?.description,
    alternates: { canonical: `${SITE_URL}/faqs/` },
  };
}

export default async function FaqsPage() {
  const res = await getData();
  if (res?.data?.pages) {
    return <main><EditorialPageClient query={res.query} variables={res.variables} data={res.data} collection="pages" /></main>;
  }
  return null;
}
