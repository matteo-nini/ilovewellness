import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // il pacchetto condiviso è distribuito come sorgente TypeScript
  transpilePackages: ["@ilovewellness/core"],
};

export default nextConfig;
