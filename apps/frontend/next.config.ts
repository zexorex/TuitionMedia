import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["shared-schema"],
  output: "standalone",
};

export default nextConfig;
