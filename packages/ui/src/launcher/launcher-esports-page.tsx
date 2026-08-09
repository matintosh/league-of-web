/**
 * LauncherEsportsPage — Esports tab content for the /launcher section.
 *
 * Renders an "Esports News" heading followed by a MAGAZINE CARD GRID matching
 * lol-launcher-ref/image-3.png: one large portrait featured card on the left
 * and a right column with 2 (or more) smaller stacked cards.
 *
 * This component is NOT a page route — it is the content rendered when the
 * "esports" tab is active inside the launcher client shell.
 *
 * Server-safe: no 'use client'. Props: none (data hardcoded from fixtures).
 * Issue #697, #950, #951.
 */

import { championSplashUrl } from "@low/fixtures";

import { LauncherEsportsNewsCard } from "./launcher-esports-news-card";

// ---------------------------------------------------------------------------
// Fixture data — values hardcoded, types from @low/fixtures
// ---------------------------------------------------------------------------

/** Featured article — rendered as the large portrait card on the left. */
const FEATURED_ARTICLE = {
  id: "msi-2026-moments",
  thumbnailUrl: championSplashUrl("Jinx", 0),
  title: "MSI 2026: Moments and Memories",
  description:
    "Relive the electrifying plays, crazy drafts, and iconic moments that led to HLE's victory at MSI 2026.",
} as const;

/** Secondary articles — rendered as smaller cards in the right column.
 *  Each article includes `category` and `duration` for thumbnail badge overlays
 *  matching the reference (issues #950, #951). */
const SECONDARY_ARTICLES = [
  {
    id: "go4lol-league-classic",
    thumbnailUrl: championSplashUrl("Lux", 0),
    title: "Compete in League of Legends Classic with GO4LOL!",
    description:
      "Community tournaments are back. Sign up and compete in League of Legends Classic...",
    category: "ESPORTS",
    duration: "18:50",
  },
  {
    id: "t1-worlds-skins",
    thumbnailUrl: championSplashUrl("Ahri", 0),
    title: "T1, The Accessible Worlds 2025 Skins Trailer",
    description:
      "T1 comp revealed again. T1 competed again. Most T1 Worlds Championship...",
    category: "ESPORTS",
    duration: "01:52",
  },
  {
    id: "t1-worlds-behind-scenes",
    thumbnailUrl: championSplashUrl("Ahri", 0),
    title: "Behind-the-Scenes: T1 Worlds 2025",
    description:
      "Discover the stories behind the creation of the T1 2025 skins...",
    category: "ESPORTS",
    duration: "07:25",
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
        boxSizing: "border-box",
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

      {/* Magazine grid — featured large card left + right column of smaller cards.
          Ref (÷1.2): featured left edge ~x123, width ~288; right column ~323.
          ~0.9fr/1fr + paddingLeft on featured card for the ~45px inset. */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "0.9fr 1fr",
          gap: 12,
          height: "calc(100% - 56px)",
          minHeight: 0,
        }}
      >
        {/* Left: large portrait featured card — inset from the left to match ref */}
        <div style={{ paddingLeft: 45, minWidth: 0, height: "100%" }}>
        <LauncherEsportsNewsCard
          key={FEATURED_ARTICLE.id}
          id={FEATURED_ARTICLE.id}
          thumbnailUrl={FEATURED_ARTICLE.thumbnailUrl}
          title={FEATURED_ARTICLE.title}
          description={FEATURED_ARTICLE.description}
          size="lg"
        />
        </div>

        {/* Right: column of smaller cards — height:100% + flex column so that
            each card's flex:1 distributes the available height evenly. Issue #950. */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            height: "100%",
            overflow: "hidden",
          }}
        >
          {SECONDARY_ARTICLES.map((article) => (
            <LauncherEsportsNewsCard
              key={article.id}
              id={article.id}
              thumbnailUrl={article.thumbnailUrl}
              title={article.title}
              description={article.description}
              size="sm"
              category={article.category}
              duration={article.duration}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
