import { Metadata } from "next";
import client from "../../../tina/__generated__/client";
import { EditorialPageClient } from "@/components/blocks/EditorialPageClient";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const tinaData = await client.queries.expertWitness({ relativePath: "overview.json" });
    if (tinaData.data.expertWitness) {
      return {
        title: tinaData.data.expertWitness.title || "Expert Witness Psychologists & Psychiatrists | Psychology Direct",
        description: tinaData.data.expertWitness.description,
        alternates: {
          canonical: "https://www.psychologydirect.co.uk/expert-witness-psychologists/",
        },
      };
    }
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error(e);
  }

  return {
    title: "Expert Witness Psychologists & Psychiatrists | Psychology Direct",
  };
}

export default async function ExpertWitnessOverview() {
  try {
    const res = await client.queries.expertWitness({ relativePath: "overview.json" });
    if (res.data?.expertWitness) {
      return (
        <main>
          <EditorialPageClient
            query={res.query}
            variables={res.variables}
            data={res.data}
            collection="expertWitness"
          />
        </main>
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
        <h1 className="text-4xl font-bold mb-4">Expert Witness Services</h1>
        <p className="text-lg opacity-90 mb-8">Court-ready reports from vetted psychologists and psychiatrists</p>
        <a
          href="/contact/"
          className="inline-flex items-center px-6 py-3 rounded-md bg-white font-semibold"
          style={{ color: 'var(--brand-navy)' }}
        >
          Instruct an Expert
        </a>
      </div>
    </section>
  );
}
