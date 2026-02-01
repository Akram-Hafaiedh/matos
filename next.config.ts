import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'matos-psi.vercel.app',
      },
      {
        protocol: 'https',
        hostname: '*.vercel.app',
      }
    ],
  },
};

export default nextConfig;
