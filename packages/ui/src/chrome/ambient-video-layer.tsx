// ---------------------------------------------------------------------------
// AmbientVideoLayer — the client's "magic" layer (issue #302)
//
// The real client renders its ethereal/animated backdrops as HTML5 <video>
// webm loops (per docs/reference/HEXTECH-UI-NOTES.md — Riot uses video for
// "ethereal, magical effects"). This primitive is that layer, distilled: an
// absolutely-positioned, non-interactive <video> that sits BEHIND content and
// plays a muted ambient loop.
//
// Contract (issue #302):
//   - Presentational: takes a `src` URL; never fetches or builds URLs. Pages /
//     shell supply the URL from @low/fixtures (partiesBgLoopUrl, etc.).
//   - Additive & non-regressing: it renders on top of whatever static
//     background already exists (it does not paint one). When `src` is absent
//     the component renders nothing, so the static look is untouched.
//   - `prefers-reduced-motion: reduce` hides the video layer entirely
//     (`motion-reduce:hidden` — pure CSS, SSR-safe, no first-frame flash).
//   - No layout shift: absolutely positioned, `inset-0`, pointer-events-none.
//
// Attributes: <video autoPlay loop muted playsInline preload="none"> — the
// exact spec for an ambient bg loop (no download until it can play, silent,
// self-restarting, inline on mobile).
// ---------------------------------------------------------------------------

export interface AmbientVideoLayerProps {
  /**
   * Ambient loop webm URL, supplied by the page/shell from @low/fixtures
   * (e.g. `partiesBgLoopUrl("queue-delay")`). When omitted the layer renders
   * nothing — the underlying static background shows through unchanged.
   */
  src?: string;
  /**
   * Opacity of the video layer, 0–1. The real-client loops are subtle overlays
   * on top of the static art; keep this low so the layer reads as ambience.
   * @default 0.5
   */
  opacity?: number;
  /**
   * CSS `object-fit` for the video within the layer box.
   * @default "cover"
   */
  objectFit?: "cover" | "contain";
  /**
   * CSS `mix-blend-mode` for compositing the loop over the static background.
   * The parties loops are bright-on-dark Hextech glows; "screen" lets the dark
   * areas drop out so only the glow adds. Omit for normal compositing.
   * @default "screen"
   */
  blendMode?: "normal" | "screen" | "lighten" | "plus-lighter";
  /**
   * Extra classes appended to the layer's positioning container — e.g. a
   * `rounded-*` to clip the video to a panel's corners, or a custom `z-*`.
   * The base classes already set `absolute inset-0`, so callers usually only
   * pass border-radius / z-index tweaks.
   */
  className?: string;
}

/**
 * AmbientVideoLayer renders a subtle, looping ambient video behind content —
 * the client's "magic" backdrop layer.
 *
 * Drop it as the FIRST child of a `relative` container; content that follows
 * must establish its own stacking (e.g. `relative z-10`) to sit above it. The
 * layer is `pointer-events-none` and `aria-hidden`, so it never intercepts
 * clicks or reaches assistive tech.
 *
 * Renders `null` when `src` is absent (additive: the static background stays).
 * Hidden entirely under `prefers-reduced-motion: reduce`.
 */
export function AmbientVideoLayer({
  src,
  opacity = 0.5,
  objectFit = "cover",
  blendMode = "screen",
  className,
}: AmbientVideoLayerProps) {
  if (!src) return null;

  return (
    <div
      aria-hidden="true"
      className={[
        // Behind content, fills the container, never interactive, and fully
        // suppressed when the user prefers reduced motion.
        "pointer-events-none absolute inset-0 z-0 overflow-hidden",
        "motion-reduce:hidden",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ opacity, mixBlendMode: blendMode }}
    >
      <video
        // `key` on src so swapping the URL remounts and restarts the loop
        // cleanly (React reuses the element otherwise and can stall on webm).
        key={src}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        preload="none"
        className="h-full w-full"
        style={{ objectFit }}
      />
    </div>
  );
}
