import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow network hot-reload connections from local network IP
  allowedDevOrigins: ["50.50.1.42"],

  // 1. Resolve Better Auth 404s natively by disabling trailing slashes
  trailingSlash: false,

  // 2. Image Optimization Configuration (Cloudinary)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "http",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
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