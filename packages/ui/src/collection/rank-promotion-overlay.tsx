"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface RankPromotionOverlayProps {
  /**
   * URL of the "from" (old-tier) celebration video — the ~2.4s departing-rank
   * clip that opens the sequence. Supply from `@low/fixtures`
   * `tierPromotionVideoUrl("from", tier)`. A straight-alpha webm; it is
   * composited centered over the dimmed backdrop and plays once.
   */
  fromSrc: string;
  /**
   * URL of the "to" (new-tier) celebration video — the ~4.6–6.8s arriving-rank
   * payoff that closes the sequence. Supply from `@low/fixtures`
   * `tierPromotionVideoUrl("to", tier)`. Crossfades in after `fromSrc` ends and
   * plays once; when it ends, `onFinished` fires.
   */
  toSrc: string;
  /**
   * Called exactly once when the celebration is over — either both videos
   * finished, the user skipped (click / Escape), or `prefers-reduced-motion`
   * is set (fires on mount). The consumer owns visibility: it should stop
   * rendering the overlay in response to this callback.
   */
  onFinished: () => void;
  /**
   * Accessible label for the celebration dialog and the seed of the sr-only
   * announcement (e.g. "Promoted to Gold"). The overlay is interactive-blocking
   * by design, so screen-reader users get this instead of the decorative video.
   * @default "Rank promotion"
   */
  tierLabel?: string;
  /**
   * Screen-reader hint describing how to dismiss the celebration.
   * @default "Click anywhere or press Escape to skip"
   */
  skipLabel?: string;
}

/** Fade-out duration (ms) before onFinished is called on skip. Matches the ~300ms spec. */
const FADE_MS = 300;

/**
 * RankPromotionOverlay plays the ranked tier-promotion celebration full-panel:
 * the "from" (old-tier) clip, a crossfade, then the "to" (new-tier) payoff.
 *
 * Purely presentational: the consumer owns whether it mounts (there is no live
 * promotion trigger in the client clone — this is showcase-driven today) and
 * stops rendering it in response to `onFinished`.
 *
 * Sequence (a two-video state machine):
 * - `from` autoplays once over a dimmed backdrop. On its `ended`, the machine
 *   advances to `to`, which crossfades in over `var(--motion-crossfade)` and
 *   autoplays once. On the `to` clip's `ended`, `onFinished` fires.
 * - Both clips are 1280×720 straight-alpha webms, muted/playsInline/no-loop,
 *   `object-contain` and centered so they sit over whatever surface mounts the
 *   overlay. The videos are `pointer-events-none` — the overlay itself catches
 *   the skip click.
 * - Clicking anywhere OR pressing Escape skips: the panel fades out over ~300ms,
 *   then `onFinished` fires (single idempotent path — a skip mid-`to` and the
 *   natural `to` end can't double-fire).
 * - `prefers-reduced-motion: reduce` skips the videos entirely — `onFinished` is
 *   called on mount and nothing is rendered (no celebration frame flashes).
 *
 * a11y: `role="dialog"`, labelled by `tierLabel`, interactive-blocking (it
 * covers the panel by design), with an sr-only announcement + skip hint. The
 * videos are decorative (`aria-hidden`).
 */
export function RankPromotionOverlay({
  fromSrc,
  toSrc,
  onFinished,
  tierLabel = "Rank promotion",
  skipLabel = "Click anywhere or press Escape to skip",
}: RankPromotionOverlayProps) {
  // Which clip is currently the visible/active one. `from` opens; the `from`
  // clip's onEnded advances to `to`. Sequences video playback only.
  const [phase, setPhase] = useState<"from" | "to">("from");
  // Fading drives the skip fade-out opacity transition; once true it never resets.
  const [fading, setFading] = useState(false);
  // Guards onFinished against firing twice (e.g. Escape during the `to` end).
  const finishedRef = useRef(false);

  // Begins the single skip path: fade out, then call onFinished after the
  // transition. Idempotent — repeated calls (Escape + click) are no-ops.
  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setFading(true);
    window.setTimeout(onFinished, FADE_MS);
  }, [onFinished]);

  // Natural end of the whole sequence (the `to` clip ended). No fade — the last
  // frame is the celebration payoff; hand straight off to the consumer.
  const finishImmediate = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onFinished();
  }, [onFinished]);

  // prefers-reduced-motion: detected once, synchronously, so the very first
  // render already bails to null (no celebration frame ever paints). SSR has no
  // matchMedia, so it defaults to false and the client re-evaluates on mount.
  const [prefersReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  // Under reduced motion, finish immediately on mount and render nothing.
  useEffect(() => {
    if (!prefersReduced) return;
    if (!finishedRef.current) {
      finishedRef.current = true;
      onFinished();
    }
  }, [prefersReduced, onFinished]);

  // Escape key skips (same path as click).
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [finish]);

  // Reduced motion renders nothing — the effect above already fired onFinished.
  if (prefersReduced) return null;

  const videoBase =
    "pointer-events-none absolute top-1/2 left-1/2 h-full w-full max-h-full max-w-full -translate-x-1/2 -translate-y-1/2 object-contain";
  const fade = { transition: "opacity var(--motion-crossfade)" } as const;

  return (
    <div
      role="dialog"
      aria-label={tierLabel}
      aria-modal="true"
      onClick={finish}
      className="fixed inset-0 z-[100] flex h-full w-full cursor-pointer items-center justify-center overflow-hidden bg-hextech-black/80"
      style={{ opacity: fading ? 0 : 1, transition: `opacity ${FADE_MS}ms ease-out` }}
    >
      <p aria-live="polite" className="sr-only">
        {tierLabel}
      </p>
      <span className="sr-only">{skipLabel}</span>

      {/* "From" (old tier) — plays once, then advances the machine to "to". */}
      <video
        aria-hidden="true"
        src={fromSrc}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={() => setPhase("to")}
        className={videoBase}
        style={{ ...fade, opacity: phase === "from" ? 1 : 0 }}
      />

      {/* "To" (new tier) — mounts only once the machine reaches "to" so it
          starts from frame 0; crossfades in and plays once, then finishes. */}
      {phase === "to" && (
        <video
          aria-hidden="true"
          src={toSrc}
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={finishImmediate}
          className={videoBase}
          style={{ ...fade, opacity: 1 }}
        />
      )}
    </div>
  );
}
