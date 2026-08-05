/**
 * Showcase entry for FeaturedGamePromoHero.
 *
 * Server-safe — no 'use client'. Stateful CTA interaction belongs in
 * featured-game-promo-hero.demo.tsx.
 *
 * Three variants: LoL Classic (ref match), VALORANT, TFT.
 */

import type { ShowcaseEntry } from "../showcase";
import { championSplashUrl } from "@low/fixtures";
import { FeaturedGamePromoHero } from "./featured-game-promo-hero";

// ---------------------------------------------------------------------------
// Inline SVG logos — recreated as currentColor wordmarks / emblems.
// Data URIs supplied by the page/showcase (never fetched in @low/ui).
// ---------------------------------------------------------------------------

/**
 * LoL Classic emblem: stacked "League of Legends / CLASSIC" wordmark in a
 * boxed style. Cream color (#f0e6d2) on transparent.
 */
const LOL_CLASSIC_LOGO_SVG = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" fill="none">
  <rect x="1" y="1" width="198" height="98" rx="4" stroke="%23c89b3c" stroke-width="2" fill="%230a0a0a"/>
  <text x="100" y="34" font-family="Georgia,serif" font-size="13" font-weight="700" fill="%23f0e6d2" text-anchor="middle" letter-spacing="2">LEAGUE OF</text>
  <text x="100" y="56" font-family="Georgia,serif" font-size="22" font-weight="700" fill="%23f0e6d2" text-anchor="middle" letter-spacing="1">LEGENDS</text>
  <line x1="20" y1="64" x2="180" y2="64" stroke="%23c89b3c" stroke-width="1"/>
  <text x="100" y="84" font-family="Georgia,serif" font-size="16" font-weight="700" fill="%23c89b3c" text-anchor="middle" letter-spacing="4">CLASSIC</text>
</svg>
`)}`;

/**
 * VALORANT wordmark: bold all-caps with red accent bar. White on transparent.
 */
const VALORANT_LOGO_SVG = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 60" fill="none">
  <text x="4" y="46" font-family="Impact,Arial Black,sans-serif" font-size="42" font-weight="900" fill="%23ffffff" letter-spacing="-1">VALORANT</text>
  <rect x="4" y="50" width="212" height="3" fill="%23ff4655"/>
</svg>
`)}`;

/**
 * TFT wordmark: block letters, gold-tinted.
 */
const TFT_LOGO_SVG = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 60" fill="none">
  <text x="4" y="50" font-family="Impact,Arial Black,sans-serif" font-size="50" font-weight="900" fill="%23c89b3c" letter-spacing="2">TFT</text>
</svg>
`)}`;

export const featuredGamePromoHeroShowcase: ShowcaseEntry = {
  slug: "featured-game-promo-hero",
  name: "FeaturedGamePromoHero",
  area: "launcher",
  description:
    "Full-width ~380 px hero banner on the Riot launcher Home page. Full-bleed splash, left gradient overlay, game logo + tagline + body copy + CTA. Issue #680.",
  variants: [
    {
      name: "League of Legends Classic (ref match)",
      notes:
        "Matches image-5.png: LoL Classic logo + 'League Classic is Here' tagline. Warwick skin 1 splash.",
      render: () => (
        <div
          style={{
            width: 1080,
            backgroundColor: "var(--color-launcher-bg)",
            padding: 16,
          }}
        >
          <FeaturedGamePromoHero
            gameKey="lol"
            gameLogo={LOL_CLASSIC_LOGO_SVG}
            tagline="League Classic is Here"
            description="Rediscover the early days of League with the original champion designs, visuals, and item builds."
            ctaLabel="Try Classic"
            splashUrl={championSplashUrl("Warwick", 1)}
          />
        </div>
      ),
    },
    {
      name: "VALORANT promo",
      notes:
        "VALORANT variant: red-accented logo, different splash (Jinx as placeholder for a VALORANT splash art).",
      render: () => (
        <div
          style={{
            width: 1080,
            backgroundColor: "var(--color-launcher-bg)",
            padding: 16,
          }}
        >
          <FeaturedGamePromoHero
            gameKey="valorant"
            gameLogo={VALORANT_LOGO_SVG}
            tagline="New Agent — Coming Soon"
            description="A new Duelist enters the fray. Master their kit and climb the ranks in Episode 9 Act 2."
            ctaLabel="Learn More"
            splashUrl={championSplashUrl("Jinx", 0)}
          />
        </div>
      ),
    },
    {
      name: "TFT promo",
      notes:
        "TFT variant with gold logo and Lissandra splash as placeholder art.",
      render: () => (
        <div
          style={{
            width: 1080,
            backgroundColor: "var(--color-launcher-bg)",
            padding: 16,
          }}
        >
          <FeaturedGamePromoHero
            gameKey="tft"
            gameLogo={TFT_LOGO_SVG}
            tagline="Set 14: Cyber City"
            description="Dive into the neon-lit streets of Cyber City. New traits, champions, and a whole new set await."
            ctaLabel="Play Now"
            splashUrl={championSplashUrl("Lissandra", 0)}
          />
        </div>
      ),
    },
  ],
};
