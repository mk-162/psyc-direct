import { MetadataRoute } from 'next';
import client from '../../tina/__generated__/client';

const BASE_URL = 'https://www.psychologydirect.co.uk';

async function fetchCollection(
  queryFn: () => Promise<any>,
  connectionKey: string,
  urlPrefix: string,
  priority: number,
): Promise<MetadataRoute.Sitemap> {
  try {
    const res = await queryFn();
    const edges = res.data?.[connectionKey]?.edges ?? [];
    return edges
      .filter((edge: any) => edge?.node?._sys.filename)
      .map((edge: any) => {
        const filename = edge.node._sys.filename;
        const url = filename === 'overview'
          ? `${BASE_URL}${urlPrefix}`
          : `${BASE_URL}${urlPrefix}${filename}/`;
        return { url, lastModified: new Date(), changeFrequency: 'monthly' as const, priority };
      });
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, ew, edu, about, resources, tools, utility] = await Promise.all([
    fetchCollection(() => client.queries.pagesConnection(), 'pagesConnection', '/', 0.8),
    fetchCollection(() => client.queries.expertWitnessConnection(), 'expertWitnessConnection', '/expert-witness-psychologists/', 0.9),
    fetchCollection(() => client.queries.educationConnection(), 'educationConnection', '/educational-psychologist/', 0.9),
    fetchCollection(() => client.queries.aboutConnection(), 'aboutConnection', '/about/', 0.7),
    fetchCollection(() => client.queries.resourcesConnection(), 'resourcesConnection', '/resources/', 0.6),
    fetchCollection(() => client.queries.toolsConnection(), 'toolsConnection', '/tools/', 0.6),
    fetchCollection(() => client.queries.utilityConnection(), 'utilityConnection', '/', 0.3),
  ]);

  // Filter out homepage from pages (added separately with priority 1)
  const filteredPages = pages.filter(p => p.url !== `${BASE_URL}/homepage/`);

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    ...filteredPages,
    ...ew,
    ...edu,
    ...about,
    ...resources,
    ...tools,
    ...utility,
  ];
}
