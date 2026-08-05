/**
 * LauncherFeaturedMerchBanner showcase — server-safe (no 'use client').
 * Renders on a dark launcher background to match the real Merch tab context.
 * Issue #692.
 */

import type { ShowcaseEntry } from "../showcase";
import { MERCH_PRODUCTS } from "@low/fixtures";
import { LauncherFeaturedMerchBanner } from "./launcher-featured-merch-banner";

/** MERCH_PRODUCTS[5] = lol-classic-yearbook-tee — matches image-4.png reference. */
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const YEARBOOK_TEE = MERCH_PRODUCTS[5]!;

export const launcherFeaturedMerchBannerShowcase: ShowcaseEntry = {
  slug: "launcher-featured-merch-banner",
  name: "LauncherFeaturedMerchBanner",
  area: "launcher",
  description:
    "Large featured merch product banner for the Launcher Merch tab. Horizontal layout: text left (~45%), lifestyle image right (~55%), dark launcher palette. Issue #692.",
  variants: [
    {
      name: "Yearbook Tee — matches image-4.png ref",
      notes:
        "MERCH_PRODUCTS[5] (lol-classic-yearbook-tee). Category chip, title in display font, description excerpt, lifestyle image with hover scale.",
      render: () => (
        <div
          style={{
            backgroundColor: "var(--color-launcher-bg)",
            padding: "24px 28px",
            maxWidth: 800,
          }}
        >
          <LauncherFeaturedMerchBanner
            product={YEARBOOK_TEE}
            description="Dust off your rune pages with the League of Legends Classic Yearbook — a limited edition tee celebrating the golden era of the Rift."
          />
        </div>
      ),
    },
    {
      name: "First product — Collectors Box",
      notes:
        "MERCH_PRODUCTS[0]. Alternate product to exercise the component with a different image.",
      render: () => (
        <div
          style={{
            backgroundColor: "var(--color-launcher-bg)",
            padding: "24px 28px",
            maxWidth: 800,
          }}
        >
          <LauncherFeaturedMerchBanner
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            product={MERCH_PRODUCTS[0]!}
            description="The ultimate collector's set — commemorative box filled with League of Legends Classic memorabilia."
          />
        </div>
      ),
    },
    {
      name: "Custom category label",
      notes:
        "Category chip can be overridden — here showing 'Limited Edition' instead of the default 'Merch'.",
      render: () => (
        <div
          style={{
            backgroundColor: "var(--color-launcher-bg)",
            padding: "24px 28px",
            maxWidth: 800,
          }}
        >
          <LauncherFeaturedMerchBanner
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            product={MERCH_PRODUCTS[2]!}
            categoryLabel="Limited Edition"
            description="A premium piece from the Limited edition lineup — available for a short time only."
          />
        </div>
      ),
    },
  ],
};
