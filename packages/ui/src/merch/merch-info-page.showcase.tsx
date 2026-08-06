/**
 * Showcase for MerchInfoPage — server-safe (NO 'use client').
 * MerchInfoPage itself is 'use client' for accordion state; the showcase
 * wraps it without needing its own client boundary.
 */

import type { ShowcaseEntry } from "../showcase";
import { MerchInfoPage } from "./merch-info-page";

export const merchInfoPageShowcase: ShowcaseEntry = {
  slug: "merch-info-page",
  name: "Merch Info Page",
  area: "merch",
  description:
    "Long-form prose + FAQ accordion template for /merch/pages/[slug]. Renders a title (h2) and an ordered block list (heading2, heading3, paragraph, ul, ol, faq-accordion). FAQ accordion: collapsible Q&A with category h2 (Inter 18px/600, no uppercase, black), question h3 triggers (18.72px/700) with right chevrons, answers hidden until expanded. White bg, --color-merch-ink-dark headings, --color-merch-body prose, 1px --color-merch-border dividers.",
  variants: [
    {
      name: "FAQ page — accordion model",
      notes:
        "FAQs page with accordion: 3 category sections (GENERAL QUESTIONS, BILLING AND ORDER QUESTIONS, TECHNICAL QUESTIONS), each with collapsible Q&A pairs. Matches /merch/pages/faqs per issue #826.",
      backgrounds: ["light"],
      render: () => (
        <MerchInfoPage
          title="FAQs"
          blocks={[
            {
              type: "faq-accordion",
              content: "",
              sections: [
                {
                  heading: "GENERAL QUESTIONS",
                  items: [
                    {
                      question: "Are your products officially licensed?",
                      answer:
                        "Yes. All products sold in the Riot Games Merch Store are officially licensed and produced to Riot's quality standards.",
                    },
                    {
                      question: "Can I purchase gift cards?",
                      answer:
                        "Yes, Riot Games Gift Cards are available in select denominations and can be redeemed on any eligible order at checkout.",
                    },
                  ],
                },
                {
                  heading: "BILLING AND ORDER QUESTIONS",
                  items: [
                    {
                      question: "What payment methods do you accept?",
                      answer:
                        "We accept credit and debit cards (Visa, Mastercard, American Express), PayPal, Riot Games Gift Cards, and Apple Pay or Google Pay where available.",
                    },
                    {
                      question: "Can I change or cancel my order?",
                      answer:
                        "Orders can be modified or cancelled within 1 hour of placement. Please contact our support team as quickly as possible.",
                    },
                  ],
                },
                {
                  heading: "TECHNICAL QUESTIONS",
                  items: [
                    {
                      question: "Why can't I add items to my cart?",
                      answer:
                        "Items that are sold out or no longer available cannot be added to your cart. Try clearing your browser cache or using a different browser.",
                    },
                  ],
                },
              ],
            },
          ]}
        />
      ),
    },
    {
      name: "Shipping page — prose model",
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
