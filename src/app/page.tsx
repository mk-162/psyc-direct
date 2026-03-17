import { Metadata } from "next";
import client from "../../tina/__generated__/client";
import { EditorialPageClient } from "@/components/blocks/EditorialPageClient";

export const metadata: Metadata = {
  title: "Cocoon | Premium Wellness & Preventive Health",
  description: "Proactive healthcare designed for life. Expert-led wellness services, personalised health screening, and longitudinal care that builds understanding over time.",
  alternates: {
    canonical: "https://cocoonwellness.com/",
  },
};

export default async function Home() {
  try {
    const res = await client.queries.pages({ relativePath: "homepage.json" });
    if (res.data?.pages?.blocks && res.data.pages.blocks.length > 0) {
      return (
        <main>
          <EditorialPageClient
            query={res.query}
            variables={res.variables}
            data={res.data}
            collection="pages"
          />
        </main>
      );
    }
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error(e);
    // fallback
  }

  // Fallback — simple static homepage if block page fails
  return (
    <main>
      <section className="hero-header hero-fallback">
        <div className="hero-content">
          <h1 className="hero-title">Healthcare designed for life</h1>
          <p className="hero-subtitle">Proactive, personal, and built on trust.</p>
        </div>
      </section>
    </main>
  );
}
