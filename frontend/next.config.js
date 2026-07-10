const runtimeCaching = require("next-pwa/cache");

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  runtimeCaching,
  buildExcludes: [/middleware-manifest\.json$/],
  scope: "/",
  sw: "service-worker.js",
  skipWaiting: true,
  disable: process.env.NODE_ENV !== "production",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  // 🔴 IMPORTANT (add this)
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    remotePatterns: [
      { hostname: "res.cloudinary.com" },
      { hostname: "i.postimg.cc" },
      { hostname: "img.youtube.com" },
      { hostname: "placehold.co" },
      { hostname: "images.unsplash.com" },
    ],
  },

  i18n: {
    locales: ["en", "es", "fr", "de"],
    defaultLocale: "en",
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};

module.exports = withPWA(nextConfig);