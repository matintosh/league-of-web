"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface LaunchSplashProps {
  /**
   * Source URL of the ident video (webm/mp4). The real client plays the Riot
   * Games ident animation on launch; supply the served asset path here, e.g.
   * "/media/riot-splash-jinx.webm". Must be same-origin (or CORS-enabled) —
   * the dark-background treatment reads video pixels through a canvas.
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
 * - The ident artwork is delivered on a baked white field. To sit it on the
 *   Hextech dark background, frames are white-keyed through a canvas
 *   (alpha = 255 − min(r,g,b): white → transparent, inks/flames keep body)
 *   and composited over a blue-5 → blue-8 → hextech-black radial.
 * - The source video plays once (`autoPlay muted playsInline`, no loop),
 *   hidden; the canvas mirrors it at the displayed size.
 * - If pixel access is unavailable (no 2d context, cross-origin taint), the
 *   raw video is shown instead on its native white field — never a blank
 *   screen.
 * - When the video ends, OR the user clicks anywhere, OR presses Escape, the
 *   overlay fades out over ~300ms and then calls `onFinished` (single path).
 * - `prefers-reduced-motion: reduce` skips the splash entirely — `onFinished`
 *   is called on mount and nothing is shown.
 *
 * a11y: the overlay is a `role="dialog"` labelled "Launch" with an sr-only
 * skip hint. The video/canvas are decorative (`aria-hidden`).
 */
export function LaunchSplash({ videoSrc, onFinished, skipLabel = "Click anywhere or press Escape to skip" }: LaunchSplashProps) {
  // Fading drives the fade-out opacity transition; once true it never resets.
  const [fading, setFading] = useState(false);
  // Keying failed (taint / no context) — fall back to the raw white video.
  const [keyingFailed, setKeyingFailed] = useState(false);
  // Guards onFinished against firing twice (e.g. Escape during an ended fade).
  const finishedRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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

  // White-key render loop: mirror the hidden video onto the canvas each frame
  // with white mapped to transparency, sized to the video's contain-fit box.
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) {
      setKeyingFailed(true);
      return;
    }
    let raf = 0;

    const fitCanvas = () => {
      if (!video.videoWidth || !video.videoHeight) return;
      // object-contain box of the video inside the viewport, capped at native
      // size — keying cost scales with the pixel count we actually display.
      const scale = Math.min(
        window.innerWidth / video.videoWidth,
        window.innerHeight / video.videoHeight,
        1,
      );
      canvas.width = Math.round(video.videoWidth * scale);
      canvas.height = Math.round(video.videoHeight * scale);
    };

    const draw = () => {
      raf = window.requestAnimationFrame(draw);
      if (!video.videoWidth || canvas.width === 0) return;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      try {
        const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const d = frame.data;
        for (let i = 0; i < d.length; i += 4) {
          // White field → transparent (alpha follows the darkest channel),
          // then un-blend from white (C = (obs − (1−α)·255) / α) so partially
          // covered pixels recover their true ink color instead of keeping a
          // milky white fringe — the logo composites cleanly over any dark bg.
          const a = 255 - Math.min(d[i]!, d[i + 1]!, d[i + 2]!);
          if (a === 0) {
            d[i + 3] = 0;
            continue;
          }
          const inv = 255 - a;
          d[i] = Math.max(0, Math.min(255, Math.round(((d[i]! - inv) * 255) / a)));
          d[i + 1] = Math.max(0, Math.min(255, Math.round(((d[i + 1]! - inv) * 255) / a)));
          d[i + 2] = Math.max(0, Math.min(255, Math.round(((d[i + 2]! - inv) * 255) / a)));
          d[i + 3] = a;
        }
        ctx.putImageData(frame, 0, 0);
      } catch {
        // Cross-origin taint — abandon keying, show the raw video instead.
        window.cancelAnimationFrame(raf);
        setKeyingFailed(true);
      }
    };

    fitCanvas();
    video.addEventListener("loadedmetadata", fitCanvas);
    window.addEventListener("resize", fitCanvas);
    raf = window.requestAnimationFrame(draw);
    return () => {
      window.cancelAnimationFrame(raf);
      video.removeEventListener("loadedmetadata", fitCanvas);
      window.removeEventListener("resize", fitCanvas);
    };
  }, [keyingFailed]);

  return (
    <div
      role="dialog"
      aria-label="Launch"
      onClick={finish}
      className="fixed inset-0 z-[100] flex h-full w-full cursor-pointer items-center justify-center"
      style={{
        // Keyed ident sits on the Hextech dark field; if keying is unavailable
        // the raw artwork's baked white field shows instead (`white` keyword is
        // the ledger-approved exception — no white design token exists).
        background: keyingFailed
          ? "white"
          : "var(--color-hextech-black)",
        opacity: fading ? 0 : 1,
        transition: `opacity ${FADE_MS}ms ease-out`,
      }}
    >
      <span className="sr-only">{skipLabel}</span>
      <video
        ref={videoRef}
        aria-hidden="true"
        src={videoSrc}
        autoPlay
        muted
        playsInline
        onEnded={finish}
        className={
          keyingFailed
            ? "h-full w-full object-contain"
            : "pointer-events-none absolute h-px w-px opacity-0"
        }
      />
      {!keyingFailed && (
        <canvas ref={canvasRef} aria-hidden="true" className="max-h-full max-w-full" />
      )}
    </div>
  );
}
