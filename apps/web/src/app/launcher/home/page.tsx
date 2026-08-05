/**
 * /launcher/home — Riot multi-game launcher Home page.
 *
 * Renders the LauncherRiotHomePage component with:
 *   - LoL Classic featured promo hero (Warwick splash)
 *   - 5 cross-game patch note cards (VALORANT, LoL, TFT)
 *   - Left rail via LauncherRail with home active
 *
 * Server component — no 'use client'. All fixture values inline (no fetch).
 * Assembles within the full-height dark launcher shell without the LoL friends
 * panel (Riot Home has rail + content; no social panel per ref image-5.png).
 *
 * Closes #678.
 */

import { championSplashUrl } from "@low/fixtures";
import type { PatchNoteData } from "@low/fixtures";
import { LauncherRail } from "@low/ui";
import { LauncherWindowBar } from "@low/ui";
import { LauncherRiotHomePage } from "@low/ui";

// ---------------------------------------------------------------------------
// Game logos — recreated as data-URI SVGs (embedded-image assets, used as <img src>).
// Colors are baked into the encoded SVG because a data URI cannot reference CSS
// custom properties; the hexes intentionally mirror the design tokens
// (#c89b3c = --color-gold-3, #f0e6d2 = --color-gold-1, #0a0a0a ≈ --color-launcher-bg).
// Same brand-asset latitude as the recreated merch/login logos.
// ---------------------------------------------------------------------------

const LOL_CLASSIC_LOGO = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" fill="none">
  <rect x="1" y="1" width="198" height="98" rx="4" stroke="#c89b3c" stroke-width="2" fill="#0a0a0a"/>
  <text x="100" y="34" font-family="Georgia,serif" font-size="13" font-weight="700" fill="#f0e6d2" text-anchor="middle" letter-spacing="2">LEAGUE OF</text>
  <text x="100" y="56" font-family="Georgia,serif" font-size="22" font-weight="700" fill="#f0e6d2" text-anchor="middle" letter-spacing="1">LEGENDS</text>
  <line x1="20" y1="64" x2="180" y2="64" stroke="#c89b3c" stroke-width="1"/>
  <text x="100" y="84" font-family="Georgia,serif" font-size="16" font-weight="700" fill="#c89b3c" text-anchor="middle" letter-spacing="4">CLASSIC</text>
</svg>
`)}`;

const VALORANT_LOGO = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 30" fill="none">
  <text x="2" y="24" font-family="Impact,Arial Black,sans-serif" font-size="22" font-weight="900" fill="#ffffff" letter-spacing="-0.5">VALORANT</text>
</svg>
`)}`;

const LOL_LOGO_THUMB = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 30" fill="none">
  <text x="2" y="22" font-family="Georgia,serif" font-size="11" font-weight="700" fill="#ffffff" letter-spacing="1">LEAGUE OF LEGENDS</text>
</svg>
`)}`;

const TFT_LOGO = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" fill="none">
  <text x="2" y="24" font-family="Impact,Arial Black,sans-serif" font-size="24" font-weight="900" fill="#ffffff" letter-spacing="1">TFT</text>
</svg>
`)}`;

// ---------------------------------------------------------------------------
// Fixture data
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

const RAIL_ITEMS = [
  {
    id: "home",
    label: "Home",
    position: "top" as const,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M3 12L12 3l9 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "lol",
    label: "League of Legends",
    position: "top" as const,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "valorant",
    label: "VALORANT",
    position: "top" as const,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <polygon points="12,3 21,20 3,20" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "tft",
    label: "Teamfight Tactics",
    position: "top" as const,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M7 12h10M12 7v10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function LauncherHomePage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100%",
        backgroundColor: "var(--color-launcher-bg)",
        overflow: "hidden",
      }}
    >
      {/* Window bar */}
      <div style={{ flexShrink: 0 }}>
        <LauncherWindowBar />
      </div>

      {/* Home page content — rail + main */}
      <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
        <LauncherRiotHomePage
          featuredPromo={FEATURED_PROMO}
          patchNotes={PATCH_NOTES}
          nav={
            <LauncherRail items={RAIL_ITEMS} activeId="home" />
          }
        />
      </div>
    </div>
  );
}
