import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://davidlong-tech-backend-ddf83c56b82b.herokuapp.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;
