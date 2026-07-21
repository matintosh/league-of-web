"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { soundUrl, type SfxId } from "@low/fixtures";

/**
 * Return shape of {@link useSound}.
 */
export interface UseSound {
  /**
   * The id of the sound currently playing, or `null` when nothing is. Feed to a
   * `SoundLibrary`'s `nowPlayingId` (or use to reflect playing state anywhere).
   */
  nowPlayingId: SfxId | null;
  /**
   * Play a catalog SFX by id. Resolves the URL via `soundUrl(id)` and drives a
   * single shared `HTMLAudioElement`. Playing while another clip sounds swaps to
   * the new clip. MUST be called from a user gesture (click/keypress) — the hook
   * never autoplays, so browser autoplay policy is never violated.
   *
   * Load/playback failures (e.g. a missing clip) are swallowed: `nowPlayingId`
   * resets and nothing throws.
   */
  play: (id: SfxId) => void;
  /** Stop the current clip and reset `nowPlayingId` to `null`. No-op if idle. */
  stop: () => void;
}

/**
 * App-level audio side-effect hook for the sound system (issue #432).
 *
 * Owns ONE lazily-created `HTMLAudioElement` reused across plays (no per-clip
 * element churn) and tracks which SFX id is sounding. This is the ONLY place
 * audio actually plays — `@low/ui` components stay presentational and merely
 * emit `onPlay(id)` callbacks that a page wires to {@link UseSound.play}.
 *
 * Playback is strictly user-gesture-initiated: the hook exposes imperative
 * `play`/`stop` and never calls them itself, so nothing sounds without a click.
 * Missing/broken clips degrade to a graceful no-op (the `error`/rejected
 * `play()` paths just clear `nowPlayingId`).
 */
export function useSound(): UseSound {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [nowPlayingId, setNowPlayingId] = useState<SfxId | null>(null);

  // Lazily construct the shared element on first client render. Created here
  // (not at module scope) so it never runs during SSR.
  const getAudio = useCallback((): HTMLAudioElement => {
    if (!audioRef.current) {
      const el = new Audio();
      el.preload = "none";
      audioRef.current = el;
    }
    return audioRef.current;
  }, []);

  // When a clip finishes (or errors) on its own, clear the now-playing id.
  useEffect(() => {
    const el = getAudio();
    const clear = () => setNowPlayingId(null);
    el.addEventListener("ended", clear);
    el.addEventListener("error", clear);
    return () => {
      el.removeEventListener("ended", clear);
      el.removeEventListener("error", clear);
    };
  }, [getAudio]);

  const stop = useCallback(() => {
    const el = audioRef.current;
    if (el) {
      el.pause();
      el.currentTime = 0;
    }
    setNowPlayingId(null);
  }, []);

  const play = useCallback(
    (id: SfxId) => {
      const el = getAudio();
      el.pause();
      el.src = soundUrl(id);
      el.currentTime = 0;
      setNowPlayingId(id);
      // play() returns a promise that rejects on load failure / autoplay block.
      // Since this is always called from a user gesture, rejection here means a
      // genuinely missing clip — degrade to a silent no-op.
      const started = el.play();
      if (started) {
        started.catch(() => setNowPlayingId(null));
      }
    },
    [getAudio],
  );

  return { nowPlayingId, play, stop };
}
