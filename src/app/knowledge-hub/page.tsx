import { Metadata } from "next";
import { Suspense } from "react";
import { SITE_URL } from "@/lib/tina-page-helpers";
import { KnowledgeHubIndex } from "@/components/KnowledgeHubIndex";

export const metadata: Metadata = {
  title: "Knowledge Hub | Resources & Insights | Psychology Direct",
  description: "Expert articles, guides, and practical advice on psychological evidence in legal cases — for solicitors, barristers, and legal professionals.",
  alternates: { canonical: `${SITE_URL}/knowledge-hub/` },
};

export default function KnowledgeHubPage() {
  return (
    <Suspense>
      <KnowledgeHubIndex />
    </Suspense>
  );
}
