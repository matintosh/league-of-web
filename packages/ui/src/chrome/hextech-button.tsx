"use client";

import { useId } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

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
  default: { height: 36, paddingClass: "px-8 py-2.5", textClass: "text-sm" },
  large: { height: 56, paddingClass: "px-14 py-4", textClass: "text-base" },
};

// ---------------------------------------------------------------------------
// Public props
// ---------------------------------------------------------------------------

/**
 * HextechButton v3 — three shape families aligned to the spec sheet.
 *
 * - `secondary` (default) — plain gold rectangle; hover border brightens to gold-2.
 * - `primary` — chevron-pointed right edge; teal layered border; hover teal glow.
 * - `slanted` — parallelogram (both edges slanted ~12 px); teal border; hover teal glow.
 *
 * `medallion` renders a leading circular badge overlapping the left edge ~4 px.
 * Only visible on `primary` and `slanted`; absent on `secondary`.
 *
 * `className` is applied to the **outer wrapper** for layout placement.
 * `type="button"` is always set before any spread.
 */
export interface HextechButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Shape family. Defaults to `"primary"`. */
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
// Secondary (gold rectangle) — no clip-path needed.
// Outer div carries the 1px border via Tailwind; inner button is the fill.
// No need for the wrapper-technique clip — a plain border works on an unclipped rect.
// ---------------------------------------------------------------------------

interface SecondaryButtonProps {
  cfg: SizeConfig;
  icon?: ReactNode;
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
  buttonProps: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "disabled" | "className">;
}

function SecondaryButton({ cfg, icon, disabled, children, className, buttonProps }: SecondaryButtonProps) {
  return (
    <div
      className={[
        "group/hb inline-block",
        "border transition-colors duration-150",
        disabled
          ? "border-grey-3"
          : "border-gold-4 hover:border-gold-2 has-[:focus-visible]:border-gold-2",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <button
        type="button"
        disabled={disabled}
        {...buttonProps}
        className={[
          "flex w-full cursor-pointer items-center justify-center gap-2",
          "font-display uppercase tracking-widest",
          "transition-colors duration-150",
          "focus-visible:outline-none",
          "disabled:cursor-not-allowed",
          cfg.paddingClass,
          cfg.textClass,
          disabled
            ? "bg-grey-4 text-grey-2"
            : "bg-blue-7 text-gold-2 hover:text-gold-1 active:bg-blue-6 active:text-gold-3",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {icon !== undefined && (
          <span aria-hidden="true" className="flex shrink-0 items-center">
            {icon}
          </span>
        )}
        {children}
      </button>
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
              <div
                className="bg-grey-4 group-hover/hb:bg-grey-cool transition-colors duration-150"
                style={clipStyle}
              >
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

interface ChevronButtonProps {
  cfg: SizeConfig;
  medallion?: ReactNode;
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
  buttonProps: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "disabled" | "className">;
}

function ChevronButton({ cfg, medallion, disabled, children, className, buttonProps }: ChevronButtonProps) {
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

interface SlantedButtonProps {
  cfg: SizeConfig;
  medallion?: ReactNode;
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
  buttonProps: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "disabled" | "className">;
}

function SlantedButton({ cfg, medallion, disabled, children, className, buttonProps }: SlantedButtonProps) {
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

  if (variant === "secondary") {
    return (
      <SecondaryButton
        cfg={cfg}
        icon={icon}
        disabled={disabled}
        className={className}
        buttonProps={props}
      >
        {children}
      </SecondaryButton>
    );
  }

  if (variant === "slanted") {
    return (
      <SlantedButton
        cfg={cfg}
        medallion={medallion}
        disabled={disabled}
        className={className}
        buttonProps={props}
      >
        {children}
      </SlantedButton>
    );
  }

  // primary (default)
  return (
    <ChevronButton
      cfg={cfg}
      medallion={medallion}
      disabled={disabled}
      className={className}
      buttonProps={props}
    >
      {children}
    </ChevronButton>
  );
}
