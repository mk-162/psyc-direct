import { Metadata } from "next";
import client from "../../../../tina/__generated__/client";
import { EditorialPageClient } from "@/components/blocks/EditorialPageClient";

export const metadata: Metadata = {
  title: "Contact Us | Cocoon",
  description:
    "Get in touch with Cocoon. Book appointments, ask questions, or visit our Harrogate clinic.",
  alternates: {
    canonical: "https://cocoonwellness.com/utility/contact",
  },
};

export default async function ContactPage() {
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
}
