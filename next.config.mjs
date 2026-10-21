/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  
  // Enable React Strict Mode
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
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },

  // Turbopack configuration (Next.js 16)
  turbopack: {
    resolveAlias: {
      "@": "./src",
    },
  },

  // Experimental features
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },

  // Proxy /api requests to Laravel backend
  async rewrites() {
    const backendUrl = process.env.LARAVEL_API_URL || "http://127.0.0.1:8001";
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
