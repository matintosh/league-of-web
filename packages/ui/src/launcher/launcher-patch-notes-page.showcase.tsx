/**
 * LauncherPatchNotesPage showcase — server-safe (no 'use client').
 * Issue #695.
 */

import type { ShowcaseEntry } from "../showcase";
import { LauncherPatchNotesPage } from "./launcher-patch-notes-page";

export const launcherPatchNotesPageShowcase: ShowcaseEntry = {
  slug: "launcher-patch-notes-page",
  name: "LauncherPatchNotesPage",
  area: "launcher",
  description:
    "Patch Notes tab content: full-bleed Nocturne splash hero with Patch 26.15 title, subtitle, gold chip, and byline. Composed from LauncherPatchHeroBanner. Issue #695.",
  variants: [
    {
      name: "Patch Notes composition (1080×660)",
      notes:
        "Full Patch Notes page at approximate launcher content area dimensions. Nocturne splash, Patch 26.15 fixture data, centered text block with byline.",
      render: () => (
        <div
          style={{
            width: 1080,
            height: 660,
            overflow: "hidden",
            backgroundColor: "var(--color-launcher-patch-bg)",
            position: "relative",
          }}
        >
          <LauncherPatchNotesPage />
        </div>
      ),
    },
  ],
};
