/**
 * LauncherPatchHeroBanner showcase — server-safe (no 'use client').
 * Issue #688.
 */

import { championSplashUrl } from "@low/fixtures";
import type { ShowcaseEntry } from "../showcase";
import { LauncherPatchHeroBanner } from "./launcher-patch-hero-banner";

export const launcherPatchHeroBannerShowcase: ShowcaseEntry = {
  slug: "launcher-patch-hero-banner",
  name: "LauncherPatchHeroBanner",
  area: "launcher",
  description:
    "Full-bleed patch notes hero: champion splash + bottom scrim + centered text block (chip, title, subtitle, byline). Used in the Patch Notes tab. Issue #688.",
  variants: [
    {
      name: "Patch 26.15 — Nocturne splash (matches ref)",
      notes:
        "Dark Nocturne splash; heavy bottom scrim makes the centered text block legible. Gold chip above title, byline below subtitle.",
      render: () => (
        <div
          style={{
            width: 1080,
            height: 660,
            overflow: "hidden",
            backgroundColor: "var(--color-launcher-patch-bg)",
            position: "relative",
          }}
        >
          <LauncherPatchHeroBanner
            splashUrl={championSplashUrl("Nocturne", 0)}
            patchTitle="LEAGUE OF LEGENDS PATCH 26.15 NOTES"
            subtitle="We're kicking off Season 3...but of what year?!"
            categoryChip="Game Updates"
            authors="Riot Cashout, slernied, Riot Yisu"
            date="7/18/2026"
          />
        </div>
      ),
    },
    {
      name: "No byline",
      notes:
        "Authors and date omitted — byline line hidden, chip + title + subtitle still render correctly.",
      render: () => (
        <div
          style={{
            width: 1080,
            height: 660,
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
        "Swap to Thresh splash to verify object-cover + scrim work against different art compositions.",
      render: () => (
        <div
          style={{
            width: 1080,
            height: 660,
            overflow: "hidden",
            backgroundColor: "var(--color-launcher-patch-bg)",
            position: "relative",
          }}
        >
          <LauncherPatchHeroBanner
            splashUrl={championSplashUrl("Thresh", 0)}
            patchTitle="LEAGUE OF LEGENDS PATCH 26.14 NOTES"
            subtitle="The Chain Warden gets some love in this mid-season update."
            categoryChip="Game Updates"
            authors="Riot Cashout"
            date="7/3/2026"
          />
        </div>
      ),
    },
  ],
};
