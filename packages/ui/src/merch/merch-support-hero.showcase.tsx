/**
 * Showcase for MerchSupportHero — server-safe (NO 'use client').
 * Stateful variants are kept in merch-support-hero.demo.tsx.
 */

import type { ShowcaseEntry } from "../showcase";
import { MerchSupportHero } from "./merch-support-hero";

export const merchSupportHeroShowcase: ShowcaseEntry = {
  slug: "merch-support-hero",
  name: "Merch Support Hero",
  area: "merch",
  description:
    "Hero band shared across all /merch/pages/[slug] support info pages. Displays h1 \"SUPPORT\" (48px desktop / 38px mobile, 700, uppercase, ls -1.44px) on a light-grey background with a mascot illustration slot on the right. When no mascotSrc is provided a decorative placeholder is rendered (real panda mascot is Riot CDN — no stable public URL).",
  variants: [
    {
      name: "With placeholder (no mascot src)",
      notes:
        "Default state when mascotSrc is omitted — paw-print placeholder block shown. This is the expected state for portfolio; real asset is unavailable.",
      backgrounds: ["light"],
      render: () => <MerchSupportHero />,
    },
    {
      name: "With champion splash as mascot stand-in",
      notes:
        "Page route can supply any image URL as mascotSrc. Here a champion splash is used as a visual stand-in to demonstrate the layout with an actual image.",
      backgrounds: ["light"],
      render: () => (
        <MerchSupportHero
          mascotSrc="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Lulu_0.jpg"
          mascotAlt="Champion splash stand-in for mascot illustration"
        />
      ),
    },
  ],
};
