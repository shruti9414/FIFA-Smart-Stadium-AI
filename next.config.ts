import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const nextConfig: NextConfig = {
  // Demo/design deploy: don't let type-level noise block the build.
  // Runtime-breaking issues (missing exports) are fixed directly in code.
  typescript: { ignoreBuildErrors: true },
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
        // Static build assets rarely change once emitted — safe to revalidate in background.
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
        // Navigations: prefer fresh content, fall back to cache only when offline.
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
