import { MetadataRoute } from 'next';
import client from '../../tina/__generated__/client';

const BASE_URL = 'https://cocoonwellness.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
  ];

  // Wellness services
  try {
    const services = await client.queries.wellnessServicesConnection();
    services.data?.wellnessServicesConnection.edges?.forEach((edge) => {
      const filename = edge?.node?._sys.filename;
      if (filename && filename !== 'index') {
        routes.push({
          url: `${BASE_URL}/services/${filename}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.8,
        });
      }
    });
  } catch (e) { /* skip */ }

  // Block pages
  try {
    const pages = await client.queries.pagesConnection();
    pages.data?.pagesConnection.edges?.forEach((edge) => {
      const filename = edge?.node?._sys.filename;
      if (filename && filename !== 'homepage') {
        routes.push({
          url: `${BASE_URL}/p/${filename}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.7,
        });
      }
    });
  } catch (e) { /* skip */ }

  // Membership
  try {
    const membership = await client.queries.membershipPagesConnection();
    membership.data?.membershipPagesConnection.edges?.forEach((edge) => {
      const filename = edge?.node?._sys.filename;
      if (filename && filename !== 'index') {
        routes.push({
          url: `${BASE_URL}/membership/${filename}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.7,
        });
      }
    });
  } catch (e) { /* skip */ }

  // Knowledge hub
  try {
    const hub = await client.queries.knowledgeHubPagesConnection();
    hub.data?.knowledgeHubPagesConnection.edges?.forEach((edge) => {
      const filename = edge?.node?._sys.filename;
      if (filename && filename !== 'index') {
        routes.push({
          url: `${BASE_URL}/knowledge-hub/${filename}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.6,
        });
      }
    });
  } catch (e) { /* skip */ }

  // Our story
  try {
    const story = await client.queries.ourStoryPagesConnection();
    story.data?.ourStoryPagesConnection.edges?.forEach((edge) => {
      const filename = edge?.node?._sys.filename;
      if (filename && filename !== 'index') {
        routes.push({
          url: `${BASE_URL}/our-story/${filename}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.6,
        });
      }
    });
  } catch (e) { /* skip */ }

  // Static section index pages
  const sections = [
    { path: '/services', priority: 0.9 },
    { path: '/membership', priority: 0.8 },
    { path: '/knowledge-hub', priority: 0.7 },
    { path: '/our-story', priority: 0.7 },
  ];
  sections.forEach(({ path, priority }) => {
    routes.push({
      url: `${BASE_URL}${path}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority,
    });
  });

  return routes;
}
