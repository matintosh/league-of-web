"use client";

/**
 * MerchProductInfoTabsDemo — interactive multi-row accordion demo with useState.
 * Client component; imported by the showcase for the multi-row variant.
 */

import { useState } from "react";
import { MerchProductInfoTabs } from "./merch-product-info-tabs";

const MULTI_TABS = [
  {
    id: "description",
    label: "Description",
    content: (
      <div>
        <p style={{ margin: "0 0 12px" }}>
          Celebrate the 2026 Mid-Season Showdown with this officially licensed
          bomber jacket. Crafted from 100% cotton with ribbed cuffs and hem,
          embroidered MSI logo on the chest, and a woven Riot Games patch on
          the sleeve.
        </p>
        <ul style={{ margin: "0 0 12px", paddingLeft: 20 }}>
          <li>100% preshrunk cotton fleece</li>
          <li>Embroidered MSI 2026 logo on chest</li>
          <li>Woven Riot Games badge on left sleeve</li>
          <li>YKK zipper with custom pull tab</li>
        </ul>
        <p style={{ margin: 0 }}>
          Ships in 3–5 business days. Limited quantities available.
        </p>
      </div>
    ),
  },
  {
    id: "shipping",
    label: "Shipping",
    content: (
      <div>
        <p style={{ margin: "0 0 12px" }}>
          Standard shipping: 5–7 business days (free on orders over $75).
        </p>
        <p style={{ margin: "0 0 12px" }}>
          Expedited shipping: 2–3 business days (+$12.99).
        </p>
        <p style={{ margin: 0 }}>
          Overnight shipping: next business day if ordered by 12 pm PST
          (+$24.99).
        </p>
      </div>
    ),
  },
  {
    id: "returns",
    label: "Returns",
    content: (
      <div>
        <p style={{ margin: "0 0 12px" }}>
          We accept returns within 30 days of delivery for unworn, unwashed
          items with original tags attached.
        </p>
        <p style={{ margin: 0 }}>
          To start a return, visit your order history or contact{" "}
          <a
            href="#"
            style={{ color: "var(--color-merch-red)", textDecoration: "underline" }}
          >
            Riot Support
          </a>
          . Refunds are processed within 5–10 business days.
        </p>
      </div>
    ),
  },
];

/** Interactive multi-row accordion demo for the showcase. */
export function MerchProductInfoTabsDemo() {
  const [lastToggle, setLastToggle] = useState<string | null>(null);

  return (
    <div style={{ maxWidth: 560, padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <MerchProductInfoTabs
        tabs={MULTI_TABS}
        onTabChange={(id, open) =>
          setLastToggle(`"${id}" is now ${open ? "open" : "closed"}`)
        }
      />
      {lastToggle && (
        <p
          style={{
            marginTop: 12,
            fontSize: 12,
            color: "var(--color-merch-muted)",
            fontFamily: "monospace",
          }}
        >
          Last toggle: {lastToggle}
        </p>
      )}
    </div>
  );
}
