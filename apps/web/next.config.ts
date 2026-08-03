import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@low/ui", "@low/tokens", "@low/fixtures"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "ddragon.leagueoflegends.com" },
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
};

export default nextConfig;
