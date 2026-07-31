import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow external image domains if needed
  images: {
    remotePatterns: [],
  },
  // Ensure Prisma edge-compatibility
  serverExternalPackages: ["@prisma/client"],
};

export default nextConfig;
