/**
 * LauncherMerchPage showcase — server-safe (no 'use client').
 * Renders the full Merch tab composition at 1080×660 to match the launcher ref.
 * Issue #698.
 */

import type { ShowcaseEntry } from "../showcase";
import { LauncherMerchPage } from "./launcher-merch-page";

export const launcherMerchPageShowcase: ShowcaseEntry = {
  slug: "launcher-merch-page",
  name: "LauncherMerchPage",
  area: "launcher",
  description:
    "Full Merch tab content for the launcher: 'Merch' heading + LauncherFeaturedMerchBanner (yearbook tee) + 4-card MerchProductCard row. Dark launcher palette; white product cards match image-4.png ref. Issue #698.",
  variants: [
    {
      name: "Default — matches image-4.png",
      notes:
        "1080×660 viewport. Shows 'Merch' heading, featured yearbook tee banner, and the 4-product row (Collectors Box, Ring, Twitch Statue, Amumu Plush).",
      render: () => (
        <div
          style={{
            width: 1080,
            height: 660,
            overflow: "hidden",
            backgroundColor: "var(--color-launcher-bg)",
          }}
        >
          <LauncherMerchPage />
        </div>
      ),
    },
    {
      name: "Narrower panel — 720px",
      notes:
        "Exercises the horizontal scroll on the product row when the panel is narrower.",
      render: () => (
        <div
          style={{
            width: 720,
            height: 560,
            overflow: "hidden",
            backgroundColor: "var(--color-launcher-bg)",
          }}
        >
          <LauncherMerchPage />
        </div>
      ),
    },
  ],
};
