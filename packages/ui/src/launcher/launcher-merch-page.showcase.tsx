/**
 * LauncherMerchPage showcase — server-safe (no 'use client').
 * Renders the full Merch tab composition at 951×652 — real launcher content area
 * (1280 total − 64px rail − 265px social panel = 951px). Issues #698 #953 #954.
 */

import type { ShowcaseEntry } from "../showcase";
import { LauncherMerchPage } from "./launcher-merch-page";

export const launcherMerchPageShowcase: ShowcaseEntry = {
  slug: "launcher-merch-page",
  name: "LauncherMerchPage",
  area: "launcher",
  referenceImage: "launcher-merch.png",
  referenceNote: "Real League launcher — Merch tab (featured banner + 4-product dark tile row)",
  description:
    "Full Merch tab content for the launcher: 'Merch' heading + LauncherFeaturedMerchBanner (yearbook tee, MERCH_PRODUCTS[2]) + 4-card LauncherMerchProductTile row (compact dark tiles). Issues #698 #953 #954.",
  variants: [
    {
      name: "Default — matches image-4.png",
      notes:
        "951×652 viewport (real content area: 1280−64 rail−265 social). Shows 'Merch' heading, featured yearbook tee banner (261px tall), 82px left padding, and the 4 dark compact product tiles (Collectors Box, Twitch Statue, RockLove Ring, Amumu Plush).",
      render: () => (
        <div
          style={{
            width: 951,
            height: 652,
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
