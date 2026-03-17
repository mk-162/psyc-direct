import { notFound } from "next/navigation";
import { Metadata } from "next";
import client from "../../../tina/__generated__/client";
import { EditorialPageClient } from "@/components/blocks/EditorialPageClient";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const tinaData = await client.queries.ourStoryPages({ relativePath: "index.md" });
    if (tinaData.data.ourStoryPages) {
      return {
        title: (tinaData.data.ourStoryPages.title || "Our Story") + " | Cocoon",
        description: tinaData.data.ourStoryPages.description,
      };
    }
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error(e);
  }
  return { title: "Our Story | Cocoon" };
}

export default async function OurStoryPage() {
  try {
    const res = await client.queries.ourStoryPages({ relativePath: "index.md" });
    if (res.data?.ourStoryPages) {
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
