import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@low/ui", "@low/tokens", "@low/fixtures"],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "ddragon.leagueoflegends.com" }],
  },
};

export default nextConfig;
