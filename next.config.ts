import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http', // Protocol used (http or https)
        hostname: 'localhost', // Hostname for image source
        port: '5000', // Replace with the port your server runs on
        pathname: '/uploads/**', // Match the path where your images are stored
      },
    ],
  },
};

export default nextConfig;
