"use client";

/**
 * PatchNoteCardDemo — wraps PatchNoteCard with a live onClick handler.
 * Client component; kept separate so the showcase file is server-safe.
 */

import { useState } from "react";
import { PatchNoteCard } from "./patch-note-card";
import type { PatchNoteCardProps } from "./patch-note-card";

export function PatchNoteCardDemo(
  props: Omit<PatchNoteCardProps, "onClick">
) {
  const [lastClicked, setLastClicked] = useState<string | null>(null);

  return (
    <div style={{ fontFamily: "var(--font-launcher)" }}>
      <PatchNoteCard {...props} onClick={(id) => setLastClicked(id)} />
      {lastClicked && (
        <p
          style={{
            marginTop: 8,
            fontSize: 11,
            color: "var(--color-launcher-text-muted)",
          }}
        >
          onClick fired: {lastClicked}
        </p>
      )}
    </div>
  );
}
