"use client";

import type { ButtonHTMLAttributes, ReactElement, ReactNode } from "react";

// ---------------------------------------------------------------------------
// Variant union — exhaustive Record maps will catch any missing member at build time.
// ---------------------------------------------------------------------------

export type HextechButtonVariant = "primary" | "secondary" | "slanted";
export type HextechButtonSize = "default" | "large";

// ---------------------------------------------------------------------------
// Clip-path helpers
// ---------------------------------------------------------------------------

/**
 * Pointed chevron: right edge converges to a single point at 50% height.
 * tip depth = height / 2, matching the PlayButton barPolygon pattern.
 */
function chevronPolygon(h: number): string {
  const tip = h / 2;
  return `polygon(0% 0%, calc(100% - ${tip}px) 0%, 100% 50%, calc(100% - ${tip}px) 100%, 0% 100%)`;
}

/**
 * Parallelogram: both left and right edges slanted by `skew` px.
 * Left edge: top-left offset = skew, bottom-left = 0.
 * Right edge: top-right = 100%, bottom-right = calc(100% - skew).
 */
function slantedPolygon(skew: number): string {
  return `polygon(${skew}px 0%, 100% 0%, calc(100% - ${skew}px) 100%, 0% 100%)`;
}

const SLANT = 12; // px horizontal slant for the slanted parallelogram

// ---------------------------------------------------------------------------
// Size map
// ---------------------------------------------------------------------------

interface SizeConfig {
  /** Total height of the bar element (px) */
  height: number;
  /** Tailwind padding classes for the inner button */
  paddingClass: string;
  /** Tailwind text size class */
  textClass: string;
}

const sizes: Record<HextechButtonSize, SizeConfig> = {
  // Figma-measured: 34px content box, 8px/16px padding, 12px/15px text (issue #56).
  default: { height: 34, paddingClass: "px-4 py-2", textClass: "text-xs leading-[15px]" },
  // Large scales proportionally; height and padding preserved from pre-#56 for existing consumers.
  large: { height: 56, paddingClass: "px-14 py-4", textClass: "text-base" },
};

// ---------------------------------------------------------------------------
// Public props
// ---------------------------------------------------------------------------

/**
 * HextechButton v3 — three shape families aligned to the spec sheet.
 *
 * - `primary` (default) — chevron-pointed right edge; teal layered border; hover teal glow.
 * - `secondary` — gold gradient-border rectangle: thin 2px gradient border (dark→light gold), charcoal fill, soft centered glow; hover brightens border+text, lightens fill, doubles glow. Riot production recipe (#61).
 * - `slanted` — parallelogram (both edges slanted ~12 px); teal border; hover teal glow.
 *
 * `medallion` renders a leading circular badge overlapping the left edge ~4 px.
 * Only visible on `primary` and `slanted`; absent on `secondary`.
 *
 * `className` is applied to the **outer wrapper** for layout placement.
 * `type="button"` is always set before any spread.
 */
export interface HextechButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Shape family. `"primary"` (default) — chevron; `"secondary"` — rectangle; `"slanted"` — parallelogram. */
  variant?: HextechButtonVariant;
  /** Size scale. Defaults to `"default"`. */
  size?: HextechButtonSize;
  /** Optional leading icon — rendered before children, aria-hidden. Secondary family only. */
  icon?: ReactNode;
  /**
   * Optional leading circular badge (medallion) — primary/slanted families.
   * Rendered aria-hidden, overlaps the left edge ~4 px.
   */
  medallion?: ReactNode;
}

// ---------------------------------------------------------------------------
// Shared inner-component prop shape — used by the exhaustive variant Record.
// All three sub-components accept the full set; unused fields are ignored.
// ---------------------------------------------------------------------------

interface InnerProps {
  cfg: SizeConfig;
  /** Optional leading icon — SecondaryButton only; ignored by others. */
  icon?: ReactNode;
  /** Optional medallion badge — primary/slanted only; ignored by SecondaryButton. */
  medallion?: ReactNode;
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
  buttonProps: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "disabled" | "className">;
}

