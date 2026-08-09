/**
 * LauncherMerchProductTile showcase — server-safe (no 'use client').
 * Compact dark product tile for the Launcher Merch tab. Issue #954.
 *
 * Stateful demos belong in launcher-merch-product-tile.demo.tsx.
 */

import { MERCH_PRODUCTS } from "@low/fixtures";
import type { ShowcaseEntry } from "../showcase";
import { LauncherMerchProductTile } from "./launcher-merch-product-tile";

// Safe non-null assertions — MERCH_PRODUCTS indices are stable fixture values.
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const YEARBOOK_TEE = MERCH_PRODUCTS[2]!;
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const AMUMU_PLUSH = MERCH_PRODUCTS[5]!;
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const COLLECTORS_BOX = MERCH_PRODUCTS[0]!;
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const TWITCH_STATUE = MERCH_PRODUCTS[1]!;
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const ROCKLOVE_RING = MERCH_PRODUCTS[3]!;

export const launcherMerchProductTileShowcase: ShowcaseEntry = {
  slug: "launcher-merch-product-tile",
  name: "LauncherMerchProductTile",
  area: "launcher",
  referenceImage: "launcher-merch.png",
  referenceNote: "Real League launcher — Merch tab product tile row (image-4.png)",
  description:
    "Compact dark product tile for the Launcher Merch tab. No franchise header, no badge chips, no heart icon, no Add-to-Cart strip. Dark bg + light info strip with title + price. Issue #954.",
  variants: [
    {
      name: "Single tile — dark bg context",
      notes:
        "Single LauncherMerchProductTile at ~183px width on dark launcher bg. Shows image (100px) + info strip (title 13px/600 + price 12px/400).",
      render: () => (
        <div
          style={{
            padding: 24,
            backgroundColor: "var(--color-launcher-content-bg)",
            display: "flex",
            gap: 16,
          }}
        >
          <div style={{ width: 183 }}>
            <LauncherMerchProductTile
              slug={YEARBOOK_TEE.slug}
              title={YEARBOOK_TEE.title}
              imageUrl={YEARBOOK_TEE.imageUrl}
              price={YEARBOOK_TEE.price}
              originalPrice={YEARBOOK_TEE.originalPrice}
            />
          </div>
        </div>
      ),
    },
    {
      name: "4-tile row — as used in LauncherMerchPage",
      notes:
        "Four tiles in a flex row at ~951px content width, gap 16px — matches the product row in image-4.png. Dark compact tiles; no white card background.",
      render: () => (
        <div
          style={{
            width: 951,
            padding: "16px 82px",
            backgroundColor: "var(--color-launcher-content-bg)",
            display: "flex",
            gap: 16,
          }}
        >
          {[COLLECTORS_BOX, TWITCH_STATUE, ROCKLOVE_RING, AMUMU_PLUSH].map((product) => (
            <div key={product.slug} style={{ flex: 1, minWidth: 0 }}>
              <LauncherMerchProductTile
                slug={product.slug}
                title={product.title}
                imageUrl={product.imageUrl}
                price={product.price}
                originalPrice={product.originalPrice}
              />
            </div>
          ))}
        </div>
      ),
    },
    {
      name: "With sale price — originalPrice shown struck-through",
      notes:
        "Tile with both price and originalPrice to verify the sale price display (struck-through, muted).",
      render: () => (
        <div
          style={{
            padding: 24,
            backgroundColor: "var(--color-launcher-content-bg)",
            display: "flex",
          }}
        >
          <div style={{ width: 183 }}>
            <LauncherMerchProductTile
              slug={AMUMU_PLUSH.slug}
              title={AMUMU_PLUSH.title}
              imageUrl={AMUMU_PLUSH.imageUrl}
              price={AMUMU_PLUSH.price}
              originalPrice="$34.99"
            />
          </div>
        </div>
      ),
    },
  ],
};
