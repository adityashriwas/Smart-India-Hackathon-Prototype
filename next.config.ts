import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['recharts', 'lucide-react'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  eslint: {
    // Warnings will show in console but won't fail the build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
