import type { ShowcaseEntry } from "../showcase";
import { HextechButton } from "./hextech-button";

// ---------------------------------------------------------------------------
// Inline icon helpers for demo purposes
// ---------------------------------------------------------------------------

function CoinIcon() {
  return (
    <svg
      aria-hidden="true"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 7v10M9.5 9.5h4a1.5 1.5 0 0 1 0 3h-3a1.5 1.5 0 0 0 0 3h4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Simple gold-ring medallion for demo — mirrors the spec sheet leading badge. */
function DemoMedallion() {
  return (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        border: "2px solid var(--color-gold-3)",
        background: "var(--color-blue-6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 14,
        color: "var(--color-gold-2)",
        fontWeight: "bold",
        flexShrink: 0,
      }}
    >
      ✕
    </div>
  );
}

export const hextechButtonShowcase: ShowcaseEntry = {
  slug: "hextech-button",
  name: "Hextech Button",
  area: "chrome",
  description:
    "Three-family Hextech button: gold rectangle (secondary), teal chevron (primary), and parallelogram (slanted). Supports leading icon (secondary) and medallion badge (primary/slanted).",
  variants: [
    // ---- Gold family (secondary) ----
    {
      name: "Secondary — OK",
      notes: "Plain gold rectangle. No clip-path. 1px gold-4 border, blue-7 fill, gold-2 text.",
      render: () => <HextechButton variant="secondary">OK</HextechButton>,
    },
    {
      name: "Secondary — Cancel",
      notes: "Secondary variant with cancel label.",
      render: () => <HextechButton variant="secondary">Cancel</HextechButton>,
    },
    {
      name: "Secondary — Save Settings",
      notes: "Secondary variant — settings confirm action.",
      render: () => <HextechButton variant="secondary">Save Settings</HextechButton>,
    },
    {
      name: "Secondary — with leading coin icon (9900)",
      notes: "icon prop — leading ReactNode, aria-hidden. Mirrors store purchase buttons.",
      render: () => (
        <HextechButton variant="secondary" icon={<CoinIcon />}>
          9900
        </HextechButton>
      ),
    },
    {
      name: "Secondary — with trailing arrow (GoTo)",
      notes: "Trailing content placed as children after the label.",
      render: () => (
        <HextechButton variant="secondary">
          GoTo&nbsp;
          <ArrowIcon />
        </HextechButton>
      ),
    },
    {
      name: "Secondary — disabled",
      notes: "Disabled state: grey-3 border, grey-4 fill, grey-2 text.",
      render: () => (
        <HextechButton variant="secondary" disabled>
          Cancel
        </HextechButton>
      ),
    },

    // ---- Chevron family (primary) ----
    {
      name: "Primary — Find Match",
      notes: "Chevron-pointed right edge, teal layered border, dark fill.",
      render: () => <HextechButton variant="primary">Find Match</HextechButton>,
    },
    {
      name: "Primary — Lock In",
      notes: "Chevron primary variant.",
      render: () => <HextechButton variant="primary">Lock In</HextechButton>,
    },
    {
      name: "Primary — large",
      notes: 'size="large" — PLAY-scale chevron bar.',
      render: () => <HextechButton variant="primary" size="large">League of Legends</HextechButton>,
    },
    {
      name: "Primary — with medallion",
      notes: "medallion prop — gold-ring circular badge overlapping the left edge ~4 px.",
      render: () => (
        <HextechButton variant="primary" medallion={<DemoMedallion />}>
          Lock In
        </HextechButton>
      ),
    },
    {
      name: "Primary — large with medallion",
      notes: "Large chevron with medallion badge.",
      render: () => (
        <HextechButton variant="primary" size="large" medallion={<DemoMedallion />}>
          Find Match
        </HextechButton>
      ),
    },
    {
      name: "Primary — disabled",
      notes: "Disabled state: grey-3 simplified teal frame, grey-2 text, no glow.",
      render: () => (
        <HextechButton variant="primary" disabled>
          Find Match
        </HextechButton>
      ),
    },

    // ---- Slanted family ----
    {
      name: "Slanted — Find Match",
      notes: "Parallelogram: both edges slanted ~12 px, teal layered border, dark fill.",
      render: () => <HextechButton variant="slanted">Find Match</HextechButton>,
    },
    {
      name: "Slanted — Lock In",
      notes: "Slanted variant.",
      render: () => <HextechButton variant="slanted">Lock In</HextechButton>,
    },
    {
      name: "Slanted — large",
      notes: 'size="large" slanted bar.',
      render: () => <HextechButton variant="slanted" size="large">League of Legends</HextechButton>,
    },
    {
      name: "Slanted — with medallion",
      notes: "Slanted variant with leading medallion badge.",
      render: () => (
        <HextechButton variant="slanted" medallion={<DemoMedallion />}>
          Lock In
        </HextechButton>
      ),
    },
    {
      name: "Slanted — disabled",
      notes: "Disabled slanted: muted frame, grey-2 text.",
      render: () => (
        <HextechButton variant="slanted" disabled>
          Find Match
        </HextechButton>
      ),
    },
  ],
};
