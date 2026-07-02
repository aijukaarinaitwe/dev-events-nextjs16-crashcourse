import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Keeps Next.js from throwing errors if paths end with a slash
  trailingSlash: true,

  // 2. Image Optimization Configuration (Cloudinary)
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "res.cloudinary.com",
      },
    ],
  },

  // 3. PostHog Ingest / Reverse Proxy Rewrites
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "http://us-assets.i.posthog.com/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "http://us.i.posthog.com/:path*",
      },
    ];
  },
};

export default nextConfig;