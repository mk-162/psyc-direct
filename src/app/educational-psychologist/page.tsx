import { Metadata } from "next";
import client from "../../../tina/__generated__/client";
import { EditorialPageClient } from "@/components/blocks/EditorialPageClient";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const tinaData = await client.queries.education({ relativePath: "overview.json" });
    if (tinaData.data.education) {
      return {
        title: tinaData.data.education.title,
        description: tinaData.data.education.description,
        alternates: { canonical: "https://www.psychologydirect.co.uk/educational-psychologist/" },
      };
    }
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error(e);
  }
  return { title: "Educational Psychologist Services | Psychology Direct" };
}

export default async function EducationOverview() {
  try {
    const res = await client.queries.education({ relativePath: "overview.json" });
    if (res.data?.education) {
      return (
        <main>
          <EditorialPageClient query={res.query} variables={res.variables} data={res.data} collection="education" />
        </main>
      );
    }
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error(e);
  }

  return (
    <section className="min-h-[60vh] flex items-center justify-center text-white" style={{ background: 'linear-gradient(135deg, var(--brand-hero-from), var(--brand-hero-to))' }}>
      <div className="text-center px-4">
        <h1 className="text-4xl font-bold mb-4">Educational Psychologist Services</h1>
        <p className="text-lg opacity-90 mb-8">EHCP assessments, SEND support, and more</p>
        <a href="/contact/" className="inline-flex items-center px-6 py-3 rounded-md bg-white font-semibold" style={{ color: 'var(--brand-navy)' }}>Discuss Your Needs</a>
      </div>
    </section>
  );
}
