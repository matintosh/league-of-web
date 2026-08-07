import type { ShowcaseEntry } from "../showcase";
import { MerchBreadcrumbBar } from "./merch-breadcrumb-bar";
import {
  MerchBreadcrumbBarWithRefineDemo,
  MerchBreadcrumbBarCollectionDemo,
} from "./merch-breadcrumb-bar.demo";

/**
 * Showcase for MerchBreadcrumbBar — the full-width breadcrumb bar used on
 * /merch/shop-all, /merch/sale, /merch/collection/[handle], and /merch/product/[handle].
 * Measured from merch.riotgames.com: 16px ink crumbs, 40px padding, 60px/40px height.
 */
export const merchBreadcrumbBarShowcase: ShowcaseEntry = {
  slug: "merch-breadcrumb-bar",
  name: "Merch Breadcrumb Bar",
  area: "merch",
  description:
    "Full-width breadcrumb bar with optional product count and inline red REFINE button. Height 60px desktop / 40px mobile. White bg (--color-merch-bg), 40px left padding desktop, crumbs separated by gap (no '/' node), current crumb 16px/400. REFINE icon: 2-line sliders with hollow ring knobs. Used on shop-all, sale, collection, and product pages.",
  variants: [
    {
      name: "Shop All — 2 crumbs, count + REFINE (interactive)",
      notes:
        "Home / Shop All (42) + REFINE button. Demonstrates the hover state on the red button. Stateful demo (client component).",
      backgrounds: ["light"],
      render: () => <MerchBreadcrumbBarWithRefineDemo />,
    },
    {
      name: "Sale — 2 crumbs, count only, no REFINE",
      notes:
        "Home / Sales (12) without a REFINE button. Demonstrates count-only variant.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ width: "100%", backgroundColor: "var(--color-merch-bg)" }}>
          <MerchBreadcrumbBar
            crumbs={[
              { label: "Home" },
              { label: "Sales" },
            ]}
            count={12}
          />
        </div>
      ),
    },
    {
      name: "Collection — 2 crumbs, count + REFINE (interactive)",
      notes:
        "Home / Apparel (28) + REFINE. Matches /merch/collection/apparel. Stateful demo (client component).",
      backgrounds: ["light"],
      render: () => <MerchBreadcrumbBarCollectionDemo />,
    },
    {
      name: "Product — 3 crumbs, no count, no REFINE",
      notes:
        "Home / Apparel / LoL Classic Hoodie — 3-segment trail as used on PDPs. No count or REFINE.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ width: "100%", backgroundColor: "var(--color-merch-bg)" }}>
          <MerchBreadcrumbBar
            crumbs={[
              { label: "Home" },
              { label: "Apparel" },
              { label: "LoL Classic Hoodie" },
            ]}
          />
        </div>
      ),
    },
    {
      name: "Minimal — no count, no REFINE",
      notes:
        "Bare minimum: 2 crumbs only. Right side is empty when no onRefineClick is supplied.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ width: "100%", backgroundColor: "var(--color-merch-bg)" }}>
          <MerchBreadcrumbBar
            crumbs={[
              { label: "Home" },
              { label: "Shop All" },
            ]}
          />
        </div>
      ),
    },
  ],
};
