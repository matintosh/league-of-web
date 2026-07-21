"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  FRIEND_FINDER_SFX,
  UIKIT_SFX,
  soundUrl,
  uikitSoundUrl,
  type SfxId,
  type SoundEntry,
  type UikitSfxId,
} from "@low/fixtures";
import { SoundLibrary } from "./sound-library";

/**
 * Playable showcase demo for {@link SoundLibrary}. Owns the audio side effect so
 * the pure component stays presentational: it drives a single shared
 * `HTMLAudioElement` and passes `nowPlayingId` + `onPlay`/`onStop` down. Mirrors
 * the app's `useSound` hook (kept local here because `@low/ui` cannot depend on
 * `apps/web`). Playback is user-gesture-initiated — it only ever fires from a
 * play-button press.
 *
 * Parametrized by `catalog` + `resolve` so one demo serves both sound catalogs:
 * the #432 friend-finder set (resolved by `soundUrl`) and the #439 uikit set
 * (resolved by `uikitSoundUrl`) — a different plugin/base, hence a different
 * resolver. The two catalogs' ids can collide (both have a `click-generic`), so
 * each variant keeps its own resolver rather than sharing one.
 */
function SoundLibraryDemoBase({
  catalog,
  resolve,
  width = "w-[320px]",
}: {
  catalog: readonly SoundEntry[];
  resolve: (id: string) => string;
  width?: string;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [nowPlayingId, setNowPlayingId] = useState<string | null>(null);

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
    el.src = resolve(id);
    el.currentTime = 0;
    setNowPlayingId(id);
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
    <div className={width}>
      <SoundLibrary
        sounds={[...catalog]}
        nowPlayingId={nowPlayingId}
        onPlay={play}
        onStop={stop}
      />
    </div>
  );
}

/** Friend-finder SFX catalog (#432), resolved via `soundUrl`. */
export function SoundLibraryDemo() {
  return (
    <SoundLibraryDemoBase
      catalog={FRIEND_FINDER_SFX}
      resolve={(id) => soundUrl(id as SfxId)}
    />
  );
}

/** Generic uikit SFX catalog (#439), resolved via `uikitSoundUrl`. */
export function UikitSoundLibraryDemo() {
  return (
    <SoundLibraryDemoBase
      catalog={UIKIT_SFX}
      resolve={(id) => uikitSoundUrl(id as UikitSfxId)}
      width="w-[360px]"
    />
  );
}
