/**
 * LauncherPatchHeroBanner showcase — server-safe (no 'use client').
 * Issue #745 (fixes #688).
 */

import { championSplashUrl } from "@low/fixtures";
import type { ShowcaseEntry } from "../showcase";
import { LauncherPatchHeroBanner } from "./launcher-patch-hero-banner";

export const launcherPatchHeroBannerShowcase: ShowcaseEntry = {
  slug: "launcher-patch-hero-banner",
  name: "LauncherPatchHeroBanner",
  area: "launcher",
  description:
    "Patch notes hero: bounded ~421px splash over solid launcher-bg band. Heading (~33px, 2-line wrap) + subtitle + thin divider + gold-category byline row. No chip. Issue #745.",
  variants: [
    {
      name: "Patch 26.15 — Nocturne splash (matches ref)",
      notes:
        "Splash bounded to 421px; text in solid black band below. Gold 'Game Updates' in byline with pipe separators. Heading wraps to 2 lines at 33px.",
      render: () => (
        <div
          style={{
            width: 1080,
            height: 720,
            overflow: "hidden",
            backgroundColor: "var(--color-launcher-patch-bg)",
            position: "relative",
          }}
        >
          <LauncherPatchHeroBanner
            splashUrl={championSplashUrl("Nocturne", 0)}
            patchTitle="LEAGUE OF LEGENDS PATCH 26.15 NOTES"
            subtitle="We're kicking off Season 3...but of what year?!"
            category="Game Updates"
            authors="Riot Cashmiir, sternest, Riot Yina"
            date="7/28/2026"
          />
        </div>
      ),
    },
    {
      name: "No byline",
      notes:
        "Authors, date, and category all omitted — byline row hidden. Heading + subtitle + divider still render.",
      render: () => (
        <div
          style={{
            width: 1080,
            height: 720,
            overflow: "hidden",
            backgroundColor: "var(--color-launcher-patch-bg)",
            position: "relative",
          }}
        >
          <LauncherPatchHeroBanner
            splashUrl={championSplashUrl("Nocturne", 0)}
            patchTitle="LEAGUE OF LEGENDS PATCH 26.15 NOTES"
            subtitle="We're kicking off Season 3...but of what year?!"
          />
        </div>
      ),
    },
    {
      name: "Alternative splash — Thresh",
      notes:
        "Swap to Thresh splash to verify bounded image + black text band work against different art.",
      render: () => (
        <div
          style={{
            width: 1080,
            height: 720,
            overflow: "hidden",
            backgroundColor: "var(--color-launcher-patch-bg)",
            position: "relative",
          }}
        >
          <LauncherPatchHeroBanner
            splashUrl={championSplashUrl("Thresh", 0)}
            patchTitle="LEAGUE OF LEGENDS PATCH 26.14 NOTES"
            subtitle="The Chain Warden gets some love in this mid-season update."
            category="Game Updates"
            authors="Riot Cashout"
            date="7/3/2026"
          />
        </div>
      ),
    },
    {
      name: "Category only (no authors / date)",
      notes: "Only category in byline — no pipe separators rendered.",
      render: () => (
        <div
          style={{
            width: 1080,
            height: 720,
            overflow: "hidden",
            backgroundColor: "var(--color-launcher-patch-bg)",
            position: "relative",
          }}
        >
          <LauncherPatchHeroBanner
            splashUrl={championSplashUrl("Ahri", 0)}
            patchTitle="LEAGUE OF LEGENDS PATCH 26.13 NOTES"
            subtitle="Balance adjustments and a new batch of skins arrive."
            category="Game Updates"
          />
        </div>
      ),
    },
  ],
};
