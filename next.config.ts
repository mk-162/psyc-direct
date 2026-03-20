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
      {
        source: "/admin",
        destination: "/admin/index.html",
      },
      {
        source: "/admin/:path*",
        destination: "/admin/:path*",
      },
    ];
  },
  async redirects() {
    return [
      // Add PD 301 redirects here in Phase 4
    ];
  },
};

export default nextConfig;
