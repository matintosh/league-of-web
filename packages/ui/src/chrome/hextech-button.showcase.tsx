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

// ---------------------------------------------------------------------------
// Reference-replica icon helpers
// ---------------------------------------------------------------------------

function GoldCrestIcon() {
  return (
    <svg
      aria-hidden="true"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Hexagonal crest badge shape */}
      <path
        d="M12 2L20 7V17L12 22L4 17V7L12 2Z"
        fill="var(--color-gold-3)"
        stroke="var(--color-gold-2)"
        strokeWidth="1"
      />
      <path
        d="M12 6L16.5 8.75V14.25L12 17L7.5 14.25V8.75L12 6Z"
        fill="var(--color-gold-5)"
        stroke="var(--color-gold-4)"
        strokeWidth="0.5"
      />
      <circle cx="12" cy="11.5" r="2" fill="var(--color-gold-2)" />
    </svg>
  );
}

function BlueGemIcon() {
  return (
    <svg
      aria-hidden="true"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Faceted diamond/gem shape */}
      <path
        d="M12 3L20 9L16 21H8L4 9L12 3Z"
        fill="var(--color-blue-2)"
        stroke="var(--color-blue-1)"
        strokeWidth="0.5"
      />
      <path
        d="M12 3L16 9H8L12 3Z"
        fill="var(--color-blue-1)"
        opacity="0.7"
      />
      <path
        d="M8 9L12 3M16 9L12 3M8 9L10 21M16 9L14 21M8 9H16"
        stroke="var(--color-blue-1)"
        strokeWidth="0.5"
        opacity="0.5"
      />
    </svg>
  );
}

export const hextechButtonShowcase: ShowcaseEntry = {
  slug: "hextech-button",
  name: "Hextech Button",
  area: "chrome",
  description:
    "Three-family Hextech button: gold rectangle (secondary), teal chevron (primary), and parallelogram (slanted). Supports leading icon (secondary) and medallion badge (primary/slanted).",
  variants: [
    // ---- Reference replicas (top) ----
    {
      name: "Reference replica — 9900 (gold crest)",
      notes: "Matches reference: gold crest SVG icon + '9900'",
      render: () => (
        <div data-shot="gold-9900" style={{ display: "inline-block", padding: "8px 12px 12px 8px" }}>
          <HextechButton variant="secondary" size="large" icon={<GoldCrestIcon />}>
            9900
          </HextechButton>
        </div>
      ),
    },
    {
      name: "Reference replica — 4500 (blue gem)",
      notes: "Matches reference: blue gem SVG icon + '4500'",
      render: () => (
        <div data-shot="gold-4500" style={{ display: "inline-block", padding: "8px 12px 12px 8px" }}>
          <HextechButton variant="secondary" size="large" icon={<BlueGemIcon />}>
            4500
          </HextechButton>
        </div>
      ),
    },
    {
      name: "Reference replica — GoTo",
      notes: "Matches reference: GoTo text + right arrow",
      render: () => (
        <div data-shot="gold-goto" style={{ display: "inline-block", padding: "8px 12px 12px 8px" }}>
          <HextechButton variant="secondary" size="large">GoTo →</HextechButton>
        </div>
      ),
    },

    // ---- Gold family (secondary) ----
    {
      name: "Secondary — OK",
      notes: "Plain gold rectangle. No clip-path. Near-black outer/inner edges, gold gradient band (gold-2→gold-5), grey-4 charcoal fill, 4px hard drop shadow.",
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
