import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    root: __dirname,
    resolveAlias: {
      "tinacms/dist/client": "tinacms/dist/client",
      "tinacms/dist/rich-text": "tinacms/dist/rich-text",
      "tinacms/dist/react": "tinacms/dist/react",
    },
  },
  async rewrites() {
    return [
      { source: "/admin", destination: "/admin/index.html" },
      { source: "/admin/:path*", destination: "/admin/:path*" },
      // Policy/utility pages served at root URLs (content lives in utility collection)
      { source: "/privacy-policy", destination: "/utility/privacy-policy" },
      { source: "/terms-conditions", destination: "/utility/terms-conditions" },
      { source: "/cookie-policy", destination: "/utility/cookie-policy" },
      { source: "/accessibility", destination: "/utility/accessibility" },
      // complaints-policy is in pages collection, served by [slug] catch-all
      // client-login and expert-login are in pages collection, served by [slug] catch-all
    ];
  },
  async redirects() {
    return [
      // Legacy psychology-specific pages → merged pages
      { source: "/psychology-expert-witness/", destination: "/expert-witness-psychologists/", permanent: true },
      { source: "/psychology-expert-witness/:slug/", destination: "/expert-witness-psychologists/:slug/", permanent: true },
      { source: "/psychiatry-expert-witness/", destination: "/expert-witness-psychologists/", permanent: true },
      { source: "/psychiatry-expert-witness/:slug/", destination: "/expert-witness-psychologists/:slug/", permanent: true },

      // Legacy education paths
      { source: "/education/", destination: "/educational-psychologist/", permanent: true },
      { source: "/education/:slug/", destination: "/educational-psychologist/:slug/", permanent: true },
      { source: "/educational-psychology/", destination: "/educational-psychologist/", permanent: true },
      { source: "/educational-psychology/:slug/", destination: "/educational-psychologist/:slug/", permanent: true },

      // Legacy service paths
      { source: "/services/", destination: "/", permanent: true },
      { source: "/services/expert-witness/", destination: "/expert-witness-psychologists/", permanent: true },
      { source: "/services/educational-psychologist/", destination: "/educational-psychologist/", permanent: true },

      // Legacy about paths
      { source: "/about-us/", destination: "/about/", permanent: true },
      { source: "/our-team/", destination: "/about/meet-the-team/", permanent: true },
      { source: "/team/", destination: "/about/meet-the-team/", permanent: true },

      // Legacy resource paths
      { source: "/for-psychologists/", destination: "/resources/professionals/", permanent: true },
      { source: "/for-solicitors/", destination: "/resources/legal/", permanent: true },
      { source: "/for-schools/", destination: "/resources/education/", permanent: true },
      { source: "/make-a-referral/", destination: "/contact/", permanent: true },

      // Legacy page renames
      { source: "/faq/", destination: "/faqs/", permanent: true },
      { source: "/frequently-asked-questions/", destination: "/faqs/", permanent: true },
      { source: "/testimonial/", destination: "/about/testimonials/", permanent: true },
      { source: "/testimonials/", destination: "/about/testimonials/", permanent: true },

      // Psychiatry Direct domain paths (same site, different branding)
      { source: "/psychiatry/", destination: "/expert-witness-psychologists/", permanent: true },
      { source: "/psychiatry/:slug/", destination: "/expert-witness-psychologists/:slug/", permanent: true },
    ];
  },
};

export default nextConfig;
