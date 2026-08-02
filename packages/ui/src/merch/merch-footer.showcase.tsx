import type { ShowcaseEntry } from "../showcase";
import { MerchFooter } from "./merch-footer";
import { MerchFooterDemo } from "./merch-footer.demo";

export const merchFooterShowcase: ShowcaseEntry = {
  slug: "merch-footer",
  name: "Merch Footer",
  area: "merch",
  description:
    "Global footer for the Riot merch store: link columns (Support, Shipping, About), optional newsletter signup stub, optional social icons, and a bottom bar with copyright + legal links. Measured from merch.riotgames.com: --color-merch-surface background, 48px vertical padding, max-w-screen-xl centered.",
  variants: [
    {
      name: "Default — real-store link groups, no newsletter",
      notes: "All three link columns with defaults; no newsletter section.",
      backgrounds: ["light"],
      render: () => (
        <MerchFooter copyrightText="Copyright Riot Games 2025" />
      ),
    },
    {
      name: "With newsletter section",
      notes: "onSubscribe prop causes newsletter email input + Subscribe button to appear above columns.",
      render: () => <MerchFooterDemo />,
    },
    {
      name: "With social links",
      notes: "Social icon row appears right-aligned in columns section.",
      backgrounds: ["light"],
      render: () => (
        <MerchFooter
          socialLinks={[
            { platform: "Instagram", href: "#" },
            { platform: "Twitter",   href: "#" },
            { platform: "YouTube",   href: "#" },
            { platform: "Facebook",  href: "#" },
          ]}
        />
      ),
    },
    {
      name: "Minimal — no social, no newsletter, custom copyright",
      notes: "Minimal footer: only link columns + bottom bar.",
      backgrounds: ["light"],
      render: () => (
        <MerchFooter
          copyrightText="© 2025 Riot Games, Inc."
          legalLinks={[
            { label: "Privacy Policy", href: "/privacy" },
            { label: "Terms of Service", href: "/terms" },
          ]}
        />
      ),
    },
  ],
};
