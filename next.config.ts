import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow external image domains if needed
  images: {
    remotePatterns: [],
  },
  // Ensure Prisma edge-compatibility
  serverExternalPackages: ["@prisma/client"],
  allowedDevOrigins: ["localhost:3000", "192.168.1.6"],
};

export default nextConfig;
