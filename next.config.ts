
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https', // Protocol used (http or https)
        hostname: 'ticket.gosnd.com', // Hostname for image source
        pathname: '/uploads/**', // Match the path where your images are stored
      },
    ],
  },
};

export default nextConfig;
