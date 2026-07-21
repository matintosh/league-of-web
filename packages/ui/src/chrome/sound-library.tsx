import { useId } from "react";
import type { SoundEntry } from "@low/fixtures";

export interface SoundLibraryProps {
  /**
   * The catalog of sounds to list. Grouped by `category` in first-seen order,
   * so the caller controls section ordering by ordering the array (e.g.
   * `FRIEND_FINDER_SFX` from `@low/fixtures`, ordered UI → Notification → Social).
   */
  sounds: SoundEntry[];
  /**
   * Id of the sound currently playing, or `null`/`undefined` when nothing is.
   * The matching row shows a stop control + "playing" treatment; all others
   * show a play control. Purely reflected — this component tracks no state.
   */
  nowPlayingId?: string | null;
  /**
   * Called with a sound's `id` when the user presses its play control.
   * Playback is a side effect owned by the caller (the app's `useSound` hook) —
   * this component only emits the intent (user-gesture-initiated).
   */
  onPlay: (id: string) => void;
  /**
   * Called when the user presses the stop control on the now-playing row.
   * Optional — when omitted the now-playing row's control still renders as a
   * "playing" indicator but pressing it re-emits `onPlay` (restart) instead.
   */
  onStop?: () => void;
}

/**
 * A browsable, playable list of client sound effects, grouped by category —
 * the `/showcase` surface for the sound system (issue #432). Each row shows the
 * sound's label, a category chip, and a play/stop control reflecting
 * `nowPlayingId`.
 *
 * Presentational only: it holds NO audio object and does NO fetching. It emits
 * `onPlay(id)` / `onStop()` and the APP layer (the `useSound` hook) resolves the
 * URL via `soundUrl(id)` and drives an `HTMLAudioElement`. Playback stays
 * user-gesture-initiated because it only ever fires from these button presses.
 */
export function SoundLibrary({
  sounds,
  nowPlayingId,
  onPlay,
  onStop,
}: SoundLibraryProps) {
  const gid = useId();

  // Group by category in first-seen order — the caller controls section order
  // by ordering the `sounds` array.
  const order: string[] = [];
  const groups = new Map<string, SoundEntry[]>();
  for (const sound of sounds) {
    if (!groups.has(sound.category)) {
      groups.set(sound.category, []);
      order.push(sound.category);
    }
    groups.get(sound.category)!.push(sound);
  }

  return (
    <div className="w-full border border-gold-5 bg-blue-7">
      {order.map((category) => (
        <section key={category}>
          <h3 className="border-b border-gold-5 bg-[color-mix(in_srgb,var(--color-grey-4)_70%,var(--color-hextech-black))] px-3 py-1.5 font-display text-xs uppercase tracking-widest text-gold-1">
            {category}
          </h3>
          <ul>
            {groups.get(category)!.map((sound) => {
              const isPlaying = nowPlayingId === sound.id;
              return (
                <li
                  key={sound.id}
                  className="flex items-center gap-3 border-b border-[color-mix(in_srgb,var(--color-gold-5)_50%,transparent)] px-3 py-2 last:border-b-0"
                >
                  <PlayControl
                    labelId={`${gid}-${sound.id}`}
                    soundLabel={sound.label}
                    isPlaying={isPlaying}
                    onClick={() =>
                      isPlaying && onStop ? onStop() : onPlay(sound.id)
                    }
                  />
                  <span
                    id={`${gid}-${sound.id}`}
                    className={`min-w-0 flex-1 truncate font-body text-sm ${
                      isPlaying ? "text-gold-1" : "text-grey-1"
                    }`}
                  >
                    {sound.label}
                  </span>
                  <span className="shrink-0 border border-gold-5 px-1.5 py-0.5 font-display text-[0.625rem] uppercase tracking-wider text-gold-2">
                    {sound.category}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

interface PlayControlProps {
  labelId: string;
  soundLabel: string;
  isPlaying: boolean;
  onClick: () => void;
}

/**
 * The circular play/stop control for a sound row. Shows a triangle when idle
 * and a square when the row is the now-playing one; brightens its gold ring on
 * hover and while playing.
 */
function PlayControl({
  labelId,
  soundLabel,
  isPlaying,
  onClick,
}: PlayControlProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-labelledby={labelId}
      aria-pressed={isPlaying}
      title={isPlaying ? `Stop ${soundLabel}` : `Play ${soundLabel}`}
      className={`grid size-7 shrink-0 place-items-center rounded-full border bg-[color-mix(in_srgb,var(--color-blue-7)_60%,var(--color-hextech-black))] transition-colors duration-150 hover:border-gold-2 hover:text-gold-1 ${
        isPlaying
          ? "border-gold-2 text-gold-1 shadow-[0_0_8px_var(--color-blue-2)]"
          : "border-gold-4 text-gold-2"
      }`}
    >
      {isPlaying ? (
        // Stop — square
        <svg
          viewBox="0 0 10 10"
          className="size-2.5 fill-current"
          aria-hidden="true"
        >
          <rect x="0" y="0" width="10" height="10" />
        </svg>
      ) : (
        // Play — right-pointing triangle, optically nudged right
        <svg
          viewBox="0 0 10 10"
          className="size-2.5 translate-x-[0.5px] fill-current"
          aria-hidden="true"
        >
          <path d="M1 0.5 L9 5 L1 9.5 Z" />
        </svg>
      )}
    </button>
  );
}
