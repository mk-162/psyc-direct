import { MetadataRoute } from 'next';
import client from '../../tina/__generated__/client';

const BASE_URL = 'https://www.psychologydirect.co.uk';

// Pages that should not appear in the sitemap
const EXCLUDE_FILENAMES = new Set(['homepage', 'four-oh-four', 'component-library']);

async function fetchCollection(
  queryFn: () => Promise<any>,
  connectionKey: string,
  urlPrefix: string,
  priority: number,
  hasOverviewIndex = false,
): Promise<MetadataRoute.Sitemap> {
  try {
    const res = await queryFn();
    const connection = res.data?.[connectionKey];
    if (!connection) {
      console.error(`[sitemap] Key "${connectionKey}" not found in response. Keys: ${Object.keys(res.data ?? {}).join(', ')}`);
      return [];
    }
    const edges = connection.edges ?? [];
    return edges
      .filter((edge: any) => edge?.node?._sys?.filename && !EXCLUDE_FILENAMES.has(edge.node._sys.filename))
      .map((edge: any) => {
        const filename = edge.node._sys.filename;
        const url = (hasOverviewIndex && filename === 'overview')
          ? `${BASE_URL}${urlPrefix}`
          : `${BASE_URL}${urlPrefix}${filename}/`;
        return { url, lastModified: new Date(), changeFrequency: 'monthly' as const, priority };
      });
  } catch (error) {
    console.error(`[sitemap] Failed to fetch "${connectionKey}":`, error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, ew, edu, about, resources, tools] = await Promise.all([
    fetchCollection(() => client.queries.pagesConnection(), 'pagesConnection', '/', 0.8),
    fetchCollection(() => client.queries.expertWitnessConnection(), 'expertWitnessConnection', '/expert-witness-psychologists/', 0.9, true),
    fetchCollection(() => client.queries.educationConnection(), 'educationConnection', '/educational-psychologist/', 0.9, true),
    fetchCollection(() => client.queries.aboutConnection(), 'aboutConnection', '/about/', 0.7, true),
    fetchCollection(() => client.queries.resourcesConnection(), 'resourcesConnection', '/resources/', 0.6, true),
    fetchCollection(() => client.queries.toolsConnection(), 'toolsConnection', '/tools/', 0.6),
  ]);

  const totalUrls = [pages, ew, edu, about, resources, tools].reduce((sum, c) => sum + c.length, 0);
  if (totalUrls === 0) {
    console.error('[sitemap] All collections returned zero results — likely a TinaCMS configuration error');
  }

  // Static utility/policy pages (these have fixed URLs that don't match the utility/ route prefix)
  const utilityPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/privacy-policy/`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/terms-conditions/`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/cookie-policy/`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/accessibility/`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/complaints-policy/`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    ...pages,
    ...ew,
    ...edu,
    ...about,
    ...resources,
    ...tools,
    ...utilityPages,
  ];
}
