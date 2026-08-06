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
    'Permanent hero for /merch/search — always rendered regardless of ?q=. Matches the real merch.riotgames.com/en-us/search which is a non-functional placeholder at all times. Light bg (--color-merch-bg / #ffffff), black H1 "NO SEARCH TERM PROVIDED" (48px/700/uppercase, ls -1.44px desktop, 38px/-0.76px mobile), chamfered purple CTA "SEARCH PRODUCTS" (clip-path corners, --color-merch-purple #4500d5, 239×50).',
  variants: [
    {
      name: "Default (no art src) — light bg",
      notes:
        "Standard hero shown at /merch/search at all URLs. Light near-white background matches the real site. Art slot uses a decorative placeholder because the real Riot CDN SVG has no stable public URL.",
      backgrounds: ["light"],
      render: () => <MerchSearchHero />,
    },
    {
      name: "With champion splash as art stand-in",
      notes:
        "The page route can supply any image URL as artSrc. A champion splash is used here as a visual stand-in for the real arcade_riven_ahri.svg art. Rendered faint (opacity 0.08) over the light bg.",
      backgrounds: ["light"],
      render: () => (
        <MerchSearchHero
          artSrc="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ahri_0.jpg"
          artAlt="Ahri splash — stand-in for arcade_riven_ahri.svg"
        />
      ),
    },
  ],
};
