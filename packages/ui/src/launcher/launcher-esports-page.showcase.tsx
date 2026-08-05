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

export const launcherEsportsPageShowcase: ShowcaseEntry = {
  slug: "launcher-esports-page",
  name: "LauncherEsportsPage",
  area: "launcher",
  description:
    "Esports tab content: 'Esports News' heading + 4 vertical LauncherEsportsNewsCard items with champion splash thumbnails. Issue #697.",
  variants: [
    {
      name: "Esports composition (1080×660)",
      notes:
        "Full Esports tab at approximate launcher content area dimensions. 4 news cards with Jinx, Lux, Ahri splashes as thumbnail placeholders.",
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
  ],
};
