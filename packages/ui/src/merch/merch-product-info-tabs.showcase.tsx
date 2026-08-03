import type { ShowcaseEntry } from "../showcase";
import { MerchProductInfoTabs } from "./merch-product-info-tabs";
import { MerchProductInfoTabsDemo } from "./merch-product-info-tabs.demo";

/** Single-tab content — non-apparel collector box. */
const SINGLE_TAB_CONTENT = (
  <div>
    <p style={{ margin: "0 0 12px" }}>
      The League Classic Collectors Box contains an exclusive selection of
      League of Legends memorabilia curated for the dedicated fan. Each box
      ships in a premium rigid-lid gift box.
    </p>
    <ul style={{ margin: "0 0 12px", paddingLeft: 20 }}>
      <li>1× Limited Edition champion enamel pin</li>
      <li>1× Double-sided art print (11 × 17 in)</li>
      <li>1× 30-day XP boost code</li>
      <li>1× Exclusive in-game icon (code included)</li>
    </ul>
    <p style={{ margin: 0 }}>
      In-game codes are region-locked and valid through December 31, 2026.
    </p>
  </div>
);

export const merchProductInfoTabsShowcase: ShowcaseEntry = {
  slug: "merch-product-info-tabs",
  name: "Merch Product Info Tabs",
  area: "merch",
  description:
    "Tab strip ([role=tablist]) + panel ([role=tabpanel]) below the PDP purchase panel. " +
    "39px strip, 16px/600 tab labels, 2px solid ink active underline, 16px body panel. " +
    "Measured from merch.riotgames.com PDP. Supports 1–N tabs (Description / Shipping / Returns).",
  variants: [
    {
      name: "Single tab — Description only",
      notes:
        "Non-apparel PDP: only one tab rendered. Active tab is underlined; " +
        "panel renders rich text (paragraphs + bullet list).",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 560, padding: 24, fontFamily: "system-ui, sans-serif" }}>
          <MerchProductInfoTabs
            tabs={[
              {
                id: "description",
                label: "Description",
                content: SINGLE_TAB_CONTENT,
              },
            ]}
            selectedTab="description"
          />
        </div>
      ),
    },
    {
      name: "Multi-tab — Description / Shipping / Returns (interactive)",
      notes:
        "Three tabs with interactive switching via MerchProductInfoTabsDemo (client " +
        "component). Clicking a tab header swaps the panel content.",
      backgrounds: ["light"],
      render: () => <MerchProductInfoTabsDemo />,
    },
    {
      name: "Inactive tab hover state",
      notes:
        "\"Shipping\" is preselected so Description and Returns are inactive. " +
        "Hover them to see color transition to --color-merch-ink.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 560, padding: 24, fontFamily: "system-ui, sans-serif" }}>
          <MerchProductInfoTabs
            tabs={[
              {
                id: "description",
                label: "Description",
                content: <p style={{ margin: 0 }}>Description content.</p>,
              },
              {
                id: "shipping",
                label: "Shipping",
                content: (
                  <p style={{ margin: 0 }}>
                    Standard shipping: 5–7 business days.
                  </p>
                ),
              },
              {
                id: "returns",
                label: "Returns",
                content: (
                  <p style={{ margin: 0 }}>Returns accepted within 30 days.</p>
                ),
              },
            ]}
            selectedTab="shipping"
          />
        </div>
      ),
    },
  ],
};