// ---------------------------------------------------------------------------
// Secondary (gold gradient-border rectangle) — Riot production recipe (#61).
// Structure: wrapper div carries gradient border via background + padding (= border width);
// inner fill div sits on top. No clip-path.
//
// Default frame (computed from displays.riotgames.com):
//   Wrapper bg: linear-gradient(to top, gold-border-dark #72542A → gold-border-light #BD9E5E)
//   Border width: 2px (proportional to 34px button; 3px in reference render at higher scale)
//   Fill: grey-4 #1E2328
//   Text/icon: gold-2 #C8AA6E (production value C8AA6E = gold-2; NOT gold-cream #CDBE91 from #56)
//   Shadow: 0 0 13px 2px rgba(0,0,0,0.6) — soft centered glow
//
// Hover (three-part):
//   1. Border gradient brightens toward gold-1/gold-2 (cream tones)
//   2. Fill lightens → grey-hover #272E33
//   3. Text/icon → gold-1; glow doubles (0 0 28px hextech-black, 0 0 28px hextech-black/60)
//
// Disabled (extrapolated — no production reference):
//   Grey border gradient (grey-3→grey-4), muted text (grey-2), no glow.
//
// Pressed (extrapolated):
//   Slight fill darken via active:bg-grey-cool.
// ---------------------------------------------------------------------------

function SecondaryButton({ cfg, icon, disabled, children, className, buttonProps }: InnerProps) {
  // Border gradient: dark BOTTOM → light TOP (0deg in spec = bottom-to-top)
  const borderGradient = disabled
    ? "linear-gradient(to top, var(--color-grey-4), var(--color-grey-3))"
    : "linear-gradient(to top, var(--color-gold-border-dark), var(--color-gold-border-light))";

  // Soft centered glow (default: 0 0 13px 2px; disabled: none)
  const glowShadow = disabled
    ? "none"
    : "0 0 13px 2px rgba(1, 10, 19, 0.6)";

  return (
    // Outermost wrapper: glow + group + focus ring host
    <div
      className={[
        "group/hb inline-block",
        "transition-all duration-150",
        !disabled && [
          // Hover: doubled glow
          "hover:shadow-[0_0_28px_var(--color-hextech-black),_0_0_28px_rgba(1,10,19,0.6)]",
          "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold-2 has-[:focus-visible]:ring-offset-1",
        ].join(" "),
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ boxShadow: glowShadow }}
    >
      {/* Border layer: gradient background, padding = border width (2px) */}
      <div
        className={[
          "transition-all duration-150",
          !disabled && "group-hover/hb:[background:linear-gradient(to_top,var(--color-gold-2),var(--color-gold-1))]",
        ]
          .filter(Boolean)
          .join(" ")}
        style={{ padding: "2px", background: borderGradient }}
      >
        {/* Fill layer: covers the inner area, providing the charcoal background.
            Uses inline style for default fill (avoids Tailwind tree-shaking of bg-grey-4
            when used alongside group-hover). Hover fill change via group-hover class.
            Relative positioning supports the pressed inner-shadow overlay (item 9). */}
        <div
          className={[
            "relative transition-colors duration-150",
            !disabled && "group-hover/hb:bg-[var(--color-grey-hover)]",
          ]
            .filter(Boolean)
            .join(" ")}
          style={{ background: "var(--color-grey-4)" }}
        >
          {/* Pressed-state inner shadow — gradient overlay from top edge (item 9).
              No clip-path here so standard approach works; pointer-events:none. */}
          {!disabled && (
            <div
              className="absolute inset-0 opacity-0 group-active/hb:opacity-100 transition-opacity duration-100 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(1,10,19,0.35) 0%, rgba(1,10,19,0.08) 40%, transparent 80%)",
              }}
            />
          )}
          <button
            type="button"
            disabled={disabled}
            {...buttonProps}
            className={[
              // gap-1 = 4px — Figma-measured icon↔text gap (issue #56)
              "flex cursor-pointer items-center justify-center gap-1",
              "w-full font-display uppercase tracking-widest",
              "bg-transparent transition-colors duration-150",
              "focus-visible:outline-none",
              "disabled:cursor-not-allowed",
              cfg.paddingClass,
              cfg.textClass,
              disabled
                ? "text-grey-2"
                : "text-gold-2 group-hover/hb:text-gold-1 active:bg-grey-cool",
            ]
              .filter(Boolean)
              .join(" ")}
            style={{ height: cfg.height }}
          >
            {icon !== undefined && (
              <span aria-hidden="true" className="flex shrink-0 items-center">
                {icon}
              </span>
            )}
            {children}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Teal layered frame — shared by primary and slanted.
