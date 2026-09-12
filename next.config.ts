import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  
  // Enable React Strict Mode for development
  reactStrictMode: true,
  
  // Optimize images
  images: {
    unoptimized: false,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },

  // Turbopack configuration (Next.js 16 default)
  turbopack: {
    resolveAlias: {
      "@": "./src",
    },
  },

  // Experimental features
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
