import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
      },
      {
        protocol: 'https',
        hostname: '**.ibb.co',
      },
      {
        protocol: 'https',
        hostname: 'api.imgbb.com',
      },
    ],
  },
};

export default nextConfig;
