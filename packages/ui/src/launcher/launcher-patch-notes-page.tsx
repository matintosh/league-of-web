/**
 * LauncherPatchNotesPage — Patch Notes tab content for the /launcher section.
 *
 * Renders LauncherPatchHeroBanner with hardcoded patch 26.15 fixture data,
 * filling the full content area. This is the MVP hero-only implementation;
 * a full article body would be added below on scroll in a future iteration.
 *
 * Server-safe: no 'use client'. Props: none.
 * Issue #695.
 */

import { championSplashUrl } from "@low/fixtures";

import { LauncherPatchHeroBanner } from "./launcher-patch-hero-banner";

// ---------------------------------------------------------------------------
// Fixture data — Patch 26.15, matching lol-launcher-ref/image-2.png
// ---------------------------------------------------------------------------

// Jinx skin 0: electric blue/pink, high-contrast — replaces the dim Nocturne
// splash for a vivid, energetic patch notes hero that reads well with the
// bottom-up scrim and white text block.
const PATCH_SPLASH_URL = championSplashUrl("Jinx", 0);

/**
 * Patch Notes tab content — full-bleed hero with Patch 26.15 data.
 *
 * Renders inside the center content area of LauncherShell, below LauncherTabBar.
 * Fills remaining height (flex-1 in parent, overflow-hidden).
 */
export function LauncherPatchNotesPage() {
  return (
    <LauncherPatchHeroBanner
      splashUrl={PATCH_SPLASH_URL}
      patchTitle="LEAGUE OF LEGENDS PATCH 26.15 NOTES"
      subtitle="We're kicking off Season 3...but of what year?!"
      categoryChip="Game Updates"
      authors="Riot Cashout, slernied, Riot Yisu"
      date="7/18/2026"
    />
  );
}
