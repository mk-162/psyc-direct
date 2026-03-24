import { cache } from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { EditorialPageClient } from "@/components/blocks/EditorialPageClient";

export const SITE_URL = "https://www.psychologydirect.co.uk";
const OVERVIEW_FILE = "overview";

// ── Cached Tina fetcher (deduplicates generateMetadata + page within one render) ──

function makeCachedQuery<T>(queryFn: (args: { relativePath: string }) => Promise<T>) {
  return cache(async (relativePath: string): Promise<T | null> => {
    try {
      return await queryFn({ relativePath });
    } catch (e) {
      console.error(`[tina] Failed to fetch "${relativePath}":`, e);
      return null;
    }
  });
}

// ── Fallback Hero ────────────────────────────────────────────────────────────

function FallbackHero({ title, subtitle, ctaText, ctaHref = "/contact/" }: {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref?: string;
}) {
  return (
    <section
      className="min-h-[60vh] flex items-center justify-center text-white"
      style={{ background: 'linear-gradient(135deg, var(--brand-hero-from), var(--brand-hero-to))' }}
    >
      <div className="text-center px-4">
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        <p className="text-lg opacity-90 mb-8">{subtitle}</p>
        <a
          href={ctaHref}
          className="inline-flex items-center px-6 py-3 rounded-md bg-white font-semibold"
          style={{ color: 'var(--brand-navy)' }}
        >
          {ctaText}
        </a>
      </div>
    </section>
  );
}

// ── Overview page factory ────────────────────────────────────────────────────

interface OverviewConfig {
  queryFn: (args: { relativePath: string }) => Promise<any>;
  dataKey: string;
  collection: string;
  canonicalPath: string;
  fallback: { title: string; subtitle: string; ctaText: string };
  defaultTitle: string;
}

export function makeOverviewPage(config: OverviewConfig) {
  const getCached = makeCachedQuery(config.queryFn);

  async function generateMetadata(): Promise<Metadata> {
    const res = await getCached(`${OVERVIEW_FILE}.json`);
    const page = res?.data?.[config.dataKey];
    if (page) {
      return {
        title: page.title,
        description: page.description,
        alternates: { canonical: `${SITE_URL}${config.canonicalPath}` },
      };
    }
    return { title: config.defaultTitle };
  }

  async function Page() {
    const res = await getCached(`${OVERVIEW_FILE}.json`);
    const page = res?.data?.[config.dataKey];
    if (page) {
      return (
        <>
          <EditorialPageClient
            query={res.query}
            variables={res.variables}
            data={res.data}
            collection={config.collection}
          />
        </>
      );
    }
    return <FallbackHero {...config.fallback} />;
  }

  return { generateMetadata, Page };
}

// ── Dynamic slug page factory ────────────────────────────────────────────────

interface SlugConfig {
  queryFn: (args: { relativePath: string }) => Promise<any>;
  connectionFn: () => Promise<any>;
  dataKey: string;
  connectionKey: string;
  collection: string;
  canonicalPrefix: string;
  fileExtension?: string;
}

export function makeSlugPage(config: SlugConfig) {
  const ext = config.fileExtension || ".json";
  const getCached = makeCachedQuery(config.queryFn);

  async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const res = await getCached(`${slug}${ext}`);
    const page = res?.data?.[config.dataKey];
    if (page) {
      return {
        title: page.title || `${slug.replace(/-/g, " ")} | Psychology Direct`,
        description: page.description,
        alternates: { canonical: `${SITE_URL}${config.canonicalPrefix}${slug}/` },
      };
    }
    return { title: `${slug.replace(/-/g, " ")} | Psychology Direct` };
  }

  async function generateStaticParams() {
    try {
      const tinaRes = await config.connectionFn();
      const edges = tinaRes.data?.[config.connectionKey]?.edges;
      if (!edges?.length) {
        console.warn(`[tina] No edges returned for ${config.connectionKey} — zero static pages will be generated`);
      }
      return (edges ?? [])
        .filter((edge: any) => edge?.node?._sys.filename && edge.node._sys.filename !== OVERVIEW_FILE)
        .map((edge: any) => ({ slug: edge.node._sys.filename }));
    } catch (e) {
      console.error(`[tina] ${config.connectionKey} failed (schema mismatch):`, e);
      return [];
    }
  }

  async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const res = await getCached(`${slug}${ext}`);
    const page = res?.data?.[config.dataKey];
    if (page) {
      return (
        <>
          <EditorialPageClient
            query={res.query}
            variables={res.variables}
            data={res.data}
            collection={config.collection}
          />
        </>
      );
    }
    return notFound();
  }

  return { generateMetadata, generateStaticParams, Page };
}
