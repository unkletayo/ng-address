import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@ng-address/core", "@ng-address/nipost", "@ng-address/react"]
};

export default nextConfig;
