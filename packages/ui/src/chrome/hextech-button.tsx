import type { ButtonHTMLAttributes, ReactNode } from "react";

export type HextechButtonVariant = "primary" | "secondary";
export type HextechButtonSize = "default" | "large";

/**
 * Hextech-styled button with notched (45° cut) corners.
 *
 * `className` is applied to the **outer wrapper**, not the inner `<button>` —
 * use it for layout placement (width, flex/grid position).
 */
export interface HextechButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary = gold border + blue gradient (PLAY, confirm). secondary = muted outline. */
  variant?: HextechButtonVariant;
  /** large is used for the PLAY button. */
  size?: HextechButtonSize;
  /** Optional leading icon — rendered before children, aria-hidden. */
  icon?: ReactNode;
}

// ---------------------------------------------------------------------------
// Notched clip-path: 6px 45° cuts on top-left and bottom-right corners.
// Applied identically to both the outer (border) wrapper and inner (surface).
// ---------------------------------------------------------------------------
const CLIP =
  "polygon(6px 0%, 100% 0%, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0% 100%, 0% 6px)";

// ---------------------------------------------------------------------------
// Outer wrapper carries the "border" as its background fill.
// 1px padding all sides → inner surface is inset by exactly 1px.
// Uses Tailwind group so the button's focus/hover/active/disabled state
// can drive the wrapper colour via group-* variants.
// pointer-events flow naturally: div receives none of its own mouse events
// (it has no interactive role), the inner button gets them all.
//
// CSS filters (drop-shadow) are composited AFTER clip-path, so the glow
// follows the notched silhouette without any rectangular bleed.
// ---------------------------------------------------------------------------
const wrapperBase = "group/hb inline-block p-px transition-all duration-150";

// Variant maps: keyed Record so adding a new variant is caught by typecheck.
const wrapperVariants: Record<HextechButtonVariant, string> = {
  primary: [
    "bg-gold-4",                                                                     // default border
    "group-hover/hb:bg-gold-2",                                                      // hover → brighter gold
    "group-hover/hb:[filter:drop-shadow(0_0_8px_var(--color-blue-2))]",             // hover → teal glow (drop-shadow follows clip-path silhouette)
    "group-active/hb:bg-gold-3",                                                     // pressed → mid gold
    "group-active/hb:[filter:none]",                                                 // pressed → suppress glow
    "has-[:disabled]:bg-grey-3",                                                     // disabled → muted border
    "has-[:disabled]:[filter:none]",
    "has-[:focus-visible]:[filter:drop-shadow(0_0_6px_var(--color-gold-2))]",       // focus → gold glow indicator
  ].join(" "),
  secondary: [
    "bg-grey-3",
    "group-hover/hb:bg-gold-4",
    "group-active/hb:bg-gold-3",                                                     // pressed surface on inner, border recolor on outer
    "has-[:disabled]:bg-grey-3",
    "has-[:disabled]:[filter:none]",
    "has-[:focus-visible]:[filter:drop-shadow(0_0_6px_var(--color-gold-2))]",       // focus → gold glow indicator
  ].join(" "),
};

// ---------------------------------------------------------------------------
// Inner surface — inherits clip-path independently so both layers are clipped.
// Button carries all interactive state classes.
// ---------------------------------------------------------------------------
const buttonBase = [
  "flex w-full cursor-pointer items-center justify-center gap-2",
  "font-display uppercase tracking-widest",
  "transition-all duration-150",
  "disabled:cursor-not-allowed",
  "focus-visible:outline-none",  // suppress native outline; wrapper drop-shadow is the visible focus indicator
].join(" ");

const buttonVariants: Record<HextechButtonVariant, string> = {
  primary: [
    "bg-linear-to-b from-blue-6 to-blue-7 text-gold-2",
    "hover:text-gold-1",
    "active:bg-blue-7 active:from-blue-7 active:to-blue-7 active:text-blue-4",     // pressed: flatten surface, shift text to blue accent
    "disabled:bg-grey-4 disabled:bg-none disabled:from-transparent disabled:to-transparent disabled:text-grey-2",
  ].join(" "),
  secondary: [
    "bg-transparent text-grey-1",
    "hover:text-gold-1",
    "active:text-gold-3",
    "disabled:text-grey-2",
  ].join(" "),
};

const sizes: Record<HextechButtonSize, string> = {
  default: "px-8 py-2.5 text-sm",
  large: "px-14 py-4 text-base",
};

export function HextechButton({
  variant = "primary",
  size = "default",
  icon,
  className,
  disabled,
  children,
  ...props
}: HextechButtonProps) {
  return (
    <div
      className={`${wrapperBase} ${wrapperVariants[variant]}${className ? ` ${className}` : ""}`}
      style={{ clipPath: CLIP }}
    >
      <button
        disabled={disabled}
        className={`${buttonBase} ${buttonVariants[variant]} ${sizes[size]}`}
        style={{ clipPath: CLIP }}
        {...props}
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
