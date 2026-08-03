import type { ShowcaseEntry } from "../showcase";
import { MerchFooter } from "./merch-footer";
import { MerchFooterDemo } from "./merch-footer.demo";

export const merchFooterShowcase: ShowcaseEntry = {
  slug: "merch-footer",
  name: "Merch Footer",
  area: "merch",
  description:
    "Global footer for the Riot merch store: pure-black background, Riot wordmark, Shop + Support link columns, a Contact Us form (Name / Email / Order # / Country / Tracking # / Subject / How can we help + SEND), and a legal row at bottom. Measured from merch.riotgames.com: --color-merch-ink-dark background, 64px vertical padding, max-w-screen-xl centered.",
  variants: [
    {
      name: "Default — real-store columns, static form",
      notes: "All columns with defaults; form is presentational (no onContactSubmit wired).",
      backgrounds: ["dark"],
      render: () => (
        <MerchFooter copyrightText="Copyright Riot Games 2025" />
      ),
    },
    {
      name: "Interactive — controlled form state",
      notes: "Form wired to useState in MerchFooterDemo (*.demo.tsx client component).",
      render: () => <MerchFooterDemo />,
    },
    {
      name: "Custom legal links only",
      notes: "Minimal footer: real link columns but shortened legal row.",
      backgrounds: ["dark"],
      render: () => (
        <MerchFooter
          copyrightText="© 2025 Riot Games, Inc."
          legalLinks={[
            { label: "Privacy Policy",     href: "/merch/pages/privacy" },
            { label: "Terms & Conditions", href: "/merch/pages/terms" },
          ]}
        />
      ),
    },
    {
      name: "Custom Shop + Support links",
      notes: "Override default link groups with shorter lists.",
      backgrounds: ["dark"],
      render: () => (
        <MerchFooter
          shopLinks={[
            { label: "Apparel",      href: "/merch/shop-all?category=apparel" },
            { label: "Collectibles", href: "/merch/shop-all?category=collectibles" },
          ]}
          supportLinks={[
            { label: "FAQs",                href: "/merch/pages/faqs" },
            { label: "Shipping Information",href: "/merch/pages/shipping" },
            { label: "Return Policy",       href: "/merch/pages/returns" },
          ]}
          copyrightText="Copyright Riot Games 2025"
        />
      ),
    },
  ],
};
