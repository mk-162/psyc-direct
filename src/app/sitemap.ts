import { MetadataRoute } from 'next';
import client from '../../tina/__generated__/client';

const BASE_URL = 'https://www.psychologydirect.co.uk';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
  ];

  // Main block pages
  try {
    const pages = await client.queries.pagesConnection();
    pages.data?.pagesConnection.edges?.forEach((edge) => {
      const filename = edge?.node?._sys.filename;
      if (filename && filename !== 'homepage') {
        routes.push({
          url: `${BASE_URL}/${filename}/`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.8,
        });
      }
    });
  } catch (e) { /* skip */ }

  // Expert Witness pages
  try {
    const ewPages = await client.queries.expertWitnessConnection();
    ewPages.data?.expertWitnessConnection.edges?.forEach((edge) => {
      const filename = edge?.node?._sys.filename;
      if (filename) {
        const url = filename === 'overview'
          ? `${BASE_URL}/expert-witness-psychologists/`
          : `${BASE_URL}/expert-witness-psychologists/${filename}/`;
        routes.push({ url, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 });
      }
    });
  } catch (e) { /* skip */ }

  // Education pages
  try {
    const edPages = await client.queries.educationConnection();
    edPages.data?.educationConnection.edges?.forEach((edge) => {
      const filename = edge?.node?._sys.filename;
      if (filename) {
        const url = filename === 'overview'
          ? `${BASE_URL}/educational-psychologist/`
          : `${BASE_URL}/educational-psychologist/${filename}/`;
        routes.push({ url, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 });
      }
    });
  } catch (e) { /* skip */ }

  // About pages
  try {
    const aboutPages = await client.queries.aboutConnection();
    aboutPages.data?.aboutConnection.edges?.forEach((edge) => {
      const filename = edge?.node?._sys.filename;
      if (filename) {
        const url = filename === 'overview'
          ? `${BASE_URL}/about/`
          : `${BASE_URL}/about/${filename}/`;
        routes.push({ url, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 });
      }
    });
  } catch (e) { /* skip */ }

  return routes;
}
