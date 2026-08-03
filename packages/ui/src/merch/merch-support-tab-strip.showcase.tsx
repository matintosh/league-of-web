/**
 * Showcase for MerchSupportTabStrip — server-safe (NO 'use client').
 * Interactive active-tab demo is in merch-support-tab-strip.demo.tsx.
 */

import type { ShowcaseEntry } from "../showcase";
import { MerchSupportTabStrip } from "./merch-support-tab-strip";
import { MERCH_SUPPORT_TABS } from "@low/fixtures";

export const merchSupportTabStripShowcase: ShowcaseEntry = {
  slug: "merch-support-tab-strip",
  name: "Merch Support Tab Strip",
  area: "merch",
  description:
    "Horizontal pill-button tab row for the support portal. 9 sections from the real merch.riotgames.com site: Accessibility, FAQs, Shipping Methods, Return Policy, Riot Mart, Verify Your Product, Collectability Guide, Gift Card Balance, Order Status. Active pill is ink-filled; inactive pills are outlined. Scrolls horizontally at narrow viewports without overflow.",
  variants: [
    {
      name: "FAQs active",
      notes: "Default state on the FAQs page — the FAQs pill is filled/active.",
      backgrounds: ["light"],
      render: () => (
        <MerchSupportTabStrip
          sections={MERCH_SUPPORT_TABS}
          activeSlug="faqs"
        />
      ),
    },
    {
      name: "Shipping active",
      notes: "Active state when viewing the Shipping Methods page.",
      backgrounds: ["light"],
      render: () => (
        <MerchSupportTabStrip
          sections={MERCH_SUPPORT_TABS}
          activeSlug="shipping"
        />
      ),
    },
    {
      name: "Accessibility active",
      notes: "Active state when viewing the Accessibility page (first tab).",
      backgrounds: ["light"],
      render: () => (
        <MerchSupportTabStrip
          sections={MERCH_SUPPORT_TABS}
          activeSlug="accessibility"
        />
      ),
    },
  ],
};
