import { cache } from "react";
import { Metadata } from "next";
import client from "../../../tina/__generated__/client";
import { EditorialPageClient } from "@/components/blocks/EditorialPageClient";
import { ContactForm } from "@/components/tools/ContactForm";
import { SITE_URL } from "@/lib/tina-page-helpers";

const getData = cache(async () => {
  try { return await client.queries.pages({ relativePath: "contact.json" }); }
  catch (e) { console.error("[contact]", e); return null; }
});

export async function generateMetadata(): Promise<Metadata> {
  const res = await getData();
  return {
    title: res?.data?.pages?.title || "Contact Us | Psychology Direct",
    description: res?.data?.pages?.description,
    alternates: { canonical: `${SITE_URL}/contact/` },
  };
}

export default async function ContactPage() {
  const res = await getData();
  if (res?.data?.pages) {
    return (
      <main>
        <EditorialPageClient query={res.query} variables={res.variables} data={res.data} collection="pages" />
        <section id="enquiry-form" className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <ContactForm />
          </div>
        </section>
      </main>
    );
  }
  return (
    <section className="min-h-[60vh] flex items-center justify-center text-white" style={{ background: 'linear-gradient(135deg, var(--brand-hero-from), var(--brand-hero-to))' }}>
      <div className="text-center px-4">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-lg opacity-90 mb-8">Call 01306 879 975 or email enquiries@psychologydirect.co.uk</p>
      </div>
    </section>
  );
}
