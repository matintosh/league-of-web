import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@low/ui", "@low/tokens", "@low/fixtures"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "ddragon.leagueoflegends.com" },
      { protocol: "https", hostname: "cdn.sanity.io" },
      // League of Legends official wiki CDN — used for League Classic promo art
      // (League_Classic_Promo_01.jpg), verified 200 at time of writing.
      { protocol: "https", hostname: "wiki.leagueoflegends.com" },
    ],
  },
};

export default nextConfig;
