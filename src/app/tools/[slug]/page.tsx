import { cache } from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import client from "../../../../tina/__generated__/client";
import { EditorialPageClient } from "@/components/blocks/EditorialPageClient";
import { ToolWidgetSwitch } from "@/components/tools/ToolWidgetSwitch";

const SITE_URL = "https://www.psychologydirect.co.uk";
const OVERVIEW_FILE = "overview";

/* ── Cached Tina query (deduplicates metadata + page render) ─────────── */

const getCached = cache(async (relativePath: string) => {
  try {
    return await client.queries.tools({ relativePath });
  } catch (e) {
    console.error(`[tina] Failed to fetch tools "${relativePath}":`, e);
    return null;
  }
});

/* ── Metadata ────────────────────────────────────────────────────────── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const res = await getCached(`${slug}.json`);
  const page = res?.data?.tools;
  if (page) {
    return {
      title: page.title || `${slug.replace(/-/g, " ")} | Psychology Direct`,
      description: page.description,
      alternates: { canonical: `${SITE_URL}/tools/${slug}/` },
    };
  }
  return { title: `${slug.replace(/-/g, " ")} | Psychology Direct` };
}

/* ── Static params ───────────────────────────────────────────────────── */

export async function generateStaticParams() {
  const tinaRes = await client.queries.toolsConnection();
  const edges = tinaRes.data?.toolsConnection?.edges;
  if (!edges?.length) {
    console.warn("[tina] No edges returned for toolsConnection — zero static pages will be generated");
  }
  return (edges ?? [])
    .filter(
      (edge: any) =>
        edge?.node?._sys.filename && edge.node._sys.filename !== OVERVIEW_FILE
    )
    .map((edge: any) => ({ slug: edge.node._sys.filename }));
}

/* ── Page ─────────────────────────────────────────────────────────────── */

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const res = await getCached(`${slug}.json`);
  const page = res?.data?.tools;

  if (!page) return notFound();

  return (
    <main>
      {/* CMS editorial blocks */}
      <EditorialPageClient
        query={res.query}
        variables={res.variables}
        data={res.data}
        collection="tools"
      />

      {/* Interactive tool widget (renders based on slug) */}
      <section className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <ToolWidgetSwitch slug={slug} />
        </div>
      </section>
    </main>
  );
}
