import type { ShowcaseEntry } from "../showcase";
import { LolClassicLogo } from "./lol-classic-logo";

/**
 * Showcase for LolClassicLogo — the LoL Classic crest + wordmark + ribbon.
 * Server-safe: no 'use client'.
 */
export const lolClassicLogoShowcase: ShowcaseEntry = {
  slug: "lol-classic-logo",
  name: "LolClassicLogo",
  area: "login",
  description:
    "The League of Legends Classic emblem — heraldic crest shield, LoL wordmark, and CLASSIC ribbon. Brand-asset SVG (simplified original artwork). Used in the classic login panel top-left.",
  variants: [
    {
      name: "Gold on cream (classic panel context)",
      backgrounds: ["light"],
      render: () => (
        <div
          className="flex items-center justify-center rounded p-6"
          style={{
            background:
              "linear-gradient(to bottom, var(--color-login-classic-panel-from) 0%, var(--color-login-classic-panel-mid) 50%, var(--color-login-classic-panel-to) 100%)",
          }}
        >
          <LolClassicLogo className="text-login-classic-ink" width={96} />
        </div>
      ),
    },
    {
      name: "Small (48px)",
      backgrounds: ["light"],
      render: () => (
        <div
          className="flex items-center justify-center rounded p-4"
          style={{ background: "var(--color-login-classic-panel-mid)" }}
        >
          <LolClassicLogo className="text-login-classic-ink" width={48} />
        </div>
      ),
    },
    {
      name: "On dark bg — gold fill",
      backgrounds: ["dark"],
      render: () => (
        <div className="flex items-center justify-center p-6">
          <LolClassicLogo className="text-gold-3" width={96} />
        </div>
      ),
    },
  ],
};
