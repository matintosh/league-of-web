/**
 * /universe/explore — Universe Explore page.
 *
 * Ref: docs/reference/universe-explore.png
 *
 * Composition:
 *   - Page heading "Explore Universe" (font-display, gold-1)
 *   - UniverseFilterTabs (Everything / Short Stories / Comics / Videos / Music + SORT BY)
 *   - 4-column UniverseStoryCard grid
 *
 * Server component — filter state lives in ExploreClient ('use client').
 */

import { ExploreClient } from "./explore-client";

export default function ExplorePage() {
  return (
    <div style={{ backgroundColor: "var(--color-universe-bg)" }}>
      {/* Page heading */}
      <div className="mx-auto max-w-6xl px-6 pt-8 pb-2">
        <h1
          className="font-display text-5xl uppercase tracking-wide"
          style={{
            color: "var(--color-universe-story-ink)",
            fontWeight: 700,
            letterSpacing: "0.06em",
          }}
        >
          Explore Universe
        </h1>
      </div>

      {/* Interactive filter + grid */}
      <ExploreClient />
    </div>
  );
}
