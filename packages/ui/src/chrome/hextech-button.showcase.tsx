import type { ShowcaseEntry } from "../showcase";
import { CrossMedallion, HextechButton } from "./hextech-button";

// ---------------------------------------------------------------------------
// Inline icon helpers for demo purposes
// ---------------------------------------------------------------------------

function CoinIcon() {
  return (
    // 12×12 slot — Figma-measured icon size (issue #56). Color = gold-coin (#DEB53C).
    <svg
      aria-hidden="true"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ color: "var(--color-gold-coin)" }}
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

/** Reference cross-circle medallion sized to the default (34px) bar. */
function DemoMedallion() {
  return <CrossMedallion size={40} />;
}

// ---------------------------------------------------------------------------
// Reference-replica icon helpers
// ---------------------------------------------------------------------------

function GoldCrestIcon() {
  return (
    <svg
      aria-hidden="true"
      width="12"
      height="12"
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
      width="12"
      height="12"
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
    "Three-family Hextech button: gold rectangle (secondary), teal chevron (primary), and parallelogram (slanted). Supports leading icon (secondary) and medallion badge (primary/slanted). CrossMedallion is the v14 cross-circle cancel badge (gold ring + ✕ over dark fill).",
  variants: [
    // ---- CrossMedallion — v14 cross-circle cancel badge (issue #337) ----
    {
      name: "CrossMedallion — cross-circle cancel (v14)",
      notes:
        "Gold ring + centered ✕ over dark Hextech fill (grey-4). Ring gold-3→gold-4→gold-5 top-lit gradient, cross gold-cream. Standalone cancel affordance (lobby footer, left of FIND MATCH). Compare vs docs/reference/client-find-match-shape-v14.png left circle. Default size 56.",
      render: () => (
        <div data-shot="cross-medallion" style={{ display: "inline-block", padding: 12 }}>
          <button
            type="button"
            aria-label="Cancel"
            className="group/hb block cursor-pointer rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3 [filter:none] hover:[filter:drop-shadow(0_0_6px_var(--color-gold-4))]"
          >
            <CrossMedallion />
          </button>
        </div>
      ),
    },
    {
      name: "CrossMedallion — hover",
      notes:
        "Hover brightens ring+cross via a layer crossfade (two stacked idle/bright states, opacity transition on --motion-crossfade), NOT a single-element restyle. Hover the badge in /showcase to see the brighten; the .group/hb host drives it.",
      render: () => (
        <div data-shot="cross-medallion-hover" style={{ display: "inline-block", padding: 12 }}>
          <button
            type="button"
            aria-label="Cancel"
            className="group/hb block cursor-pointer rounded-full [filter:none] hover:[filter:drop-shadow(0_0_8px_var(--color-gold-3))]"
          >
            <CrossMedallion />
          </button>
        </div>
      ),
    },
    {
      name: "CrossMedallion — disabled",
      notes: "Greyed ring (grey-3) + grey-2 cross, no hover brighten. Inert styling only.",
      render: () => (
        <div data-shot="cross-medallion-disabled" style={{ display: "inline-block", padding: 12 }}>
          <CrossMedallion disabled />
        </div>
      ),
    },
    {
      name: "CrossMedallion — sizes",
      notes: "Scales cleanly: ring/cross proportions hold from 32→72px.",
      render: () => (
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <CrossMedallion size={32} />
          <CrossMedallion size={40} />
          <CrossMedallion size={56} />
          <CrossMedallion size={72} />
        </div>
      ),
    },
    {
      name: "CrossMedallion — in HextechButton medallion slot",
      notes:
        "Drops into the existing medallion?: ReactNode slot (primary/slanted). Additive — no change to existing props.",
      render: () => (
        <HextechButton variant="primary" medallion={<CrossMedallion size={40} />}>
          Cancel
        </HextechButton>
      ),
    },

    // ---- Reference replicas (top) — exact Figma metrics: 34px, 8/16 pad, 4px gap, 12px icon ----
    {
      name: "Reference replica — 9900 (gold crest)",
      notes: "Riot production recipe: 2px gradient border (gold-border-dark→gold-border-light), grey-4 fill, gold-2 text, soft 13px glow. Metrics: 34px height, px-4 py-2, gap-1, 12px icon (issues #56 + #61)",
      render: () => (
        <div data-shot="gold-9900" style={{ display: "inline-block", padding: "8px 12px 12px 8px" }}>
          <HextechButton variant="secondary" icon={<GoldCrestIcon />}>
            9900
          </HextechButton>
        </div>
      ),
    },
    {
      name: "Reference replica — 9900 Hover (forced)",
      notes: "Hover (forced static classes) — border brightens gold-2→gold-1, fill→grey-hover, text→gold-1, glow doubles. Compare vs docs/reference/riot-prod-gold-button-hover.png",
      render: () => (
        // Force hover classes statically so we can screenshot without Playwright hover
        <div data-shot="gold-hover-demo" style={{ display: "inline-block", padding: "8px 12px 12px 8px" }}>
          <div
            style={{
              display: "inline-block",
              boxShadow: "0 0 28px var(--color-hextech-black), 0 0 28px rgba(1,10,19,0.6)",
            }}
          >
            <div
              style={{
                padding: "2px",
                background: "linear-gradient(to top, var(--color-gold-2), var(--color-gold-1))",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                  height: 34,
                  padding: "8px 16px",
                  background: "var(--color-grey-hover)",
                  fontFamily: "var(--font-display)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontSize: "0.75rem",
                  lineHeight: "15px",
                  color: "var(--color-gold-1)",
                  cursor: "pointer",
                }}
              >
                <span aria-hidden="true" style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                  <GoldCrestIcon />
                </span>
                9900
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      name: "Reference replica — 4500 (blue gem)",
      notes: "Exact Figma metrics: 34px content height, 8/16px padding, 4px gap, 12px icon slot (issue #56)",
      render: () => (
        <div data-shot="gold-4500" style={{ display: "inline-block", padding: "8px 12px 12px 8px" }}>
          <HextechButton variant="secondary" icon={<BlueGemIcon />}>
            4500
          </HextechButton>
        </div>
      ),
    },
    {
      name: "Reference replica — GoTo",
      notes: "Exact Figma metrics: 34px content height, 8/16px padding (issue #56)",
      render: () => (
        <div data-shot="gold-goto" style={{ display: "inline-block", padding: "8px 12px 12px 8px" }}>
          <HextechButton variant="secondary">GoTo →</HextechButton>
        </div>
      ),
    },

    // ---- Gold family (secondary) — Riot production recipe (issue #61) ----
    {
      name: "Secondary — OK",
      notes: "Riot production: 2px gradient border (gold-border-dark→gold-border-light), grey-4 fill, gold-2 text, soft glow. Hover: border→gold-1/gold-2, fill→grey-hover, text→gold-1, glow doubles.",
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
