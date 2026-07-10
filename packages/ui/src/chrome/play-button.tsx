import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface PlayButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Defaults to "Play" */
  children?: ReactNode;
}

// ---------------------------------------------------------------------------
// Notched clip-path: 45° cut on top-right corner only.
// Applied to both the outer "border" wrapper and the inner <button> surface.
// ---------------------------------------------------------------------------
const BAR_CLIP =
  "polygon(0% 0%, calc(100% - 8px) 0%, 100% 8px, 100% 100%, 0% 100%)";

// ---------------------------------------------------------------------------
// Stylized angular 'L' glyph SVG — original design, not trademarked.
// Rendered inside the medallion, aria-hidden because button text carries meaning.
// ---------------------------------------------------------------------------
function LeagueGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      {/* Bold angular 'L' with a serif foot — stylised hextech monogram */}
      <path d="M5 2h3v12.5h6.5V17H5V2z" />
      <path d="M11.5 14.5h3v2.5h-3v-2.5z" />
    </svg>
  );
}

/**
 * PlayButton — medallion + notched bar CTA used in the client navbar.
 *
 * Composition: an outer `<div>` is the `group/pb` anchor and carries the
 * drop-shadow glow filter (must be unclipped for drop-shadow to render).
 * The `<button>` element sits inside the clipped bar section.
 *
 * `className` is applied to the **outer wrapper**, not the inner `<button>` —
 * use it for layout placement (width, flex/grid position).
 */
export function PlayButton({ children, disabled, className, ...props }: PlayButtonProps) {
  return (
    <div
      className={[
        "inline-flex items-center group/pb",
        "transition-all duration-150",
        "group-hover/pb:[filter:drop-shadow(0_0_12px_var(--color-blue-2))]",
        "group-active/pb:[filter:none]",
        "has-[:focus-visible]:[filter:drop-shadow(0_0_6px_var(--color-gold-2))]",
        "has-[:disabled]:[filter:none]",
        className,
      ].filter(Boolean).join(" ")}
    >
      {/* Medallion: purely visual, no interactivity of its own */}
      <div
        aria-hidden="true"
        className={[
          "relative z-10 flex h-[42px] w-[42px] shrink-0 items-center justify-center",
          "rounded-full border-2 border-gold-3 bg-blue-6",
          "group-hover/pb:border-gold-2",
          "group-active/pb:border-gold-3",
          "group-has-[:disabled]/pb:border-grey-3",
          "transition-colors duration-150",
        ].join(" ")}
      >
        <LeagueGlyph className="h-5 w-5 text-gold-2" />
      </div>

      {/* Bar outer wrapper: carries the 1px "border" color via bg fill + p-px */}
      <div
        className={[
          "-ml-2 p-px",
          "bg-blue-5",
          "group-hover/pb:bg-blue-2",
          "group-active/pb:bg-blue-5",
          "has-[:disabled]:bg-grey-3",
          "transition-colors duration-150",
        ].join(" ")}
        style={{ clipPath: BAR_CLIP }}
      >
        {/* Bar inner: the actual <button> element */}
        <button
          type="button"
          disabled={disabled}
          {...props}
          className={[
            "flex h-[32px] min-w-[120px] cursor-pointer items-center justify-center px-5",
            "bg-grey-4 font-display text-sm uppercase tracking-widest text-gold-1",
            "active:bg-hextech-black active:text-gold-3",
            "disabled:cursor-not-allowed disabled:bg-grey-4 disabled:text-grey-2",
            "focus-visible:outline-none",
            "transition-colors duration-150",
          ].join(" ")}
          style={{ clipPath: BAR_CLIP }}
        >
          {children ?? "Play"}
        </button>
      </div>
    </div>
  );
}
