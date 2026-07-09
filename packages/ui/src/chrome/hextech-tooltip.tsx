import type { ReactNode } from "react";

/** Which side the tooltip panel appears on relative to the trigger. */
export type HextechTooltipPosition = "top" | "bottom";

export interface HextechTooltipProps {
  /** The tooltip label or content panel — accepts any ReactNode. */
  content: ReactNode;
  /** Which side the panel appears on. Defaults to "top". */
  position?: HextechTooltipPosition;
  /** The element that triggers the tooltip on hover/focus. */
  children: ReactNode;
}

/**
 * General-purpose CSS-only tooltip.
 *
 * Wraps any child and shows a dark floating panel above (default) or below it
 * on hover/focus-within — implemented entirely with Tailwind `group-hover` and
 * `group-focus-within`, no useState or useEffect.
 */
export function HextechTooltip({
  content,
  position = "top",
  children,
}: HextechTooltipProps) {
  const isTop = position === "top";

  return (
    <div className="group relative inline-block">
      {/* Tooltip panel */}
      <div
        role="tooltip"
        className={[
          // Layout + positioning
          "pointer-events-none absolute left-1/2 z-50 -translate-x-1/2",
          isTop ? "bottom-full mb-2" : "top-full mt-2",
          // Visual
          "w-max max-w-xs border border-gold-4 bg-blue-7 px-3 py-2",
          // Typography
          "font-body text-sm text-gold-1",
          // Reveal: hidden by default, shown on group hover or keyboard focus
          "opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100",
        ].join(" ")}
      >
        {content}

        {/* Caret arrow — points toward the trigger */}
        {isTop ? (
          // Caret points down (toward trigger below)
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-full -translate-x-1/2 border-x-6 border-t-6 border-x-transparent border-t-gold-4"
          />
        ) : (
          // Caret points up (toward trigger above)
          <span
            aria-hidden="true"
            className="absolute bottom-full left-1/2 -translate-x-1/2 border-x-6 border-b-6 border-x-transparent border-b-gold-4"
          />
        )}
      </div>

      {/* Trigger */}
      {children}
    </div>
  );
}
