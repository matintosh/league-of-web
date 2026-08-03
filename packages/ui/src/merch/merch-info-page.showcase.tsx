/**
 * Showcase for MerchInfoPage — server-safe (NO 'use client').
 * Inline dummy content; does NOT import MERCH_INFO_PAGES values.
 */

import type { ShowcaseEntry } from "../showcase";
import { MerchInfoPage } from "./merch-info-page";

export const merchInfoPageShowcase: ShowcaseEntry = {
  slug: "merch-info-page",
  name: "Merch Info Page",
  area: "merch",
  description:
    "Long-form prose template for /merch/pages/[slug]. Renders a title (h1) and an ordered block list (heading2, heading3, paragraph, ul, ol) inside a max-w-screen-md centered container. Matches merch.riotgames.com info-page layout: white bg, --color-merch-ink headings, --color-merch-body prose, 1px --color-merch-border section dividers.",
  variants: [
    {
      name: "FAQ page",
      notes:
        "Multi-section FAQ with h2 dividers, paragraph copy, and a ul list. Matches /merch/pages/faqs.",
      backgrounds: ["light"],
      render: () => (
        <MerchInfoPage
          title="Frequently Asked Questions"
          blocks={[
            { type: "heading2", content: "Orders" },
            {
              type: "paragraph",
              content:
                "Once your order is placed you will receive a confirmation email. Orders are typically processed within 1–3 business days before shipping.",
            },
            { type: "heading3", content: "Can I change or cancel my order?" },
            {
              type: "paragraph",
              content:
                "Orders can be modified or cancelled within 1 hour of placement. Please contact our support team as quickly as possible for assistance.",
            },
            { type: "heading3", content: "What payment methods do you accept?" },
            {
              type: "ul",
              content: [
                "Credit and debit cards (Visa, Mastercard, American Express)",
                "PayPal",
                "Riot Games Gift Cards",
                "Apple Pay and Google Pay (where available)",
              ],
            },
            { type: "heading2", content: "Shipping" },
            {
              type: "paragraph",
              content:
                "We ship to most countries worldwide. Shipping times and costs vary depending on your location and the shipping method selected at checkout.",
            },
            { type: "heading2", content: "Returns & Exchanges" },
            {
              type: "paragraph",
              content:
                "We accept returns and exchanges within 30 days of delivery for most items. Please see our Returns page for full details.",
            },
          ]}
        />
      ),
    },
    {
      name: "Shipping page",
      notes:
        "Shipping info with h2 headings, paragraphs, and an ol numbered list. Matches /merch/pages/shipping.",
      backgrounds: ["light"],
      render: () => (
        <MerchInfoPage
          title="Shipping Information"
          blocks={[
            { type: "heading2", content: "Processing Times" },
            {
              type: "paragraph",
              content:
                "Orders are processed within 1–3 business days (Monday–Friday, excluding holidays). You will receive an email confirmation once your order ships.",
            },
            { type: "heading2", content: "Domestic Shipping (United States)" },
            {
              type: "paragraph",
              content: "We offer the following shipping options for US orders:",
            },
            {
              type: "ol",
              content: [
                "Standard Shipping (5–7 business days) — Free on orders over $50",
                "Expedited Shipping (2–3 business days) — Flat rate $12.99",
                "Overnight Shipping (next business day) — Flat rate $24.99",
              ],
            },
            { type: "heading2", content: "International Shipping" },
            {
              type: "paragraph",
              content:
                "We ship to over 60 countries. International delivery typically takes 7–21 business days depending on the destination and customs processing times.",
            },
            { type: "heading3", content: "Customs & Import Duties" },
            {
              type: "paragraph",
              content:
                "The recipient is responsible for any customs duties, taxes, or import fees imposed by their country.",
            },
          ]}
        />
      ),
    },
  ],
};
