import type { ShowcaseEntry } from "../showcase";
import type { MerchNavLink } from "./merch-store";
import { MerchStore } from "./merch-store";

const DEMO_NAV: MerchNavLink[] = [
  { id: "new",        label: "New Arrivals", href: "#" },
  { id: "apparel",    label: "Apparel",      href: "#" },
  { id: "lifestyle",  label: "Lifestyle",    href: "#" },
  { id: "sale",       label: "Sale",         href: "#" },
];

export const merchStoreShowcase: ShowcaseEntry = {
  slug: "merch-store",
  name: "Merch Store",
  area: "merch",
  description:
    "Foundation shell for the /merch section: header/nav placeholder, a main content slot, and a footer. Uses --color-merch-* tokens (packages/tokens/src/merch.css). Later build loops slot product grids into the children prop.",
  variants: [
    {
      name: "Shell — with nav links + coming soon placeholder",
      render: () => (
        <MerchStore navLinks={DEMO_NAV}>
          <div
            className="mx-auto flex max-w-7xl flex-col items-center justify-center px-6 py-32 text-center"
            style={{ color: "var(--color-merch-muted, #737373)" }}
          >
            <p
              className="text-xs uppercase tracking-[0.3em]"
              style={{ color: "var(--color-merch-red, #d13639)" }}
            >
              Coming soon
            </p>
            <h2
              className="mt-4 text-3xl font-bold uppercase tracking-widest"
              style={{ color: "var(--color-merch-ink, #1a1a1a)" }}
            >
              Riot Merch
            </h2>
            <p className="mt-4 max-w-md text-base">
              The merch store is coming together. Check back soon for official
              Riot Games merchandise.
            </p>
          </div>
        </MerchStore>
      ),
    },
    {
      name: "Shell — no nav (minimal header)",
      render: () => (
        <MerchStore>
          <div className="px-6 py-24 text-center">
            <p style={{ color: "var(--color-merch-muted, #737373)" }}>Main content slot</p>
          </div>
        </MerchStore>
      ),
    },
  ],
};
