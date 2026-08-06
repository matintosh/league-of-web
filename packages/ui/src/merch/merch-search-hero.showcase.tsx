/**
 * Showcase for MerchSearchHero — server-safe (NO 'use client').
 * onSearchClick is an optional callback; not passing it in static variants keeps
 * this file prerender-safe. The CTA renders but click is a no-op in showcase.
 */

import type { ShowcaseEntry } from "../showcase";
import { MerchSearchHero } from "./merch-search-hero";

export const merchSearchHeroShowcase: ShowcaseEntry = {
  slug: "merch-search-hero",
  name: "Merch Search Hero",
  area: "merch",
  description:
    'No-query hero for /merch/search. Shown when the URL has no ?q= term. Displays h1 "NO SEARCH TERM PROVIDED" (48px / 700 / uppercase, letter-spacing -1.44px) on a diagonal purple/crimson split background with a champion art slot, plus a purple "SEARCH PRODUCTS" CTA (--color-merch-purple, 239×50, radius 0). Gates the results UI — only the product grid is shown once a query is present.',
  variants: [
    {
      name: "Default (no art src)",
      notes:
        "Standard empty-state shown at /merch/search with no ?q=. Art slot uses a decorative placeholder because the real Riot CDN SVG has no stable public URL.",
      backgrounds: ["dark"],
      render: () => <MerchSearchHero />,
    },
    {
      name: "With champion splash as art stand-in",
      notes:
        "The page route can supply any image URL as artSrc. A champion splash is used here as a visual stand-in for the real arcade_riven_ahri.svg art.",
      backgrounds: ["dark"],
      render: () => (
        <MerchSearchHero
          artSrc="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ahri_0.jpg"
          artAlt="Ahri splash — stand-in for arcade_riven_ahri.svg"
        />
      ),
    },
  ],
};
