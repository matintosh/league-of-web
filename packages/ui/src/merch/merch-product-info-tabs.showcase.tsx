import type { ShowcaseEntry } from "../showcase";
import { MerchProductInfoTabs } from "./merch-product-info-tabs";
import { MerchProductInfoTabsDemo } from "./merch-product-info-tabs.demo";

/** Single-row content — non-apparel collector box. */
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

/** Amumu Plush description — mirrors AMUMU_PLUSH_DESCRIPTION fixture, rendered here as JSX. */
const AMUMU_PLUSH_CONTENT = (
  <div>
    <p style={{ margin: "0 0 12px" }}>
      As one of League's original 40 champions, the Sad Mummy has spent almost
      two decades searching for a hug — and now he can finally have one. This
      officially licensed Amumu Plush brings the Sad Mummy home in huggable
      plush form, lovingly crafted with soft materials and detailed embroidery.
    </p>
    <p style={{ margin: "0 0 16px" }}>
      Whether you're a longtime fan of the Sad Mummy or just joining the Rift,
      this plush is the perfect companion for your desk, shelf, or the next
      time you need a hug. Bring home the Amumu Plush today and put an end to
      his centuries of solitude.
    </p>
    <div style={{ marginBottom: 16 }}>
      <p style={{ margin: "0 0 6px", fontWeight: 400 }}>
        Approximate Measurements:
      </p>
      <ul style={{ margin: 0, paddingLeft: 20 }}>
        <li>Height: ~11 inches / ~28 cm</li>
        <li>Width: ~7 inches / ~18 cm</li>
        <li>Material: 100% polyester plush fabric</li>
      </ul>
    </div>
    <div>
      <p style={{ margin: "0 0 4px", fontWeight: 700 }}>
        PURCHASING DISCLAIMER(S)
      </p>
      <p style={{ margin: 0 }}>
        This product is not intended as a toy or children's product. This item
        typically ships within 2 weeks from purchase. Quantities are limited —
        order early to avoid disappointment. Riot Games reserves the right to
        cancel orders that appear fraudulent.
      </p>
    </div>
  </div>
);

export const merchProductInfoTabsShowcase: ShowcaseEntry = {
  slug: "merch-product-info-tabs",
  name: "Merch Product Info Tabs",
  area: "merch",
  description:
    "Accordion-style info section below the PDP purchase panel. " +
    "Each row: 39px header (16px/600), chevron toggles panel open/closed, " +
    "COLLAPSED by default. Panel: 16px / line-height normal / --color-merch-body. " +
    "Measured from merch.riotgames.com PDP.",
  variants: [
    {
      name: "Single row — Description (collapsed, real Amumu copy)",
      notes:
        "Starts COLLAPSED per the real PDP. Click 'Description' to expand. " +
        "Full multi-paragraph body + Approximate Measurements + PURCHASING DISCLAIMER(S). " +
        "Body 16px / line-height normal / --color-merch-body.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 560, padding: 24, fontFamily: "system-ui, sans-serif" }}>
          <MerchProductInfoTabs
            tabs={[
              {
                id: "description",
                label: "Description",
                content: AMUMU_PLUSH_CONTENT,
              },
            ]}
          />
        </div>
      ),
    },
    {
      name: "Single row — pre-expanded (selectedTab)",
      notes:
        "Pass selectedTab='description' to seed the open state on mount. " +
        "Simulates arriving on the page with the panel already open.",
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
      name: "Multi-row — Description / Shipping / Returns (interactive)",
      notes:
        "Three accordion rows. All start collapsed. " +
        "Click any header to expand; click again to collapse. " +
        "onTabChange callback logs the last toggle state below.",
      backgrounds: ["light"],
      render: () => <MerchProductInfoTabsDemo />,
    },
  ],
};
