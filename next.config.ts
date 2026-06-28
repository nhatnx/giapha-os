import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.BUILD_STANDALONE === "1" ? "standalone" : undefined,
  allowedDevOrigins: ["192.168.86.32"],
};

export default nextConfig;
