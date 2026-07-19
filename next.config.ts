import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";
import { resolve } from "path";

const ROOT = resolve(process.cwd());

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

// Build the base config THEN let withPWA wrap it, so the PWA plugin has
// already applied its webpack mutations before we re-anchor the @/ alias.
const baseConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
};

const pwaConfig = withPWA(baseConfig);

// Patch AFTER withPWA so no subsequent pass can clobber @/ again.
const _inner = pwaConfig.webpack;
pwaConfig.webpack = function (config, options) {
  const result = _inner ? _inner(config, options) : config;
  if (!result.resolve) result.resolve = {};
  if (!result.resolve.alias) result.resolve.alias = {};
  // @ducanh2912/next-pwa v10 rewrites resolve.alias in its own webpack pass;
  // re-anchor @/ to the project root so every compilation phase finds it.
  (result.resolve.alias as Record<string, string>)["@"] = ROOT;
  return result;
};

export default pwaConfig;
