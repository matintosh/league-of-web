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
  /**
   * Optional ReactNode logo for the featured promo — passed as `logoNode` to
   * FeaturedGamePromoHero, overriding the string `gameLogo`. Use this to supply
   * an inline SVG component (e.g. LolClassicLogo) instead of a data-URI image.
   */
  featuredPromoLogoNode?: ReactNode;
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
 *   - Left rail: 64 px fixed, full-height, `--color-launcher-rail-bg`
 *   - Content area: flex-1, dark bg, scrollable
 *     - "Home" heading overlaid on hero scrim at top≈26px, left≈85px
 *     - FeaturedGamePromoHero fills content width (flex:1)
 *     - "Latest Patch Notes" heading below hero
 *     - Horizontal scrolling row of PatchNoteCards
 */
export function LauncherRiotHomePage({
  featuredPromo,
  featuredPromoLogoNode,
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
      {/* Left icon rail — 64 px fixed (matches LauncherShell and ref x≈64@1280) */}
      <aside
        style={{
          width: 64,
          flexShrink: 0,
          height: "100%",
          backgroundColor: "var(--color-launcher-rail-bg)",
          overflow: "hidden",
        }}
      >
        {nav}
      </aside>

      {/* Main content area — flex-1, scrollable — dark surface per image-5.png ref */}
      <main
        style={{
          flex: 1,
          minWidth: 0,
          height: "100%",
          overflowY: "auto",
          overflowX: "hidden",
          backgroundColor: "var(--color-launcher-home-content-bg)",
          display: "flex",
          flexDirection: "column",
          gap: 0,
        }}
      >
        {/* Featured promo hero — full-bleed, flex:1 to fill available height.
            "Home" heading overlaid on hero scrim at top:26px left:85px
            (64px rail + 85px gutter = x≈149@1280, matching image-5.png ref). */}
        <FeaturedGamePromoHero
          {...featuredPromo}
          logoNode={featuredPromoLogoNode}
          onCta={onPromoCtaClick}
          headingNode={
            <h1
              style={{
                fontFamily: "var(--font-display, var(--font-launcher))",
                fontSize: 22,
                fontWeight: 700,
                lineHeight: 1,
                color: "var(--color-launcher-home-content-ink)",
                margin: 0,
              }}
            >
              Home
            </h1>
          }
        />

        {/* Latest Patch Notes section — left gutter 85px to match Home title x≈149@1280 (64px rail + 85px) */}
        <section
          aria-label="Latest Patch Notes"
          style={{
            padding: "20px 24px 32px 85px",
            backgroundColor: "var(--color-launcher-patch-notes-bg)",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display, var(--font-launcher))",
              fontSize: 20,
              fontWeight: 700,
              color: "var(--color-launcher-home-content-ink)",
              margin: "0 0 14px 0",
              letterSpacing: "0.01em",
            }}
          >
            Latest Patch Notes
          </h2>

          {/* Horizontal scrollable card row — clips at viewport bottom as in ref */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 14,
              overflowX: "auto",
              overflowY: "visible",
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
