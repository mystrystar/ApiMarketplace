import path from "path";
import type { NextConfig } from "next";

const backendUrl = process.env.BACKEND_URL || "http://localhost:3000";
const useBackendProxy =
  process.env.NODE_ENV === "development" || Boolean(process.env.BACKEND_URL);

const nextConfig: NextConfig = {
  devIndicators: false,
  // Dependencies are installed at the npm workspace root. Include that root in
  // Next.js output tracing so Netlify can bundle them into its runtime function.
  outputFileTracingRoot: path.join(__dirname, ".."),
  turbopack: {
    root: path.join(__dirname, ".."),
  },
  async rewrites() {
    if (!useBackendProxy) return [];

    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: "/v1/:path*",
        destination: `${backendUrl}/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
