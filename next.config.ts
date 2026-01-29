import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'matos-psi.vercel.app',
      },
    ],
  },
};

export default nextConfig;
