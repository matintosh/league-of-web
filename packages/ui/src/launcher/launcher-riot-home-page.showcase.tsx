/**
 * Showcase entry for LauncherRiotHomePage.
 *
 * Server-safe — no 'use client'. Stateful interaction in
 * launcher-riot-home-page.demo.tsx.
 */

import type { ShowcaseEntry } from "../showcase";
import { championSplashUrl } from "@low/fixtures";
import type { PatchNoteData } from "@low/fixtures";
import { LauncherRail } from "./launcher-rail";
import { LauncherRiotHomePage } from "./launcher-riot-home-page";

// ---------------------------------------------------------------------------
// Inline SVG game logos
// ---------------------------------------------------------------------------

const LOL_CLASSIC_LOGO = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" fill="none">
  <rect x="1" y="1" width="198" height="98" rx="4" stroke="%23c89b3c" stroke-width="2" fill="%230a0a0a"/>
  <text x="100" y="34" font-family="Georgia,serif" font-size="13" font-weight="700" fill="%23f0e6d2" text-anchor="middle" letter-spacing="2">LEAGUE OF</text>
  <text x="100" y="56" font-family="Georgia,serif" font-size="22" font-weight="700" fill="%23f0e6d2" text-anchor="middle" letter-spacing="1">LEGENDS</text>
  <line x1="20" y1="64" x2="180" y2="64" stroke="%23c89b3c" stroke-width="1"/>
  <text x="100" y="84" font-family="Georgia,serif" font-size="16" font-weight="700" fill="%23c89b3c" text-anchor="middle" letter-spacing="4">CLASSIC</text>
</svg>
`)}`;

const VALORANT_LOGO = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 30" fill="none">
  <text x="2" y="24" font-family="Impact,Arial Black,sans-serif" font-size="22" font-weight="900" fill="%23ffffff" letter-spacing="-0.5">VALORANT</text>
</svg>
`)}`;

const LOL_LOGO_THUMB = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 30" fill="none">
  <text x="2" y="22" font-family="Georgia,serif" font-size="11" font-weight="700" fill="%23ffffff" letter-spacing="1">LEAGUE OF LEGENDS</text>
</svg>
`)}`;

const TFT_LOGO = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" fill="none">
  <text x="2" y="24" font-family="Impact,Arial Black,sans-serif" font-size="24" font-weight="900" fill="%23ffffff" letter-spacing="1">TFT</text>
</svg>
`)}`;

// ---------------------------------------------------------------------------
// Rail items — simplified set for the Riot Home (no LoL tab bar)
// ---------------------------------------------------------------------------

const RAIL_ITEMS = [
  {
    id: "home",
    label: "Home",
    position: "top" as const,
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M3 12L12 3l9 9"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "lol",
    label: "League of Legends",
    position: "top" as const,
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M12 7v5l3 3"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "valorant",
    label: "VALORANT",
    position: "top" as const,
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <polygon
          points="12,3 21,20 3,20"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "tft",
    label: "Teamfight Tactics",
    position: "top" as const,
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="3"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M7 12h10M12 7v10"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

// ---------------------------------------------------------------------------
// Fixture data — values inline, types from @low/fixtures
// ---------------------------------------------------------------------------

const FEATURED_PROMO = {
  gameKey: "lol",
  gameLogo: LOL_CLASSIC_LOGO,
  tagline: "League Classic is Here",
  description:
    "Rediscover the early days of League with the original champion designs, visuals, and item builds.",
  ctaLabel: "Try Classic",
  splashUrl: championSplashUrl("Warwick", 1),
};

const PATCH_NOTES: PatchNoteData[] = [
  {
    id: "val-patch-13-02",
    gameKey: "valorant",
    gameName: "VALORANT",
    gameLogo: VALORANT_LOGO,
    title: "VALORANT Patch Notes 13.02",
    thumbUrl: championSplashUrl("Jinx", 0),
    publishedAt: "2026-07-02T00:00:00Z",
    href: "/patch-notes/valorant-13-02",
  },
  {
    id: "lol-patch-25-14",
    gameKey: "lol",
    gameName: "League of Legends",
    gameLogo: LOL_LOGO_THUMB,
    title: "League of Legends Patch 25.14",
    thumbUrl: championSplashUrl("Warwick", 1),
    publishedAt: "2026-07-16T00:00:00Z",
    href: "/patch-notes/lol-25-14",
  },
  {
    id: "tft-patch-14-2",
    gameKey: "tft",
    gameName: "TFT",
    gameLogo: TFT_LOGO,
    title: "TFT Patch Notes 14.2",
    thumbUrl: championSplashUrl("Lissandra", 0),
    publishedAt: "2026-07-16T00:00:00Z",
    href: "/patch-notes/tft-14-2",
  },
  {
    id: "val-patch-13-01",
    gameKey: "valorant",
    gameName: "VALORANT",
    gameLogo: VALORANT_LOGO,
    title: "VALORANT Patch Notes 13.01",
    thumbUrl: championSplashUrl("Ahri", 0),
    publishedAt: "2026-06-18T00:00:00Z",
    href: "/patch-notes/valorant-13-01",
  },
  {
    id: "lol-patch-25-13",
    gameKey: "lol",
    gameName: "League of Legends",
    gameLogo: LOL_LOGO_THUMB,
    title: "League of Legends Patch 25.13",
    thumbUrl: championSplashUrl("Yasuo", 0),
    publishedAt: "2026-07-02T00:00:00Z",
    href: "/patch-notes/lol-25-13",
  },
];

export const launcherRiotHomePageShowcase: ShowcaseEntry = {
  slug: "launcher-riot-home-page",
  name: "LauncherRiotHomePage",
  area: "launcher",
  description:
    "Riot multi-game launcher Home page: left rail + 'Home' heading + FeaturedGamePromoHero (LoL Classic) + 'Latest Patch Notes' horizontal card row. Route: /launcher/home. Issue #678.",
  variants: [
    {
      name: "Riot Home — full composition (1280×720)",
      notes:
        "Rail (Home active) + LoL Classic promo hero (Warwick splash) + 5 patch note cards. Matches image-5.png layout.",
      render: () => (
        <div
          style={{
            width: 1280,
            height: 720,
            overflow: "hidden",
            backgroundColor: "var(--color-launcher-bg)",
          }}
        >
          <LauncherRiotHomePage
            featuredPromo={FEATURED_PROMO}
            patchNotes={PATCH_NOTES}
            nav={
              <LauncherRail items={RAIL_ITEMS} activeId="home" />
            }
          />
        </div>
      ),
    },
    {
      name: "Riot Home — narrower viewport (960×600)",
      notes:
        "Verifies the horizontal patch note scroll works at a narrower viewport.",
      render: () => (
        <div
          style={{
            width: 960,
            height: 600,
            overflow: "hidden",
            backgroundColor: "var(--color-launcher-bg)",
          }}
        >
          <LauncherRiotHomePage
            featuredPromo={FEATURED_PROMO}
            patchNotes={PATCH_NOTES}
            nav={
              <LauncherRail items={RAIL_ITEMS} activeId="home" />
            }
          />
        </div>
      ),
    },
  ],
};
