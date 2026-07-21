"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FRIEND_FINDER_SFX, soundUrl, type SfxId } from "@low/fixtures";
import { SoundLibrary } from "./sound-library";

/**
 * Playable showcase demo for {@link SoundLibrary}. Owns the audio side effect so
 * the pure component stays presentational: it drives a single shared
 * `HTMLAudioElement` via `soundUrl()` and passes `nowPlayingId` + `onPlay`/
 * `onStop` down. Mirrors the app's `useSound` hook (kept local here because
 * `@low/ui` cannot depend on `apps/web`). Playback is user-gesture-initiated —
 * it only ever fires from a play-button press.
 */
export function SoundLibraryDemo() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [nowPlayingId, setNowPlayingId] = useState<SfxId | null>(null);

  const getAudio = useCallback((): HTMLAudioElement => {
    if (!audioRef.current) {
      const el = new Audio();
      el.preload = "none";
      audioRef.current = el;
    }
    return audioRef.current;
  }, []);

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

  const play = (id: string) => {
    const el = getAudio();
    el.pause();
    el.src = soundUrl(id as SfxId);
    el.currentTime = 0;
    setNowPlayingId(id as SfxId);
    const started = el.play();
    if (started) started.catch(() => setNowPlayingId(null));
  };

  const stop = () => {
    const el = audioRef.current;
    if (el) {
      el.pause();
      el.currentTime = 0;
    }
    setNowPlayingId(null);
  };

  return (
    <div className="w-[320px]">
      <SoundLibrary
        sounds={[...FRIEND_FINDER_SFX]}
        nowPlayingId={nowPlayingId}
        onPlay={play}
        onStop={stop}
      />
    </div>
  );
}
