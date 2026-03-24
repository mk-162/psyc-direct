import { cache } from "react";
import { Metadata } from "next";
import client from "../../../tina/__generated__/client";
import { EditorialPageClient } from "@/components/blocks/EditorialPageClient";
import { SITE_URL } from "@/lib/tina-page-helpers";


const getData = cache(async () => {
  try { return await client.queries.pages({ relativePath: "faqs.json" }); }
  catch (e) { console.error("[faqs]", e); return null; }
});

export async function generateMetadata(): Promise<Metadata> {
  const res = await getData();
  return {
    title: res?.data?.pages?.title || "FAQs | Psychology Direct",
    description: res?.data?.pages?.description,
    alternates: { canonical: `${SITE_URL}/faqs/` },
  };
}

function extractFaqsFromTabs(blocks: any[]): Array<{ question: string; answer: string }> {
  const faqs: Array<{ question: string; answer: string }> = [];
  for (const block of blocks ?? []) {
    if (block?._template !== 'tabbedContent') continue;
    for (const tab of block.tabs ?? []) {
      const content = tab.content || '';
      const parts = content.split(/\*\*([^*]+\??)\*\*/);
      for (let i = 1; i < parts.length; i += 2) {
        const question = parts[i].trim();
        const answer = (parts[i + 1] || '').trim().replace(/\n+/g, ' ');
        if (question && answer) faqs.push({ question, answer });
      }
    }
  }
  return faqs;
}

export default async function FaqsPage() {
  const res = await getData();
  if (res?.data?.pages) {
    const faqs = extractFaqsFromTabs(res.data.pages.blocks as any[] ?? []);
    const faqJsonLd = faqs.length > 0 ? {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    } : null;

    return (
      <>
        {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}
        <EditorialPageClient query={res.query} variables={res.variables} data={res.data} collection="pages" />
      </>
    );
  }
  return null;
}
