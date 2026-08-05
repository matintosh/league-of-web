"use client";

/**
 * LauncherRiotHomePageDemo — wraps LauncherRiotHomePage with live click
 * handlers. Client component; kept separate so the showcase file is server-safe.
 */

import { useState } from "react";
import { LauncherRiotHomePage } from "./launcher-riot-home-page";
import type { LauncherRiotHomePageProps } from "./launcher-riot-home-page";

export function LauncherRiotHomePageDemo(
  props: Omit<LauncherRiotHomePageProps, "onPromoCtaClick" | "onPatchNoteClick">
) {
  const [log, setLog] = useState<string[]>([]);

  return (
    <div style={{ fontFamily: "var(--font-launcher)", position: "relative" }}>
      <LauncherRiotHomePage
        {...props}
        onPromoCtaClick={() =>
          setLog((prev) => [`promo CTA clicked`, ...prev].slice(0, 5))
        }
        onPatchNoteClick={(id) =>
          setLog((prev) => [`patch note clicked: ${id}`, ...prev].slice(0, 5))
        }
      />
      {log.length > 0 && (
        <ul
          style={{
            position: "absolute",
            bottom: 12,
            right: 12,
            margin: 0,
            padding: "6px 10px",
            listStyle: "none",
            backgroundColor: "var(--color-launcher-surface)",
            border: "1px solid var(--color-launcher-border)",
            borderRadius: 4,
            fontSize: 11,
            color: "var(--color-launcher-text-muted)",
          }}
        >
          {log.map((entry, i) => (
            <li key={i}>{entry}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
