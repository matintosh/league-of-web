import { useId } from "react";
import type { ReactNode } from "react";

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
}

/**
 * ModalFrame renders a hextech-styled modal dialog over a dark backdrop.
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
}: ModalFrameProps) {
  const titleId = useId();

  if (!open) return null;

  return (
    /* Backdrop + panel wrapper — z-50 ensures modal paints above app-level fixed elements */
    <div
      className="fixed inset-0 z-50 bg-hextech-black/70"
      onClick={onClose}
    >
      {/* Panel — stopPropagation prevents backdrop click from firing when clicking inside */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-7 border border-gold-4 ring-1 ring-gold-5 min-w-[480px] max-w-[720px]"
        onClick={(e) => e.stopPropagation()}
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
  );
}
