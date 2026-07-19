import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";
import { resolve } from "path";

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  webpack(config) {
    // next-pwa v10 runs its own webpack pass that can clobber the @/ alias
    // set up by Next.js. Re-apply it explicitly so every compilation pass
    // (pwa server, pwa client, main app) resolves @/ to the project root.
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": resolve(process.cwd()),
    };
    return config;
  },
};

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  reloadOnOnline: true,
  cacheOnFrontEndNav: true,
  fallbacks: {
    document: "/offline",
  },
  workboxOptions: {
    disableDevLogs: true,
    runtimeCaching: [
      {
        // Live data must never be served stale from cache.
        urlPattern: /^\/api\/.*/i,
        handler: "NetworkOnly",
      },
      {
        urlPattern: /^https?.*\/socket\.io\/.*/i,
        handler: "NetworkOnly",
      },
      {
        urlPattern: /^\/_next\/static\/.*/i,
        handler: "StaleWhileRevalidate",
        options: { cacheName: "static-assets" },
      },
      {
        urlPattern: /^\/icons\/.*/i,
        handler: "StaleWhileRevalidate",
        options: { cacheName: "icons" },
      },
      {
        urlPattern: ({ request }: { request: Request }) => request.mode === "navigate",
        handler: "NetworkFirst",
        options: {
          cacheName: "pages",
          networkTimeoutSeconds: 4,
        },
      },
    ],
  },
});

export default withPWA(nextConfig);
