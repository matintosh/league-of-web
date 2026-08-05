/**
 * Showcase entry for LauncherEsportsPage.
 *
 * Server-safe — no 'use client'. Renders the Esports tab composition at a
 * fixed 1080×660 container matching the center content area at a ~1536px
 * viewport.
 * Issue #697.
 */

import type { ShowcaseEntry } from "../showcase";
import { LauncherEsportsPage } from "./launcher-esports-page";
import { LauncherEsportsNewsCard } from "./launcher-esports-news-card";
import { championSplashUrl } from "@low/fixtures";

export const launcherEsportsPageShowcase: ShowcaseEntry = {
  slug: "launcher-esports-page",
  name: "LauncherEsportsPage",
  area: "launcher",
  description:
    "Esports tab content: 'Esports News' heading + magazine grid — 1 large featured portrait card left, right column of 3 smaller cards. Issue #697.",
  variants: [
    {
      name: "Esports magazine grid (1080×660)",
      notes:
        "Full Esports tab at approximate launcher content area dimensions. Magazine layout: featured large portrait card (Jinx) left + 3 smaller cards (Lux, Ahri) right.",
      render: () => (
        <div
          style={{
            width: 1080,
            height: 660,
            overflow: "hidden",
            backgroundColor: "var(--color-launcher-bg)",
            position: "relative",
          }}
        >
          <LauncherEsportsPage />
        </div>
      ),
    },
    {
      name: "LauncherEsportsNewsCard — lg (portrait featured)",
      notes:
        "Large portrait card: full-bleed image top ~60%, title + description below. Used as the left/hero slot in the magazine grid.",
      render: () => (
        <div
          style={{
            width: 360,
            height: 440,
            backgroundColor: "var(--color-launcher-bg)",
            padding: 12,
            boxSizing: "border-box",
          }}
        >
          <LauncherEsportsNewsCard
            id="featured"
            thumbnailUrl={championSplashUrl("Jinx", 0)}
            title="MSI 2026: Moments and Memories"
            description="Relive the electrifying plays, crazy drafts, and iconic moments that led to HLE's victory at MSI 2026."
            size="lg"
          />
        </div>
      ),
    },
    {
      name: "LauncherEsportsNewsCard — sm (compact horizontal)",
      notes:
        "Compact horizontal card: thumbnail left ~38%, text right. Used in the right column of the magazine grid.",
      render: () => (
        <div
          style={{
            width: 480,
            backgroundColor: "var(--color-launcher-bg)",
            padding: 12,
            boxSizing: "border-box",
          }}
        >
          <LauncherEsportsNewsCard
            id="compact"
            thumbnailUrl={championSplashUrl("Lux", 0)}
            title="Compete in League of Legends Classic with GO4LOL!"
            description="Community tournaments are back. Sign up and compete in League of Legends Classic..."
            size="sm"
          />
        </div>
      ),
    },
  ],
};