// Replicates the PlayButton BarFrame nested-clip technique adapted for HextechButton.
// Layer stack (all share clipStyle):
//   1. gold-4 hairline (1px) → hover gold-2
//   2. dark gap (2px)
//   3. blue-3 outer teal (2px) → hover blue-2
//   4. small gap (1px)
//   5. blue-2 inner teal (1px) → hover blue-1
//   6. surface bg-grey-4 → hover bg-grey-cool
//
// Disabled: 2-layer simplified (matches v1 disabled aesthetic).
// ---------------------------------------------------------------------------

const TEAL_FRAME_INSET = 14; // total vertical inset (matches PlayButton constant)

interface TealFrameProps {
  clipPath: string;
  height: number;
  disabled?: boolean;
  children: ReactNode;
}

function TealFrame({ clipPath, height, disabled, children }: TealFrameProps) {
  const clipStyle = { clipPath };

  if (disabled) {
    return (
      <div className="p-px bg-grey-3 transition-colors duration-150" style={clipStyle}>
        <div className="p-[6px] bg-grey-4" style={clipStyle}>
          <div style={{ ...clipStyle, height: height - TEAL_FRAME_INSET }}>{children}</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-gold-4 group-hover/hb:bg-gold-2 transition-colors duration-150"
      style={{ ...clipStyle, padding: "1px" }}
    >
      <div className="bg-blue-6" style={{ ...clipStyle, padding: "2px" }}>
        <div
          className="bg-blue-3 group-hover/hb:bg-blue-2 transition-colors duration-150"
          style={{ ...clipStyle, padding: "2px" }}
        >
          <div className="bg-blue-6" style={{ ...clipStyle, padding: "1px" }}>
            <div
              className="bg-blue-2 group-hover/hb:bg-blue-1 transition-colors duration-150"
              style={{ ...clipStyle, padding: "1px" }}
            >
              {/* Surface with inner top-edge highlight (item 7) + pressed darkening (item 9).
                  The highlight is a 1px linear gradient from slightly lighter top to fill bg.
                  The pressed overlay darkens via a gradient that fades from top; clip-path
                  on the outer wrapper means box-shadow inset is clipped — gradient is the
                  correct approach per the drop-shadow rule. */}
              <div
                className="relative bg-grey-4 group-hover/hb:bg-grey-cool transition-colors duration-150"
                style={clipStyle}
              >
                {/* Pressed-state inner shadow gradient overlay — fades dark-to-transparent
                    from the top edge downward; pointer-events:none so it doesn't block clicks. */}
                <div
                  className="absolute inset-0 opacity-0 group-active/hb:opacity-100 transition-opacity duration-100 pointer-events-none"
                  style={{
                    clipPath,
                    background:
                      "linear-gradient(to bottom, rgba(1,10,19,0.35) 0%, rgba(1,10,19,0.08) 40%, transparent 80%)",
                  }}
                />
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Primary (chevron) button
// ---------------------------------------------------------------------------

function ChevronButton({ cfg, medallion, disabled, children, className, buttonProps }: InnerProps) {
  const clip = chevronPolygon(cfg.height);
  // Medallion overlaps the bar by 4px on the left
  const medalOverlap = medallion ? 4 : 0;

  return (
    <div
      className={[
        "group/hb inline-flex items-center",
        "transition-all duration-150",
        disabled
          ? "[filter:none]"
          : [
              "hover:[filter:drop-shadow(0_0_10px_var(--color-blue-2))]",
              "active:[filter:none]",
              "has-[:focus-visible]:[filter:drop-shadow(0_0_8px_var(--color-gold-2))]",
              "has-[:disabled]:[filter:none]",
            ].join(" "),
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Medallion — z-10 so it overlaps the bar frame left edge */}
      {medallion && (
        <div aria-hidden="true" className="relative z-10 shrink-0" style={{ marginRight: -medalOverlap }}>
          {medallion}
        </div>
      )}

      <TealFrame clipPath={clip} height={cfg.height} disabled={disabled}>
        <button
          type="button"
          disabled={disabled}
          {...buttonProps}
          className={[
            "flex cursor-pointer items-center justify-center",
            "font-display uppercase tracking-widest",
            "transition-colors duration-150",
            "focus-visible:outline-none",
            "disabled:cursor-not-allowed",
            cfg.textClass,
            disabled ? "text-grey-2" : "text-gold-1 hover:text-gold-2 active:text-gold-3",
          ]
            .filter(Boolean)
            .join(" ")}
          style={{
            height: cfg.height - TEAL_FRAME_INSET,
            paddingLeft: medalOverlap + 32,
            paddingRight: 32 + cfg.height / 2, // right padding accounts for the tip depth
          }}
        >
          {children}
        </button>
      </TealFrame>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Slanted (parallelogram) button
// ---------------------------------------------------------------------------

function SlantedButton({ cfg, medallion, disabled, children, className, buttonProps }: InnerProps) {
  const clip = slantedPolygon(SLANT);
  const medalOverlap = medallion ? 4 : 0;

  return (
    <div
      className={[
        "group/hb inline-flex items-center",
        "transition-all duration-150",
        disabled
          ? "[filter:none]"
          : [
              "hover:[filter:drop-shadow(0_0_10px_var(--color-blue-2))]",
              "active:[filter:none]",
              "has-[:focus-visible]:[filter:drop-shadow(0_0_8px_var(--color-gold-2))]",
              "has-[:disabled]:[filter:none]",
            ].join(" "),
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Medallion — overlaps bar left edge */}
      {medallion && (
        <div aria-hidden="true" className="relative z-10 shrink-0" style={{ marginRight: -medalOverlap }}>
          {medallion}
        </div>
      )}

      <TealFrame clipPath={clip} height={cfg.height} disabled={disabled}>
        <button
          type="button"
          disabled={disabled}
          {...buttonProps}
          className={[
            "flex cursor-pointer items-center justify-center",
            "font-display uppercase tracking-widest",
            "transition-colors duration-150",
            "focus-visible:outline-none",
            "disabled:cursor-not-allowed",
            cfg.textClass,
            disabled ? "text-grey-2" : "text-gold-1 hover:text-gold-2 active:text-gold-3",
          ]
            .filter(Boolean)
            .join(" ")}
          style={{
            height: cfg.height - TEAL_FRAME_INSET,
            paddingLeft: SLANT + 24 + medalOverlap,
            paddingRight: SLANT + 24,
          }}
        >
          {children}
        </button>
      </TealFrame>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Exhaustive variant map — a future fourth variant will fail typecheck here.
// ---------------------------------------------------------------------------

const VARIANT_COMPONENTS: Record<HextechButtonVariant, (props: InnerProps) => ReactElement> = {
  primary: ChevronButton,
  secondary: SecondaryButton,
  slanted: SlantedButton,
};

// ---------------------------------------------------------------------------
// Public HextechButton — routes to the appropriate shape sub-component.
// ---------------------------------------------------------------------------

export function HextechButton({
  variant = "primary",
  size = "default",
  icon,
  medallion,
  className,
  disabled,
  children,
  ...props
}: HextechButtonProps) {
  const cfg = sizes[size];
  const Variant = VARIANT_COMPONENTS[variant];

  return (
    <Variant
      cfg={cfg}
      icon={icon}
      medallion={medallion}
      disabled={disabled}
      className={className}
      buttonProps={props}
    >
      {children}
    </Variant>
  );
}
