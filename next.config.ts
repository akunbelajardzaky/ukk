import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    GITHUB_ID: "Ov23liHVksBzgnKRlBMD",
    GITHUB_SECRET: "92abd461a97858a27a3103ce742acd7dc442ffb4",
  },


  images: {
    domains: ["lh3.googleusercontent.com"],
  },

  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
};

export default nextConfig;
