import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:3001/api/:path*", // Chuyển hướng mọi request /api sang cổng 3001 của B
      },
    ];
  },
};

export default nextConfig;