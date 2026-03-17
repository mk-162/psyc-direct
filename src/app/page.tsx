import { Metadata } from "next";
import client from "../../tina/__generated__/client";
import { EditorialPageClient } from "@/components/blocks/EditorialPageClient";

export const metadata: Metadata = {
  title: "Psychology Direct | Expert Witness & Educational Psychologists",
  description: "Fast, reliable access to HCPC-registered psychologists and psychiatrists for legal, education, and professional services. CVs in 24 hours. UK-wide coverage.",
  alternates: {
    canonical: "https://www.psychologydirect.co.uk/",
  },
};

export default async function Home() {
  try {
    const res = await client.queries.pages({ relativePath: "homepage.json" });
    if (res.data?.pages?.blocks && res.data.pages.blocks.length > 0) {
      return (
        <EditorialPageClient
          query={res.query}
          variables={res.variables}
          data={res.data}
          collection="pages"
        />
      );
    }
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error(e);
  }

  return (
    <section
      className="min-h-[60vh] flex items-center justify-center text-white"
      style={{ background: 'linear-gradient(135deg, var(--brand-hero-from), var(--brand-hero-to))' }}
    >
      <div className="text-center px-4">
        <h1 className="text-4xl font-bold mb-4">Psychology Direct</h1>
        <p className="text-lg opacity-90 mb-8">Expert Witness & Educational Psychologists</p>
        <a
          href="/contact/"
          className="inline-flex items-center px-6 py-3 rounded-md bg-white font-semibold"
          style={{ color: 'var(--brand-navy)' }}
        >
          Arrange an Assessment
        </a>
      </div>
    </section>
  );
}
