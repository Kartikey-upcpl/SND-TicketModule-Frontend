import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000', // If running on a different port, update accordingly
        pathname: '/uploads/**', // Adjust the path to match your images' location
      },
    ],
  },
};

export default nextConfig;
