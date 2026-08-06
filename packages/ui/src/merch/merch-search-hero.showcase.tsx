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
    'Permanent hero for /merch/search — always rendered regardless of ?q=. Matches the real merch.riotgames.com/en-us/search. THREE layered background assets: arcade_riven_ahri.svg (full-bleed cover), pattern-404.svg (contain top-right), ziggs.png (320×288 at left=704px top=208px). High-anchored content (paddingTop 320px desktop / 240px mobile). Black H1 (48px/700/uppercase desktop, 38px mobile), 12px H1→CTA gap, chamfered purple CTA (--color-merch-purple #4500d5, 239×50).',
  variants: [
    {
      name: "Real layered art — arcade + pattern + Ziggs",
      notes:
        "Full hero with three real assets from merch.riotgames.com/assets/ (hotlinkable). " +
        "arcade_riven_ahri.svg is intrinsically faint/grayscale — no extra opacity wrapper. " +
        "pattern-404.svg contains at top-right. ziggs.png at left=704px, top=208px within the band. " +
        "Content high-anchored: paddingTop 320px desktop, 240px mobile. H1→CTA gap 12px.",
      backgrounds: ["light"],
      render: () => (
        <MerchSearchHero
          arcadeSrc="https://merch.riotgames.com/assets/arcade_riven_ahri.svg"
          patternSrc="https://merch.riotgames.com/assets/pattern-404.svg"
          ziggsSrc="https://merch.riotgames.com/assets/ziggs.png"
        />
      ),
    },
    {
      name: "No art (placeholder) — light bg",
      notes:
        "Fallback when no arcadeSrc is supplied. The decorative diagonal placeholder renders " +
        "at 0.08 opacity (--color-merch-search-hero-art-opacity) so the white bg still reads. " +
        "High anchoring and 12px gap still apply.",
      backgrounds: ["light"],
      render: () => <MerchSearchHero />,
    },
    {
      name: "With champion splash as arcade stand-in (backwards compat)",
      notes:
        "artSrc prop (deprecated alias for arcadeSrc) still works. " +
        "A champion splash is a visual stand-in for arcade_riven_ahri.svg. " +
        "When arcadeSrc/artSrc is supplied, NO opacity wrapper is applied — the image renders at natural fidelity.",
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
