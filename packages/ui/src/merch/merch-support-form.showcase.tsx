/**
 * Showcase for MerchSupportForm — server-safe (NO 'use client').
 *
 * Interactive controlled-input state lives in merch-support-form.demo.tsx
 * (a separate client component). This file imports it as a lazy render so
 * the server page stays RSC-safe.
 */

import type { ShowcaseEntry } from "../showcase";
import { MerchSupportFormDemo } from "./merch-support-form.demo";

export const merchSupportFormShowcase: ShowcaseEntry = {
  slug: "merch-support-form",
  name: "Merch Support Form",
  area: "merch",
  description:
    "Presentational form widget for the 3 support pages: order-status (3 fields, row layout), gift-card-balance (2 fields, row layout), and verify-your-product (lookup layout with Card-of-Authenticity illustration on desktop). Uses --color-merch-input-bg / --color-merch-input-border / --color-merch-input-disabled tokens. Fields flex-row on desktop, flex-col on mobile. onSubmit callback only — no real network call.",
  variants: [
    {
      name: "Order Status (row, 3 fields)",
      notes:
        "3 inputs in a flex row (desktop) / flex col (mobile). Fields: Order Number, Billing Last Name (text, filled bg), Email Address (email, bordered). Button: FIND MY ORDER, 256px desktop.",
      backgrounds: ["light"],
      render: () => (
        <MerchSupportFormDemo
          title="Order Status / Code Lookup"
          config={{
            variant: "row",
            fields: [
              { id: "order-number", label: "Order Number", type: "text" },
              { id: "billing-last-name", label: "Billing Last Name", type: "text" },
              { id: "order-email", label: "Email Address", type: "email" },
            ],
            submitLabel: "Find My Order",
          }}
        />
      ),
    },
    {
      name: "Gift Card Balance (row, 2 fields)",
      notes:
        "2 inputs in a flex row (desktop) / flex col (mobile). Fields: Last 4 Characters (text, filled), Email Address (email, bordered). Button: CHECK BALANCE.",
      backgrounds: ["light"],
      render: () => (
        <MerchSupportFormDemo
          title="Gift Card Balance"
          config={{
            variant: "row",
            fields: [
              { id: "gcp_last", label: "Last 4 Characters", type: "text" },
              { id: "gcp_email", label: "Email Address", type: "email" },
            ],
            submitLabel: "Check Balance",
          }}
        />
      ),
    },
    {
      name: "Verify Your Product (lookup, illustration)",
      notes:
        "2-col grid desktop: left = Card-of-Authenticity inline SVG, right = Authenticity Code field (393×50, bordered) + LOOKUP button (240×50). Mobile: 1-col, illustration hidden, full-width inputs.",
      backgrounds: ["light"],
      render: () => (
        <MerchSupportFormDemo
          title="Verify Your Product"
          config={{
            variant: "lookup",
            fields: [
              { id: "product-auth-code", label: "Authenticity Code", type: "text" },
            ],
            submitLabel: "LOOKUP",
            /* No illustrationSrc — falls back to the inline CardOfAuthenticity SVG */
          }}
        />
      ),
    },
  ],
};
