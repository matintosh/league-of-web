// ---------------------------------------------------------------------------
// usePausedVideo — pause a crossfade layer's decoder while it is hidden (#358).
//
// The PLAY button (PlayButtonVideoLayer / MedallionVideoLayer) and FIND MATCH
// button (LockInVideoLayer) stack every state's <video> and crossfade them on
// opacity, keeping all decoders warm to dodge the remount stalls a single
// swapping <video src> hits. The cost: at rest a couple of loops keep decoding
// at opacity 0 (navbar PLAY: hover-loop + medallion loop-active; FIND MATCH:
// hover/active). This hook pauses a layer's decoder whenever it is hidden and
// resumes it the instant it becomes visible again — no active decoder for a
// layer nobody can see, but the element stays mounted so the resume is seamless
// (var(--motion-crossfade) masks the first repainted frames).
//
// Loops resume from where they paused; one-shots are only ever visible while
// they play (they pause themselves at their end frame, then get hidden), so
// this hook leaves their behaviour unchanged. Muted autoplay means play() needs
// no gesture — the returned promise is caught and ignored (a paused/torn-down
// element can reject, which is benign).
//
// A .ts hook (no JSX) so consumers keep their <video> markup inline; internal to
// @low/ui, not re-exported from the package index — no public API change (#358).
// ---------------------------------------------------------------------------

import { useEffect, useRef } from "react";

/**
 * Drives a single crossfade `<video>` layer's decoder from a `visible` flag:
 * pauses it while hidden, plays it when visible. Attach the returned ref to the
 * `<video>` and pass whether this layer is the active (opaque) one.
 *
 * @param visible True when this layer is the active/opaque state (opacity 1).
 * @returns A ref to attach to the `<video>` element.
 */
export function usePausedVideo(visible: boolean) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (visible) {
      // Fire-and-forget: autoplay is muted so no gesture is required; a play()
      // interrupted by a pause/unmount rejects harmlessly.
      void el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [visible]);

  return ref;
}
