import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin/', '/component-library/'] },
    ],
    sitemap: 'https://www.psychologydirect.co.uk/sitemap.xml',
  };
}
