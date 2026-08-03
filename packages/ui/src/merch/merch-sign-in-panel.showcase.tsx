/**
 * Showcase for MerchSignInPanel — server-safe (NO 'use client').
 * Stateful interactions live in merch-sign-in-panel.demo.tsx.
 */

import type { ShowcaseEntry } from "../showcase";
import { MerchSignInPanel } from "./merch-sign-in-panel";
import { MerchSignInPanelDemo } from "./merch-sign-in-panel.demo";

export const merchSignInPanelShowcase: ShowcaseEntry = {
  slug: "merch-sign-in-panel",
  name: "Merch Sign-In Panel",
  area: "merch",
  description:
    "Presentational sign-in card for /merch/account. Centered panel (~480px) with Riot fist emblem, 'Sign In' heading, subtext, full-width SIGN IN WITH RIOT primary CTA, an 'or' divider, Track Your Order guest link, and a legal disclaimer with Terms/Privacy callback links. No real auth — all interactions are callbacks. Matches the merch.riotgames.com SSO gateway shell.",
  variants: [
    {
      name: "Default",
      notes:
        "Static render — no callbacks wired. Shows the complete sign-in panel as it appears on /merch/account.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ padding: "48px 24px", backgroundColor: "var(--color-merch-bg)" }}>
          <MerchSignInPanel />
        </div>
      ),
    },
    {
      name: "Interactive — callbacks wired",
      notes:
        "Buttons fire callbacks; last-fired action shown below the panel. State held in MerchSignInPanelDemo (*.demo.tsx client component).",
      backgrounds: ["light"],
      render: () => <MerchSignInPanelDemo />,
    },
  ],
};
