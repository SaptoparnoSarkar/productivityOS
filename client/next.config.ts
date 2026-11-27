import type { NextConfig } from "next";

const apiUrl = process.env.API_URL;


if (!apiUrl) {
  throw new Error("API_URL is missing. Set it in .env.local or on Vercel.");
}

const nextConfig: NextConfig = {

  // Reverse proxy: the browser calls the frontend, Next forwards to the backend.
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`,
      },
      {
        source: "/auth/:path*",
        destination: `${apiUrl}/auth/:path*`,
      },
    ];
  },
};

export default nextConfig;
