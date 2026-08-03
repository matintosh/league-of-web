"use client";

/**
 * MerchSizeGuideModalDemo — interactive open/close wrapper.
 * Client component; holds open + unit state for the showcase.
 */
import { useState } from "react";
import { MerchSizeGuideModal } from "./merch-size-guide-modal";
import { JACKET_ROWS } from "./merch-size-guide-modal.showcase";

export function MerchSizeGuideModalDemo() {
  const [open, setOpen] = useState(false);
  const [unit, setUnit] = useState<"in" | "cm">("in");

  return (
    <div
      style={{
        padding: 32,
        backgroundColor: "var(--color-merch-bg)",
        fontFamily: "var(--font-merch)",
      }}
    >
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          padding: "10px 24px",
          backgroundColor: "var(--color-merch-ink)",
          color: "var(--color-merch-on-dark)",
          border: "none",
          fontSize: 13,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        Open Size Guide
      </button>

      <MerchSizeGuideModal
        open={open}
        onClose={() => setOpen(false)}
        rows={JACKET_ROWS}
        unit={unit}
        onUnitChange={setUnit}
      />
    </div>
  );
}
