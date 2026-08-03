"use client";

import { useState } from "react";
import { MerchFooter } from "./merch-footer";
import type { MerchContactFormValues } from "./merch-footer";

/**
 * Interactive demo for MerchFooter — wires the Contact Us form to local state
 * and shows a success banner when onContactSubmit fires.
 * Separate client component so the showcase file stays server-safe.
 */
export function MerchFooterDemo() {
  const [submitted, setSubmitted] = useState<MerchContactFormValues | null>(null);

  function handleContactSubmit(values: MerchContactFormValues) {
    setSubmitted(values);
  }

  return (
    <div>
      {submitted && (
        <p
          className="px-6 py-3 text-center text-[13px]"
          style={{
            backgroundColor: "var(--color-merch-ink-dark)",
            color:           "var(--color-merch-on-dark)",
            borderBottom:    "1px solid var(--color-merch-border-dark)",
          }}
        >
          Message sent from{" "}
          <strong>{submitted.email || "(no email)"}</strong>
          {submitted.subject ? ` — "${submitted.subject}"` : ""}
        </p>
      )}
      <MerchFooter
        copyrightText="Copyright Riot Games 2025"
        onContactSubmit={handleContactSubmit}
      />
    </div>
  );
}
