"use client";

/**
 * Interactive demo wrappers for MerchSupportForm showcase entries.
 * This file IS a client component — it manages the submitted-values state
 * and passes an onSubmit callback to the presentational form.
 *
 * The showcase file (merch-support-form.showcase.tsx) is server-safe and
 * imports these demos instead of inlining 'use client' code.
 */

import { useState } from "react";
import { MerchSupportForm } from "./merch-support-form";
import type { MerchSupportFormConfig } from "@low/fixtures";

interface DemoProps {
  title: string;
  config: MerchSupportFormConfig;
}

export function MerchSupportFormDemo({ title, config }: DemoProps) {
  const [submitted, setSubmitted] = useState<Record<string, string> | null>(null);

  return (
    <div>
      <MerchSupportForm
        title={title}
        config={config}
        onSubmit={(values) => setSubmitted(values)}
      />
      {submitted && (
        <pre
          style={{
            marginTop: "16px",
            padding: "12px 16px",
            backgroundColor: "var(--color-merch-surface)",
            fontFamily: "monospace",
            fontSize: "13px",
            color: "var(--color-merch-body)",
            border: "1px solid var(--color-merch-border)",
          }}
        >
          {JSON.stringify(submitted, null, 2)}
        </pre>
      )}
    </div>
  );
}
