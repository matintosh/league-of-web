import { useId } from "react";
import type { ReactNode } from "react";

/** Size presets for ModalFrame. Default keeps the original min/max-width behavior. */
export type ModalFrameSize = "sm" | "md" | "lg";

/**
 * Clip-path polygon used on both the outer border shell and the inner surface.
 * Cuts the two bottom corners at 45° (~10px) while keeping top corners square.
 */
const CORNER_CLIP =
  "polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px))";

/** Width/max-width classes per size preset. */
const SIZE_CLASSES: Record<ModalFrameSize | "default", string> = {
  default: "min-w-[480px] max-w-[720px]",
  sm: "w-[350px]",
  md: "w-[560px]",
  lg: "w-[760px]",
};

export interface ModalFrameProps {
  /** Whether the modal is visible. When false, renders nothing. */
  open: boolean;
  /** Called when the user clicks the backdrop or the ✕ button. */
  onClose: () => void;
  /** Title displayed in the modal's title bar. */
  title: string;
  /** Modal body content. */
  children: ReactNode;
  /**
   * Optional footer content, e.g. action buttons.
   * When falsy (undefined, null, false), the footer bar is not rendered.
   */
  footer?: ReactNode;
  /**
   * Size preset. Omit to preserve original dimensions (back-compat).
   * - sm ~350px — confirm / short dialogs
   * - md ~560px — wider content panels
   * - lg ~760px — large content dialogs
   */
  size?: ModalFrameSize;
}

/**
 * ModalFrame renders a hextech-styled modal dialog over a dark backdrop.
 *
 * v2 additions: top-center gold crest ornament, bottom corner cuts (clip-path
 * wrapper technique), surface treatment (bg-grey-4/95 + backdrop-blur-sm),
 * and sm/md/lg size presets.
 *
 * Purely presentational — no internal state.
 *
 * Known limitations (out of scope):
 * - Focus trap: focus is not constrained to the modal while open.
 * - Escape key: pressing Escape does not call onClose.
 *
 * Portal note: this component renders in-place using fixed positioning
 * (no document.body portal — portals break RSC/SSG builds). For correct
 * z-index stacking, mount ModalFrame at the top level of the app shell.
 */
export function ModalFrame({
  open,
  onClose,
  title,
  children,
  footer,
  size,
}: ModalFrameProps) {
  const titleId = useId();
  const crestGradId = useId();
  const sizeKey = size ?? "default";

  if (!open) return null;

  return (
    /* Backdrop + panel wrapper — z-50 ensures modal paints above app-level fixed elements */
    <div
      className="fixed inset-0 z-50 bg-hextech-black/70"
      onClick={onClose}
    >
      {/*
       * Positioning wrapper — centered, not clipped.
       * The crest is placed here so it sits on top of the border shell
       * without being clipped by the clip-path applied below.
       */}
      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${SIZE_CLASSES[sizeKey]}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gold crest ornament — small hex shape breaking the top border */}
        <svg
          aria-hidden="true"
          className="absolute left-1/2 -translate-x-1/2 -top-[7px] z-10"
          width="24"
          height="14"
          viewBox="0 0 24 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={crestGradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-gold-4)" />
              <stop offset="100%" stopColor="var(--color-gold-3)" />
            </linearGradient>
          </defs>
          {/* Hex shape: flat-top hexagon pointing up */}
          <polygon
            points="12,0 24,6 24,8 12,14 0,8 0,6"
            fill={`url(#${crestGradId})`}
          />
          {/* Inner highlight line */}
          <polygon
            points="12,2 22,7 22,8 12,12 2,8 2,7"
            fill="none"
            stroke="var(--color-gold-3)"
            strokeWidth="0.5"
            strokeOpacity="0.6"
          />
        </svg>

        {/*
         * Outer border shell — gold-4 background + clip-path gives the cut
         * corners the appearance of a gold border at the cut edges.
         * ring-1 / border is NOT used here because clip-path would clip it.
         */}
        <div
          className="bg-gold-4 p-px"
          style={{ clipPath: CORNER_CLIP }}
        >
          {/*
           * Inner surface — same clip-path so the fill matches the shell shape.
           * bg-grey-4/95 + backdrop-blur-sm per the issue spec (Border Blur Mask).
           */}
          <div
            className="bg-grey-4/95 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            style={{ clipPath: CORNER_CLIP }}
          >
            {/* Title bar */}
            <div className="bg-blue-6 border-b border-gold-5 px-6 py-3 flex items-center justify-between">
              <span
                id={titleId}
                className="font-display uppercase text-sm tracking-widest text-gold-1"
              >
                {title}
              </span>
              <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="text-grey-1 hover:text-gold-1 transition-colors duration-150 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Content area */}
            <div className="px-6 py-5 overflow-y-auto max-h-[60vh] text-gold-1 font-body text-sm">
              {children}
            </div>

            {/* Footer (conditional) */}
            {footer && (
              <div className="border-t border-gold-5 px-6 py-4 flex justify-end gap-3">
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
