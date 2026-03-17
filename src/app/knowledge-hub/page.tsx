import { notFound } from "next/navigation";
import { Metadata } from "next";
import client from "../../../tina/__generated__/client";
import { EditorialPageClient } from "@/components/blocks/EditorialPageClient";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const tinaData = await client.queries.pages({ relativePath: "knowledge-hub.json" });
    if (tinaData.data.pages) {
      return {
        title: (tinaData.data.pages.title || "Knowledge Hub") + " | Cocoon",
        description: tinaData.data.pages.description,
      };
    }
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error(e);
  }
  return { title: "Knowledge Hub | Cocoon" };
}

export default async function KnowledgeHubPage() {
  try {
    const res = await client.queries.pages({ relativePath: "knowledge-hub.json" });
    if (res.data?.pages) {
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
