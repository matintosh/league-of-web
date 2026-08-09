/**
 * Showcase entry for LauncherEsportsNewsCard.
 *
 * Server-safe — no 'use client'. No onClick props are passed here (functions
 * cannot be serialized in server renders); click interaction is demonstrated
 * via the card's hover state only. Stateful click demos belong in a
 * *.demo.tsx client component.
 * Issue #691.
 */

import type { ShowcaseEntry } from "../showcase";
import { LauncherEsportsNewsCard } from "./launcher-esports-news-card";

/** Approximate launcher content column width. */
const CARD_WIDTH = 640;

export const launcherEsportsNewsCardShowcase: ShowcaseEntry = {
  slug: "launcher-esports-news-card",
  name: "LauncherEsportsNewsCard",
  area: "launcher",
  description:
    "Horizontal article card for the Esports tab: thumbnail (left, 16/9, object-cover) + title (2-line clamp) + description (3-line clamp). Issue #691.",
  variants: [
    {
      name: "MSI 2026 — first card",
      notes:
        "Primary card matching the top entry in image-3.png. Thumbnail uses Jinx splash (placeholder for esports thumbnail).",
      render: () => (
        <div style={{ width: CARD_WIDTH, backgroundColor: "var(--color-launcher-bg)" }}>
          <LauncherEsportsNewsCard
            id="msi-2026-moments"
            thumbnailUrl="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Jinx_0.jpg"
            title="MSI 2026: Moments and Memories"
            description="Relive the electrifying plays, crazy drafts, and iconic moments that led to HLE's victory at MSI 2026."
          />
        </div>
      ),
    },
    {
      name: "GO4LOL — second card",
      notes: "Community tournaments card using Lux splash.",
      render: () => (
        <div style={{ width: CARD_WIDTH, backgroundColor: "var(--color-launcher-bg)" }}>
          <LauncherEsportsNewsCard
            id="go4lol-league-classic"
            thumbnailUrl="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Lux_0.jpg"
            title="Compete in League of Legends Classic with GO4LOL!"
            description="Community tournaments are back. Sign up and compete in League of Legends Classic..."
          />
        </div>
      ),
    },
    {
      name: "4-card stack (full list)",
      notes:
        "Full 4-card vertical list matching the Esports tab ref (image-3.png). Cards separated by hairline borders.",
      render: () => (
        <div style={{ width: CARD_WIDTH, backgroundColor: "var(--color-launcher-bg)" }}>
          <LauncherEsportsNewsCard
            id="msi-2026-moments"
            thumbnailUrl="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Jinx_0.jpg"
            title="MSI 2026: Moments and Memories"
            description="Relive the electrifying plays, crazy drafts, and iconic moments that led to HLE's victory at MSI 2026."
          />
          <LauncherEsportsNewsCard
            id="go4lol-league-classic"
            thumbnailUrl="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Lux_0.jpg"
            title="Compete in League of Legends Classic with GO4LOL!"
            description="Community tournaments are back. Sign up and compete in League of Legends Classic..."
          />
          <LauncherEsportsNewsCard
            id="t1-worlds-skins"
            thumbnailUrl="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ahri_0.jpg"
            title="T1, The Accessible Worlds 2025 Skins Trailer"
            description="T1 comp revealed again. T1 competed again. Most T1 Worlds Championship..."
          />
          <LauncherEsportsNewsCard
            id="t1-worlds-behind-scenes"
            thumbnailUrl="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ahri_0.jpg"
            title="Behind-the-Scenes: T1 Worlds 2025"
            description="Discover the stories behind the creation of the T1 2025 skins..."
          />
        </div>
      ),
    },
    {
      name: "Long title — clamp check",
      notes:
        "Title exceeds 2 lines; description exceeds 3 lines. Verifies -webkit-line-clamp truncation.",
      render: () => (
        <div style={{ width: CARD_WIDTH, backgroundColor: "var(--color-launcher-bg)" }}>
          <LauncherEsportsNewsCard
            id="clamp-test"
            thumbnailUrl="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Thresh_0.jpg"
            title="A Very Long Esports Article Title That Should Definitely Clamp at Two Lines Without Overflow"
            description="This description is intentionally extremely long to verify that the three-line clamp is applied correctly and that text truncates cleanly with an ellipsis instead of overflowing the card boundaries and breaking the layout in any way shape or form."
          />
        </div>
      ),
    },
    {
      name: "Thumbnail badges — category + duration (issues #951)",
      notes:
        "Three sm cards with category pill (top-right) and duration badge (bottom-left) on each thumbnail, matching image-3.png reference. Cards use flex:1 so they fill the column height. Issue #950, #951.",
      render: () => (
        <div
          style={{
            width: CARD_WIDTH,
            height: 570,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            backgroundColor: "var(--color-launcher-bg)",
          }}
        >
          <LauncherEsportsNewsCard
            id="go4lol-badge-demo"
            thumbnailUrl="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Lux_0.jpg"
            title="Compete in League of Legends Classic with GO4LOL!"
            description="Community tournaments are back. Sign up and compete in League of Legends Classic..."
            category="ESPORTS"
            duration="18:50"
          />
          <LauncherEsportsNewsCard
            id="t1-skins-badge-demo"
            thumbnailUrl="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ahri_0.jpg"
            title="T1, The Accessible Worlds 2025 Skins Trailer"
            description="T1 comp revealed again. T1 competed again. Most T1 Worlds Championship..."
            category="ESPORTS"
            duration="01:52"
          />
          <LauncherEsportsNewsCard
            id="t1-behind-badge-demo"
            thumbnailUrl="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ahri_0.jpg"
            title="Behind-the-Scenes: T1 Worlds 2025"
            description="Discover the stories behind the creation of the T1 2025 skins..."
            category="ESPORTS"
            duration="07:25"
          />
        </div>
      ),
    },
  ],
};
