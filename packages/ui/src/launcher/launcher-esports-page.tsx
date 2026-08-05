/**
 * LauncherEsportsPage — Esports tab content for the /launcher section.
 *
 * Renders an "Esports News" heading followed by a vertical list of
 * LauncherEsportsNewsCard items. Fixture data is hardcoded here
 * (types from @low/fixtures, real champion splash thumbnails via
 * championSplashUrl).
 *
 * This component is NOT a page route — it is the content rendered when the
 * "esports" tab is active inside the launcher client shell.
 *
 * Server-safe: no 'use client'. Props: none (data hardcoded from fixtures).
 * Issue #697.
 */

import { championSplashUrl } from "@low/fixtures";

import { LauncherEsportsNewsCard } from "./launcher-esports-news-card";

// ---------------------------------------------------------------------------
// Fixture data — values hardcoded, types from @low/fixtures
// ---------------------------------------------------------------------------

const ESPORTS_ARTICLES = [
  {
    id: "msi-2026-moments",
    thumbnailUrl: championSplashUrl("Jinx", 0),
    title: "MSI 2026: Moments and Memories",
    description:
      "Relive the electrifying plays, crazy drafts, and iconic moments that led to HLE's victory at MSI 2026.",
  },
  {
    id: "go4lol-league-classic",
    thumbnailUrl: championSplashUrl("Lux", 0),
    title: "Compete in League of Legends Classic with GO4LOL!",
    description:
      "Community tournaments are back. Sign up and compete in League of Legends Classic...",
  },
  {
    id: "t1-worlds-skins",
    thumbnailUrl: championSplashUrl("Ahri", 0),
    title: "T1, The Accessible Worlds 2025 Skins Trailer",
    description:
      "T1 comp revealed again. T1 competed again. Most T1 Worlds Championship...",
  },
  {
    id: "t1-worlds-behind-scenes",
    thumbnailUrl: championSplashUrl("Ahri", 0),
    title: "Behind-the-Scenes: T1 Worlds 2025",
    description:
      "Discover the stories behind the creation of the T1 2025 skins...",
  },
] as const;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/** LauncherEsportsPage — no configurable props; data is fixture-hardcoded. */
export function LauncherEsportsPage() {
  return (
    <div
      style={{
        height: "100%",
        backgroundColor: "var(--color-launcher-bg)",
        padding: "24px 28px",
        overflowY: "auto",
      }}
    >
      {/* "Esports News" heading */}
      <h2
        style={{
          margin: 0,
          marginBottom: 16,
          fontSize: 18,
          fontWeight: 700,
          color: "var(--color-launcher-esports-heading)",
          fontFamily: "var(--font-display)",
        }}
      >
        Esports News
      </h2>

      {/* News card list — vertical, hairline-separated via card bottom borders */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {ESPORTS_ARTICLES.map((article) => (
          <LauncherEsportsNewsCard
            key={article.id}
            id={article.id}
            thumbnailUrl={article.thumbnailUrl}
            title={article.title}
            description={article.description}
          />
        ))}
      </div>
    </div>
  );
}
