/**
 * Showcase for MerchSizeGuideModal — server-safe (NO 'use client').
 * Stateful interactions (open/close, unit toggle) live in merch-size-guide-modal.demo.tsx.
 */

import type { ShowcaseEntry } from "../showcase";
import { MerchSizeGuideModal } from "./merch-size-guide-modal";
import { MerchSizeGuideModalDemo } from "./merch-size-guide-modal.demo";
import type { MerchSizeGuideRow } from "./merch-size-guide-modal";

/** Jacket size rows measured from merch.riotgames.com (inches). */
export const JACKET_ROWS: MerchSizeGuideRow[] = [
  { size: "S",   measurements: { a: 25,   b: 26.5,  c: 24.25 } },
  { size: "M",   measurements: { a: 26,   b: 27.5,  c: 24.5  } },
  { size: "L",   measurements: { a: 27,   b: 28.5,  c: 24.75 } },
  { size: "XL",  measurements: { a: 28,   b: 29.5,  c: 25    } },
  { size: "2XL", measurements: { a: 29,   b: 30.5,  c: 25.25 } },
];

export const merchSizeGuideModalShowcase: ShowcaseEntry = {
  slug: "merch-size-guide-modal",
  name: "Merch Size Guide Modal",
  area: "merch",
  description:
    "Centered apparel size-guide dialog (800×484px). Contains a product silhouette image, in/cm unit toggle tabs, and a size table (S/M/L/XL/2XL with A/B/C measurements). Triggered from MerchPurchasePanel via showSizeGuideLink + onSizeGuideClick props. Full a11y: role=dialog, aria-modal, aria-labelledby, ESC/overlay close.",
  variants: [
    {
      name: "Open — inches (default)",
      notes:
        "Modal open, unit set to 'in', jacket rows rendered. CLOSE button and overlay click both call onClose. No silhouette image (shows placeholder).",
      backgrounds: ["light"],
      render: () => (
        <div style={{ position: "relative", minHeight: 520, backgroundColor: "var(--color-merch-bg)" }}>
          <MerchSizeGuideModal
            open={true}
            rows={JACKET_ROWS}
            unit="in"
          />
        </div>
      ),
    },
    {
      name: "Open — centimetres",
      notes:
        "Same rows with unit='cm'. Values are multiplied by 2.54 and displayed with up to 2 decimal places.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ position: "relative", minHeight: 520, backgroundColor: "var(--color-merch-bg)" }}>
          <MerchSizeGuideModal
            open={true}
            rows={JACKET_ROWS}
            unit="cm"
          />
        </div>
      ),
    },
    {
      name: "Closed",
      notes: "When open={false} the component returns null — nothing is rendered.",
      backgrounds: ["light"],
      render: () => (
        <div
          style={{
            padding: 24,
            backgroundColor: "var(--color-merch-surface)",
            fontSize: 13,
            color: "var(--color-merch-muted)",
            fontFamily: "var(--font-merch)",
          }}
        >
          MerchSizeGuideModal (open=false) renders nothing.
        </div>
      ),
    },
    {
      name: "Interactive — open/close + unit toggle",
      notes:
        "Stateful demo: click 'Open Size Guide' to show the modal, switch units, press CLOSE or ESC or click the overlay to dismiss.",
      backgrounds: ["light"],
      render: () => <MerchSizeGuideModalDemo />,
    },
  ],
};
