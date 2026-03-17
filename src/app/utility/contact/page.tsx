import { Metadata } from "next";
import client from "../../../../tina/__generated__/client";
import { EditorialPageClient } from "@/components/blocks/EditorialPageClient";

export const metadata: Metadata = {
  title: "Contact Us | Psychology Direct",
  description:
    "Get in touch with Psychology Direct. Arrange an assessment, discuss your case, or ask us a question.",
  alternates: {
    canonical: "https://www.psychologydirect.co.uk/contact/",
  },
};

export default async function ContactPage() {
  try {
    const res = await client.queries.pages({ relativePath: "contact.json" });
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
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error(e);
    return (
      <main>
        <section className="min-h-[40vh] flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--brand-navy)' }}>Contact Us</h1>
            <p className="mb-4">Call us on <a href="tel:01306879975" className="font-semibold">01306 879 975</a></p>
            <p>Email: <a href="mailto:enquiries@psychologydirect.co.uk" className="font-semibold">enquiries@psychologydirect.co.uk</a></p>
          </div>
        </section>
      </main>
    );
  }
}
