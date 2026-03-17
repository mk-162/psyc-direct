import client from "../../tina/__generated__/client";

export interface ServiceMatch {
  title: string;
  slug: string;
  description: string;
  matchedTags: string[];
}

export async function getRelatedServices(
  tags: (string | null)[] | undefined,
  maxResults = 4
): Promise<ServiceMatch[]> {
  if (!tags || tags.length === 0) return [];

  try {
    const servicesRes = await client.queries.wellnessServicesConnection();
    const services = servicesRes.data?.wellnessServicesConnection.edges || [];

    const lowerTags = tags
      .filter((t): t is string => !!t)
      .map((t) => t.toLowerCase());

    if (lowerTags.length === 0) return [];

    return services
      .filter((edge) => {
        const keywords = (edge?.node?.keywords || []).filter(
          (k): k is string => !!k
        );
        return keywords.some((kw) => lowerTags.includes(kw.toLowerCase()));
      })
      .map((edge) => {
        const node = edge!.node!;
        const keywords = (node.keywords || []).filter(
          (k): k is string => !!k
        );
        const matched = keywords.filter((kw) =>
          lowerTags.includes(kw.toLowerCase())
        );
        return {
          title: node.title || "",
          slug: node._sys.filename,
          description: (node.description || "").slice(0, 120),
          matchedTags: matched,
        };
      })
      .sort((a, b) => b.matchedTags.length - a.matchedTags.length)
      .slice(0, maxResults);
  } catch {
    return [];
  }
}
