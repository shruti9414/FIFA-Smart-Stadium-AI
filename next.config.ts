import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

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

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
};

export default withPWA(nextConfig);
