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
      {/* Page heading — ref shows ~24px mixed-case Beaufort, not all-caps (#3b) */}
      <div className="px-6 pt-8 pb-2">
        <h1
          className="font-display text-2xl tracking-wide"
          style={{
            color: "var(--color-universe-story-ink)",
            fontWeight: 700,
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
