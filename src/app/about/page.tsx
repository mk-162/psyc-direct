import { Metadata } from "next";
import client from "../../../tina/__generated__/client";
import { EditorialPageClient } from "@/components/blocks/EditorialPageClient";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const tinaData = await client.queries.about({ relativePath: "overview.json" });
    if (tinaData.data.about) {
      return {
        title: tinaData.data.about.title,
        description: tinaData.data.about.description,
        alternates: { canonical: "https://www.psychologydirect.co.uk/about/" },
      };
    }
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error(e);
  }
  return { title: "About Psychology Direct" };
}

export default async function AboutOverview() {
  try {
    const res = await client.queries.about({ relativePath: "overview.json" });
    if (res.data?.about) {
      return (
        <main>
          <EditorialPageClient query={res.query} variables={res.variables} data={res.data} collection="about" />
        </main>
      );
    }
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error(e);
  }

  return (
    <section className="min-h-[60vh] flex items-center justify-center text-white" style={{ background: 'linear-gradient(135deg, var(--brand-hero-from), var(--brand-hero-to))' }}>
      <div className="text-center px-4">
        <h1 className="text-4xl font-bold mb-4">About Psychology Direct</h1>
        <p className="text-lg opacity-90 mb-8">15+ years connecting organisations with expert psychologists</p>
        <a href="/contact/" className="inline-flex items-center px-6 py-3 rounded-md bg-white font-semibold" style={{ color: 'var(--brand-navy)' }}>Get in Touch</a>
      </div>
    </section>
  );
}
