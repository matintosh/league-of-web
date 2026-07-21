"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { soundUrl, type SfxId } from "@low/fixtures";

/**
 * Return shape of {@link useSound}. Generic over the catalog's id type `Id` so
 * the same hook serves the friend-finder set (`SfxId`, #432) and the uikit set
 * (`UikitSfxId`, #439) — each just supplies its own resolver.
 */
export interface UseSound<Id extends string = SfxId> {
  /**
   * The id of the sound currently playing, or `null` when nothing is. Feed to a
   * `SoundLibrary`'s `nowPlayingId` (or use to reflect playing state anywhere).
   */
  nowPlayingId: Id | null;
  /**
   * Play a catalog SFX by id. Resolves the URL via the hook's `resolve` (default
   * `soundUrl`) and drives a single shared `HTMLAudioElement`. Playing while
   * another clip sounds swaps to the new clip. MUST be called from a user
   * gesture (click/keypress) — the hook never autoplays, so browser autoplay
   * policy is never violated.
   *
   * Load/playback failures (e.g. a missing clip) are swallowed: `nowPlayingId`
   * resets and nothing throws.
   */
  play: (id: Id) => void;
  /** Stop the current clip and reset `nowPlayingId` to `null`. No-op if idle. */
  stop: () => void;
}

/**
 * App-level audio side-effect hook for the sound system (issues #432, #439).
 *
 * Owns ONE lazily-created `HTMLAudioElement` reused across plays (no per-clip
 * element churn) and tracks which SFX id is sounding. This is the ONLY place
 * audio actually plays — `@low/ui` components stay presentational and merely
 * emit `onPlay(id)` / `onClick` / `onChange` callbacks that a page wires to
 * {@link UseSound.play}.
 *
 * Generic over the catalog id type + resolver: `useSound()` defaults to the
 * friend-finder set (`SfxId` via `soundUrl`); pass a resolver (e.g.
 * `useSound(uikitSoundUrl)`) to play a different catalog (the uikit set, #439 —
 * a different plugin/base). One hook instance = one audio element = one catalog.
 *
 * Playback is strictly user-gesture-initiated: the hook exposes imperative
 * `play`/`stop` and never calls them itself, so nothing sounds without a click
 * (this holds for HOVER-triggered clips too — a hover handler is still a user
 * gesture, and no clip plays before the first interaction). Missing/broken clips
 * degrade to a graceful no-op (the `error`/rejected `play()` paths just clear
 * `nowPlayingId`).
 */
export function useSound<Id extends string = SfxId>(
  resolve: (id: Id) => string = soundUrl as (id: Id) => string,
): UseSound<Id> {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [nowPlayingId, setNowPlayingId] = useState<Id | null>(null);

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
    (id: Id) => {
      const el = getAudio();
      el.pause();
      el.src = resolve(id);
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
    [getAudio, resolve],
  );

  return { nowPlayingId, play, stop };
}
