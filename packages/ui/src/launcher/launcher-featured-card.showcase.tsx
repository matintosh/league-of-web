/**
 * LauncherFeaturedCard showcase — server-safe (no 'use client').
 * Renders on a dark background to match how the card looks over the hero scrim.
 */

import type { ShowcaseEntry } from "../showcase";
import { LauncherFeaturedCard } from "./launcher-featured-card";

export const launcherFeaturedCardShowcase: ShowcaseEntry = {
  slug: "launcher-featured-card",
  name: "LauncherFeaturedCard",
  area: "launcher",
  description:
    "Bottom-left overlay card for the Overview hero. Category label (muted) → title (white, display font) → description (muted, line-clamped) → frosted-glass CTA button. Sits on the hero scrim — showcase renders with dark bg to match. Issue #684.",
  variants: [
    {
      name: "Cinematic variant — \"Watch Now\"",
      notes: "Matches the ref: League Classic Cinematic label, 2-line title, body copy, Watch Now CTA.",
      render: () => (
        <div
          style={{
            backgroundColor: "#0a0a0a",
            padding: "32px 28px",
            maxWidth: 460,
          }}
        >
          <LauncherFeaturedCard
            categoryLabel="League Classic Cinematic"
            title="Welcome Back, Summoners"
            description="Time to grab your friends and relive a golden era with League of Legends Classic. Now live."
            ctaLabel="Watch Now"
          />
        </div>
      ),
    },
    {
      name: "News / patch label — \"Read More\"",
      notes: "Alternate category label (patch notes) + longer description tests 3-line clamp.",
      render: () => (
        <div
          style={{
            backgroundColor: "#0a0a0a",
            padding: "32px 28px",
            maxWidth: 460,
          }}
        >
          <LauncherFeaturedCard
            categoryLabel="Game Updates"
            title="Patch 14.24 Notes"
            description="This patch brings balance changes to over 25 champions, reworks to the jungle objective system, and visual updates to Summoner's Rift. Read the full notes to prepare for your next climb."
            ctaLabel="Read More"
          />
        </div>
      ),
    },
    {
      name: "Esports variant — \"Watch Live\"",
      notes: "Esports event label with short description and custom CTA.",
      render: () => (
        <div
          style={{
            backgroundColor: "#0a0a0a",
            padding: "32px 28px",
            maxWidth: 460,
          }}
        >
          <LauncherFeaturedCard
            categoryLabel="Worlds 2025 Finals"
            title="The Grand Finale is Here"
            description="Two of the world's best teams clash for the Summoner's Cup. Watch the final live."
            ctaLabel="Watch Live"
          />
        </div>
      ),
    },
  ],
};
