import { notFound } from "next/navigation";
import { Metadata } from "next";
import client from "../../../../tina/__generated__/client";
import { EditorialPageClient } from "@/components/blocks/EditorialPageClient";
import { ServiceSelectBar } from "@/components/blocks/ServiceSelectBar";

// Fetch the list of available block pages once, then check membership
async function getBlockPageSlugs(): Promise<Set<string>> {
  try {
    const res = await client.queries.pagesConnection();
    const slugs = new Set<string>();
    res.data?.pagesConnection.edges?.forEach((edge) => {
      if (edge?.node?._sys.filename) {
        slugs.add(edge.node._sys.filename);
      }
    });
    return slugs;
  } catch {
    return new Set();
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  // Only try block page if one actually exists for this slug
  const blockSlugs = await getBlockPageSlugs();
  if (blockSlugs.has(slug)) {
    try {
      const blockData = await client.queries.pages({ relativePath: `${slug}.json` });
      if (blockData.data?.pages) {
        return {
          title: (blockData.data.pages.title || "") + " | Cocoon" || `${slug.replace(/-/g, " ")} | Cocoon Services`,
          description: blockData.data.pages.description,
        };
      }
    } catch {
      // Block page listed but failed to load — fall through
    }
  }

  try {
    const tinaData = await client.queries.wellnessServices({ relativePath: `${slug}.md` });
    if (tinaData.data.wellnessServices) {
      return {
        title: (tinaData.data.wellnessServices.title || "") + " | Cocoon" || `${slug.replace(/-/g, " ")} | Cocoon Services`,
        description: tinaData.data.wellnessServices.description,
      };
    }
  } catch {
    // Ignore and fallback
  }

  return {};
}

export async function generateStaticParams() {
  const paths: { slug: string }[] = [];

  try {
    const tinaRes = await client.queries.wellnessServicesConnection();
    if (tinaRes.data?.wellnessServicesConnection.edges) {
      tinaRes.data.wellnessServicesConnection.edges.forEach((edge) => {
        if (edge?.node?._sys.filename) {
          paths.push({ slug: edge.node._sys.filename });
        }
      });
    }
  } catch {
    // ignore
  }

  return paths;
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Only try block page if one actually exists for this slug
  const blockSlugs = await getBlockPageSlugs();
  if (blockSlugs.has(slug)) {
    try {
      const blockRes = await client.queries.pages({ relativePath: `${slug}.json` });
      if (blockRes.data?.pages?.blocks && blockRes.data.pages.blocks.length > 0) {
        return (
          <main>
            <EditorialPageClient
              query={blockRes.query}
              variables={blockRes.variables}
              data={blockRes.data}
              collection="pages"
            />
            <ServiceSelectBar slug={slug} />
          </main>
        );
      }
    } catch {
      // Block page listed but failed to load — fall through to markdown
    }
  }

  // Fall back to markdown content
  try {
    const res = await client.queries.wellnessServices({ relativePath: `${slug}.md` });
    if (res.data && res.data.wellnessServices) {
      return (
        <main>
          <EditorialPageClient
            query={res.query}
            variables={res.variables}
            data={res.data}
          />
          <ServiceSelectBar slug={slug} />
        </main>
      );
    }
  } catch {
    // Fallback to 404
  }

  return notFound();
}
