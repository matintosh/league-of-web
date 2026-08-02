"use client";

import { useState } from "react";
import { MerchFooter } from "./merch-footer";

/**
 * Interactive demo for MerchFooter — shows the newsletter subscribe callback.
 * Separate client component so the showcase file stays server-safe.
 */
export function MerchFooterDemo() {
  const [subscribed, setSubscribed] = useState<string | null>(null);

  return (
    <div>
      {subscribed && (
        <p
          className="px-6 py-3 text-center text-[13px]"
          style={{
            backgroundColor: "var(--color-merch-surface)",
            color: "var(--color-merch-ink)",
            borderBottom: "1px solid var(--color-merch-border)",
          }}
        >
          Subscribed: <strong>{subscribed}</strong>
        </p>
      )}
      <MerchFooter
        onSubscribe={(email) => setSubscribed(email)}
        socialLinks={[
          { platform: "Instagram", href: "#" },
          { platform: "Twitter",   href: "#" },
          { platform: "YouTube",   href: "#" },
        ]}
      />
    </div>
  );
}
