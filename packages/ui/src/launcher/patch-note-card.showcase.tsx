/**
 * Showcase entry for PatchNoteCard.
 *
 * Server-safe — no 'use client'. Stateful click handler in
 * patch-note-card.demo.tsx.
 *
 * Four variants: VALORANT (ref match), LoL, TFT, long-title truncation test.
 */

import type { ShowcaseEntry } from "../showcase";
import { championSplashUrl } from "@low/fixtures";
import { PatchNoteCard } from "./patch-note-card";

// ---------------------------------------------------------------------------
// Inline SVG game logos (white, overlaid on dark thumbnail)
// ---------------------------------------------------------------------------

const VALORANT_LOGO = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 30" fill="none">
  <text x="2" y="24" font-family="Impact,Arial Black,sans-serif" font-size="22" font-weight="900" fill="%23ffffff" letter-spacing="-0.5">VALORANT</text>
</svg>
`)}`;

const LOL_LOGO = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 30" fill="none">
  <text x="2" y="22" font-family="Georgia,serif" font-size="11" font-weight="700" fill="%23ffffff" letter-spacing="1">LEAGUE OF LEGENDS</text>
</svg>
`)}`;

const TFT_LOGO = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" fill="none">
  <text x="2" y="24" font-family="Impact,Arial Black,sans-serif" font-size="24" font-weight="900" fill="%23ffffff" letter-spacing="1">TFT</text>
</svg>
`)}`;

export const patchNoteCardShowcase: ShowcaseEntry = {
  slug: "patch-note-card",
  name: "PatchNoteCard",
  area: "launcher",
  description:
    "Cross-game patch note card used in the 'Latest Patch Notes' horizontal row on the Riot launcher Home. 220×140 px, thumbnail + logo + title + meta. Issue #682.",
  variants: [
    {
      name: "VALORANT Patch Notes 13.02 (ref match)",
      notes:
        "Matches the ref image-5.png card. VALORANT branding, champion splash as placeholder thumbnail.",
      render: () => (
        <div
          style={{
            backgroundColor: "var(--color-launcher-bg)",
            padding: 16,
            display: "inline-flex",
          }}
        >
          <PatchNoteCard
            id="val-patch-13-02"
            gameKey="valorant"
            gameName="VALORANT"
            gameLogo={VALORANT_LOGO}
            title="VALORANT Patch Notes 13.02"
            thumbUrl={championSplashUrl("Jinx", 0)}
            publishedAt="2026-07-02T00:00:00Z"
            href="/patch-notes/valorant-13-02"
          />
        </div>
      ),
    },
    {
      name: "League of Legends patch note",
      notes: "LoL branding, Warwick splash thumbnail.",
      render: () => (
        <div
          style={{
            backgroundColor: "var(--color-launcher-bg)",
            padding: 16,
            display: "inline-flex",
          }}
        >
          <PatchNoteCard
            id="lol-patch-25-14"
            gameKey="lol"
            gameName="League of Legends"
            gameLogo={LOL_LOGO}
            title="League of Legends Patch 25.14"
            thumbUrl={championSplashUrl("Warwick", 1)}
            publishedAt="2026-07-16T00:00:00Z"
            href="/patch-notes/lol-25-14"
          />
        </div>
      ),
    },
    {
      name: "TFT patch note",
      notes: "TFT branding, Lissandra splash thumbnail.",
      render: () => (
        <div
          style={{
            backgroundColor: "var(--color-launcher-bg)",
            padding: 16,
            display: "inline-flex",
          }}
        >
          <PatchNoteCard
            id="tft-patch-14-2"
            gameKey="tft"
            gameName="TFT"
            gameLogo={TFT_LOGO}
            title="TFT Patch Notes 14.2"
            thumbUrl={championSplashUrl("Lissandra", 0)}
            publishedAt="2026-07-16T00:00:00Z"
            href="/patch-notes/tft-14-2"
          />
        </div>
      ),
    },
    {
      name: "Long title — truncation test",
      notes:
        "Title exceeds 2 lines; should ellipsis-clip at the card boundary.",
      render: () => (
        <div
          style={{
            backgroundColor: "var(--color-launcher-bg)",
            padding: 16,
            display: "inline-flex",
          }}
        >
          <PatchNoteCard
            id="long-title-test"
            gameKey="valorant"
            gameName="VALORANT"
            gameLogo={VALORANT_LOGO}
            title="VALORANT Patch Notes 13.02 — Massive Balance Overhaul Affecting All Agents And Every Map In The Rotation"
            thumbUrl={championSplashUrl("Ahri", 0)}
            publishedAt="2026-07-02T00:00:00Z"
            href="/patch-notes/long-title"
          />
        </div>
      ),
    },
  ],
};
