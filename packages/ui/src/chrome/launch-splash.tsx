"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface LaunchSplashProps {
  /**
   * Source URL of the ident video (webm/mp4). The real client plays the Riot
   * Games ident animation on launch; supply the served asset path here, e.g.
   * "/media/riot-splash-jinx.webm".
   */
  videoSrc: string;
  /**
   * Called once the splash has finished — either the video ended, the user
   * skipped (click / Escape), or `prefers-reduced-motion` is set (fires on
   * mount). The shell owns visibility: it should stop rendering LaunchSplash
   * in response to this callback.
   */
  onFinished: () => void;
  /**
   * Screen-reader hint describing how to dismiss the splash.
   * @default "Click anywhere or press Escape to skip"
   */
  skipLabel?: string;
}

/** Fade-out duration (ms) before onFinished is called. Matches the ~300ms spec. */
const FADE_MS = 300;

/**
 * LaunchSplash plays the Riot Games ident video full-screen on app launch,
 * then reveals the client underneath.
 *
 * Purely presentational: the shell owns whether it mounts (nav-surviving
 * launch state lives in the shell, not here). Every hard reload is a launch;
 * client-side navigations never remount it.
 *
 * Behaviour:
 * - Video plays once (`autoPlay muted playsInline`, no loop), object-contain
 *   centered over a white field (the ident artwork sits on white).
 * - When the video ends, OR the user clicks anywhere, OR presses Escape, the
 *   overlay fades out over ~300ms and then calls `onFinished` (single path).
 * - `prefers-reduced-motion: reduce` skips the splash entirely — `onFinished`
 *   is called on mount and nothing is shown.
 *
 * a11y: the overlay is a `role="dialog"` labelled "Launch" with an sr-only
 * skip hint. The video is decorative (`aria-hidden`).
 */
export function LaunchSplash({ videoSrc, onFinished, skipLabel = "Click anywhere or press Escape to skip" }: LaunchSplashProps) {
  // Fading drives the fade-out opacity transition; once true it never resets.
  const [fading, setFading] = useState(false);
  // Guards onFinished against firing twice (e.g. Escape during an ended fade).
  const finishedRef = useRef(false);

  // Begins the single dismissal path: fade out, then call onFinished after the
  // transition. Idempotent — repeated calls (video ended + click) are no-ops.
  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setFading(true);
    window.setTimeout(onFinished, FADE_MS);
  }, [onFinished]);

  // prefers-reduced-motion: skip the splash entirely on mount.
  const reducedMotionSkipped = useRef(false);
  useEffect(() => {
    if (reducedMotionSkipped.current) return;
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      reducedMotionSkipped.current = true;
      // Call directly (no fade) so no ident frame flashes for reduced-motion users.
      if (!finishedRef.current) {
        finishedRef.current = true;
        onFinished();
      }
    }
  }, [onFinished]);

  // Escape key skips (same path as click / ended).
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [finish]);

  return (
    <div
      role="dialog"
      aria-label="Launch"
      onClick={finish}
      className="fixed inset-0 z-[100] flex h-full w-full cursor-pointer items-center justify-center"
      style={{
        // The ident artwork sits on a white field — `white` keyword is the
        // ledger-approved exception (no white design token exists).
        background: "white",
        opacity: fading ? 0 : 1,
        transition: `opacity ${FADE_MS}ms ease-out`,
      }}
    >
      <span className="sr-only">{skipLabel}</span>
      <video
        aria-hidden="true"
        src={videoSrc}
        autoPlay
        muted
        playsInline
        onEnded={finish}
        className="h-full w-full object-contain"
      />
    </div>
  );
}
