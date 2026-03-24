import { Metadata } from "next";
import { Suspense } from "react";
import { SITE_URL } from "@/lib/tina-page-helpers";
import { NewsIndex } from "@/components/NewsIndex";

export const metadata: Metadata = {
  title: "Resources & Insights for Legal Professionals | Psychology Direct",
  description: "Expert articles, guides, and practical advice on psychological evidence in legal cases.",
  alternates: { canonical: `${SITE_URL}/news/` },
};

export default function NewsPage() {
  return (
    <Suspense>
      <NewsIndex />
    </Suspense>
  );
}
