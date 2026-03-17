import { notFound } from "next/navigation";
import { Metadata } from "next";
import client from "../../../tina/__generated__/client";
import { EditorialPageClient } from "@/components/blocks/EditorialPageClient";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const tinaData = await client.queries.membershipPages({ relativePath: "index.md" });
    if (tinaData.data.membershipPages) {
      return {
        title: (tinaData.data.membershipPages.title || "Membership") + " | Cocoon",
        description: tinaData.data.membershipPages.description,
      };
    }
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error(e);
  }
  return { title: "Membership | Cocoon" };
}

export default async function MembershipPage() {
  try {
    const res = await client.queries.membershipPages({ relativePath: "index.md" });
    if (res.data?.membershipPages) {
      return (
        <main>
          <EditorialPageClient
            query={res.query}
            variables={res.variables}
            data={res.data}
          />
        </main>
      );
    }
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error(e);
  }
  return notFound();
}
