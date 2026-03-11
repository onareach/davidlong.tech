import type { NextConfig } from "next";

const HEROKU_API = "https://davidlong-tech-backend-ddf83c56b82b.herokuapp.com";

const nextConfig: NextConfig = {
  async rewrites() {
    // Use local backend when NEXT_PUBLIC_API_URL points to localhost (for dev testing)
    const apiBase = process.env.NEXT_PUBLIC_API_URL || HEROKU_API;
    const dest = apiBase.replace(/\/$/, "");
    return [
      {
        source: "/api/:path*",
        destination: `${dest}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
