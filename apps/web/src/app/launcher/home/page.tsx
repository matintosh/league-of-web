/**
 * /launcher/home — Riot multi-game launcher Home page.
 *
 * Renders the LauncherRiotHomePage component with:
 *   - LoL Classic featured promo hero (real League Classic group promo art)
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
import {
  LauncherRail,
  LauncherWindowBar,
  LauncherRiotHomePage,
  GameLolLogo,
  GameValorantLogo,
  GameTftLogo,
  GameTwoXkoLogo,
  GameWildRiftLogo,
  GameRiotShieldLogo,
} from "@low/ui";

// ---------------------------------------------------------------------------
// LoL Classic landscape logo lockup — server-safe inline SVG.
//
// Replaces the LolClassicLogo portrait SVG (aspect ~1:1.55 → 120×186 which
// clips in the hero overlay). Ref: "LEAGUE OF LEGENDS" stacked wordmark +
// "CLASSIC" ribbon, landscape ≈210×100px (image-5.png ÷1.2 ref).
//
// Uses only currentColor so the parent text-gold-3 class controls the fill.
// data-URI exception: no CSS tokens can be referenced inside SVG fills, but
// this SVG uses only currentColor (inherited from the className on the wrapper).
// ---------------------------------------------------------------------------
function LolClassicHeroLogo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 210 100"
      width={210}
      height={100}
      role="img"
      aria-label="League of Legends Classic"
      style={{ color: "var(--color-launcher-wordmark)", display: "block" }}
      fill="currentColor"
    >
      {/* Top line: "LEAGUE OF" */}
      <text
        x="105"
        y="32"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="22"
        fontWeight="700"
        fontFamily="'Beaufort for LOL','Georgia',serif"
        letterSpacing="4"
        fill="currentColor"
      >
        LEAGUE OF
      </text>

      {/* Bottom line: "LEGENDS" — larger to match the stacked logo proportions */}
      <text
        x="105"
        y="60"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="28"
        fontWeight="700"
        fontFamily="'Beaufort for LOL','Georgia',serif"
        letterSpacing="4"
        fill="currentColor"
      >
        LEGENDS
      </text>

      {/* Divider lines flanking "CLASSIC" ribbon */}
      <line x1="10" y1="78" x2="68" y2="78" stroke="currentColor" strokeWidth="1" strokeOpacity="0.6" />
      <line x1="142" y1="78" x2="200" y2="78" stroke="currentColor" strokeWidth="1" strokeOpacity="0.6" />

      {/* "CLASSIC" ribbon label */}
      <text
        x="105"
        y="78"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="11"
        fontWeight="600"
        fontFamily="'Beaufort for LOL','Georgia',serif"
        letterSpacing="5"
        fill="currentColor"
        fillOpacity="0.85"
      >
        CLASSIC
      </text>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Classic promo splash — real League Classic group key art from the LoL wiki.
// Verified 200 at time of commit; host added to next.config remotePatterns.
// Source: wiki.leagueoflegends.com/en-us/images/League_Classic_Promo_01.jpg
// This is the multi-champion clock-scene group promo referenced in the issue.
// ---------------------------------------------------------------------------
const CLASSIC_PROMO_SPLASH_URL =
  "https://wiki.leagueoflegends.com/en-us/images/League_Classic_Promo_01.jpg";

// ---------------------------------------------------------------------------
// Patch note card logos — compact game wordmarks as data-URI SVGs.
// Used as <img src> at 20px height inside PatchNoteCard (gameLogo: string).
// The paths below are simplified path-based wordmarks (no text nodes) so they
// render correctly at small sizes with filter:brightness(0)invert(1).
//
// Colors baked in (#ffffff) because data URIs cannot reference CSS tokens;
// the card applies filter:brightness(0)invert(1) on top for white output.
// ---------------------------------------------------------------------------

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
// Featured promo — LoL Classic with real group art splash.
// gameLogo kept as empty string (logoNode override used instead via the page).
// ---------------------------------------------------------------------------

const FEATURED_PROMO = {
  gameKey: "lol",
  gameLogo: "",
  tagline: "League Classic is Here",
  description:
    "Rediscover the early days of League with the original champion designs, visuals, and item builds.",
  ctaLabel: "Try Classic",
  splashUrl: CLASSIC_PROMO_SPLASH_URL,
};

// ---------------------------------------------------------------------------
// Patch note cards
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Rail items — compact game logo SVGs from the launcher game-logos package.
// Home uses a house icon; LoL/VALORANT/TFT use their real compact emblems.
// ---------------------------------------------------------------------------

/**
 * Full Riot roster — 9 items matching the ref (image.png left rail).
 * Top: Riot fist, Home (active), All-games grid, LoL, Valorant, Wild Rift, 2XKO, TFT.
 * Bottom pinned: Riot R shield.
 */
const RAIL_ITEMS = [
  {
    id: "riot",
    label: "Riot Games",
    position: "top" as const,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M7 4h10v2H7V4zm-1 3h12v1.5l1 2v4.5H5v-4.5l1-2V7zm2 6.5h8V11H8v2.5zm-2 2h12v1H6v-1zm1 2h10v1H7v-1z" />
      </svg>
    ),
  },
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
    id: "games",
    label: "All Games",
    position: "top" as const,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" fill="currentColor">
        <rect x="2" y="2" width="7" height="7" rx="1" />
        <rect x="11" y="2" width="7" height="7" rx="1" />
        <rect x="2" y="11" width="7" height="7" rx="1" />
        <rect x="11" y="11" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    id: "lol",
    label: "League of Legends",
    position: "top" as const,
    icon: <GameLolLogo size={28} variant="emblem" />,
  },
  {
    id: "valorant",
    label: "VALORANT",
    position: "top" as const,
    icon: <GameValorantLogo size={28} variant="emblem" />,
  },
  {
    id: "wildrift",
    label: "Wild Rift",
    position: "top" as const,
    icon: <GameWildRiftLogo size={28} variant="emblem" />,
  },
  {
    id: "2xko",
    label: "2XKO",
    position: "top" as const,
    icon: <GameTwoXkoLogo size={28} variant="emblem" />,
  },
  {
    id: "tft",
    label: "Teamfight Tactics",
    position: "top" as const,
    icon: <GameTftLogo size={28} variant="emblem" />,
  },
  {
    id: "riot-shield",
    label: "Riot",
    position: "bottom" as const,
    icon: <GameRiotShieldLogo size={28} />,
  },
];

export default function LauncherHomePage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
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
          featuredPromoLogoNode={
            /* Landscape lockup (~210×100px) — never wraps/clips in the hero
               overlay column. Replaces the portrait LolClassicLogo (120×186)
               which clipped the "CLASSIC" ribbon against the hero content. */
            <LolClassicHeroLogo />
          }
          patchNotes={PATCH_NOTES}
          nav={
            <LauncherRail items={RAIL_ITEMS} activeId="home" />
          }
        />
      </div>
    </div>
  );
}
