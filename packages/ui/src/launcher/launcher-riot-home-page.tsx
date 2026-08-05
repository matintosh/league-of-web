/**
 * LauncherRiotHomePage — Riot multi-game launcher Home page content.
 *
 * Renders:
 *   1. "Home" heading
 *   2. <FeaturedGamePromoHero> — big promotional hero banner
 *   3. "Latest Patch Notes" heading + horizontal scrollable row of <PatchNoteCard>s
 *
 * This component is the CONTENT of the Riot Home surface; it does not include
 * the left rail or window bar — those are injected by the page via the `nav`
 * slot and the layout shell. Route: /launcher/home.
 *
 * Presentational: no data fetching. Types from @low/fixtures; values supplied
 * by the page. Token-only colors. Server-safe.
 *
 * Closes #678.
 */

import type { ReactNode } from "react";
import type { FeaturedPromoData, PatchNoteData } from "@low/fixtures";
import { FeaturedGamePromoHero } from "./featured-game-promo-hero";
import { PatchNoteCard } from "./patch-note-card";

export interface LauncherRiotHomePageProps {
  /** Featured promo data rendered by <FeaturedGamePromoHero>. */
  featuredPromo: FeaturedPromoData;
  /** Called when the featured promo CTA is clicked. */
  onPromoCtaClick?: () => void;
  /** List of patch note cards rendered by <PatchNoteCard>. */
  patchNotes: PatchNoteData[];
  /** Called when a patch note card is clicked (receives card id). */
  onPatchNoteClick?: (id: string) => void;
  /** Left-rail slot (LauncherRail injected by the page). */
  nav: ReactNode;
}

/**
 * Full Riot Home surface: rail + content area.
 *
 * Layout per image-5.png:
 *   - Left rail: 56 px fixed, full-height, `--color-launcher-rail-bg`
 *   - Content area: flex-1, dark bg, scrollable, padded
 *     - "Home" heading, ~22 px, top-left
 *     - FeaturedGamePromoHero fills content width
 *     - "Latest Patch Notes" heading below hero
 *     - Horizontal scrolling row of PatchNoteCards
 */
export function LauncherRiotHomePage({
  featuredPromo,
  onPromoCtaClick,
  patchNotes,
  onPatchNoteClick,
  nav,
}: LauncherRiotHomePageProps) {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        minHeight: 0,
        backgroundColor: "var(--color-launcher-bg)",
        overflow: "hidden",
      }}
    >
      {/* Left icon rail — 56 px fixed */}
      <aside
        style={{
          width: 56,
          flexShrink: 0,
          height: "100%",
          backgroundColor: "var(--color-launcher-rail-bg)",
          overflow: "hidden",
        }}
      >
        {nav}
      </aside>

      {/* Main content area — flex-1, scrollable */}
      <main
        style={{
          flex: 1,
          minWidth: 0,
          height: "100%",
          overflowY: "auto",
          overflowX: "hidden",
          backgroundColor: "var(--color-launcher-content-bg)",
          padding: "24px 24px 32px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {/* "Home" page heading */}
        <h1
          style={{
            fontFamily: "var(--font-display, var(--font-launcher))",
            fontSize: 22,
            fontWeight: 700,
            lineHeight: 1,
            color: "var(--color-launcher-text-primary)",
            margin: 0,
          }}
        >
          Home
        </h1>

        {/* Featured promo hero */}
        <FeaturedGamePromoHero
          {...featuredPromo}
          onCta={onPromoCtaClick}
        />

        {/* Latest Patch Notes section */}
        <section aria-label="Latest Patch Notes">
          <h2
            style={{
              fontFamily: "var(--font-display, var(--font-launcher))",
              fontSize: 14,
              fontWeight: 600,
              color: "var(--color-launcher-text-primary)",
              margin: "0 0 12px 0",
              letterSpacing: "0.02em",
            }}
          >
            Latest Patch Notes
          </h2>

          {/* Horizontal scrollable card row */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 16,
              overflowX: "auto",
              overflowY: "hidden",
              paddingBottom: 8,
              /* custom scrollbar thinning */
              scrollbarWidth: "thin",
              scrollbarColor: "var(--color-launcher-border) transparent",
            }}
          >
            {patchNotes.map((note) => (
              <PatchNoteCard
                key={note.id}
                {...note}
                onClick={onPatchNoteClick}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
