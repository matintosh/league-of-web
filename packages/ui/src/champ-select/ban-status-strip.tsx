"use client";

import { useId } from "react";

// ---------------------------------------------------------------------------
// BanStatusStrip — two rows of ban slot icons (5 ally left, 5 enemy right).
//
// Layout: a single horizontal strip, 100% width.
//   - Left half: 5 ally ban slots, each ~28×28px.
//   - Right half: 5 enemy ban slots, mirrored right-aligned.
//   - Banned slots show champion portrait with dark overlay + red X overlay.
//   - Active slot (currently banning) shows a gold/teal glow highlight.
//   - Empty upcoming slots are dark grey-4 squares with a dashed border.
//
// Visual language (2019 LCU era, derived from pick-screen reference):
//   - Active slot border: gold-3 glow via drop-shadow (matches pick-screen tile selected state)
//   - Banned overlay: semi-opaque grey-8-equivalent (bg-hextech-black/70)
//   - Red X: custom SVG drawn with stroke #d94444 (riot-red precedent from issue #275)
//   - Slot size: 28×28px to fit within the 32px-tall strip
// ---------------------------------------------------------------------------

export interface BanStatusStripProps {
  /**
   * Champion square image URLs for ally bans. Array length 1–5.
   * Null entries render as empty/upcoming slots.
   */
  allyBanSrcs: (string | null)[];
  /**
   * Champion square image URLs for enemy bans. Array length 1–5.
   * Null entries render as empty/upcoming slots.
   */
  enemyBanSrcs: (string | null)[];
  /**
   * Index (0–4) of the active ally ban slot — shown with glow highlight.
   * Undefined means no active ally slot.
   */
  activeAllySlot?: number;
  /**
   * Index (0–4) of the active enemy ban slot — shown with glow highlight.
   * Undefined means no active enemy slot.
   */
  activeEnemySlot?: number;
}

const SLOT_SIZE = 28; // px

/** A single ban slot — empty, active-empty, or filled-with-X. */
function BanSlot({
  src,
  active,
  name,
}: {
  src: string | null;
  active: boolean;
  name: string;
}) {
  const uid = useId();
  const filterId = `ban-slot-glow-${uid}`;

  const filled = src !== null;

  return (
    <div
      aria-label={filled ? `${name} banned` : active ? "Your ban turn" : "Ban slot (upcoming)"}
      role="img"
      className="relative shrink-0 overflow-hidden border"
      style={{
        width: SLOT_SIZE,
        height: SLOT_SIZE,
        borderColor: active ? "var(--color-gold-3)" : "var(--color-grey-4)",
        // Drop-shadow glow on the active slot
        filter: active
          ? `drop-shadow(0 0 5px var(--color-gold-3))`
          : undefined,
        backgroundColor: "var(--color-grey-5, #1e2328)",
      }}
    >
      {filled && (
        <>
          {/* Champion portrait */}
          <img
            src={src!}
            alt=""
            aria-hidden="true"
            width={SLOT_SIZE}
            height={SLOT_SIZE}
            className="h-full w-full object-cover object-center grayscale"
          />
          {/* Dark overlay */}
          <span
            aria-hidden="true"
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.55)" }}
          />
          {/* Red X SVG */}
          <svg
            aria-hidden="true"
            viewBox="0 0 28 28"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 h-full w-full"
          >
            <defs>
              <filter id={filterId}>
                <feGaussianBlur stdDeviation="1" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <line
              x1="6" y1="6" x2="22" y2="22"
              stroke="#d94444"
              strokeWidth="2.5"
              strokeLinecap="round"
              filter={`url(#${filterId})`}
            />
            <line
              x1="22" y1="6" x2="6" y2="22"
              stroke="#d94444"
              strokeWidth="2.5"
              strokeLinecap="round"
              filter={`url(#${filterId})`}
            />
          </svg>
        </>
      )}

      {/* Active-but-empty: pulsing inner border */}
      {!filled && active && (
        <span
          aria-hidden="true"
          className="absolute inset-0.5 border border-gold-3 opacity-60"
        />
      )}
    </div>
  );
}

/**
 * BanStatusStrip — horizontal strip of 10 ban slot icons (5 ally + 5 enemy).
 *
 * Ally bans are left-aligned; enemy bans are right-aligned. Banned slots show
 * grayscale portrait with dark overlay + red X. The active slot (the current
 * turn) has a gold glow highlight. Empty upcoming slots are dark grey squares.
 *
 * @param allyBanSrcs   Array of champion square URLs for ally bans (null = empty slot).
 * @param enemyBanSrcs  Array of champion square URLs for enemy bans (null = empty slot).
 * @param activeAllySlot  Index 0–4 of the currently-active ally ban slot.
 * @param activeEnemySlot Index 0–4 of the currently-active enemy ban slot.
 */
export function BanStatusStrip({
  allyBanSrcs,
  enemyBanSrcs,
  activeAllySlot,
  activeEnemySlot,
}: BanStatusStripProps) {
  // Pad both arrays to exactly 5 slots
  const ally = Array.from({ length: 5 }, (_, i) => allyBanSrcs[i] ?? null);
  const enemy = Array.from({ length: 5 }, (_, i) => enemyBanSrcs[i] ?? null);

  return (
    <div
      className="flex w-full items-center justify-between px-2 py-0.5"
      aria-label="Ban status"
      role="group"
    >
      {/* Ally bans — left group */}
      <div className="flex items-center gap-1" aria-label="Ally bans">
        {ally.map((src, i) => (
          <BanSlot
            key={i}
            src={src}
            active={activeAllySlot === i}
            name={`Ally ban ${i + 1}`}
          />
        ))}
      </div>

      {/* Divider label */}
      <span
        className="px-2 font-display text-[10px] tracking-widest text-grey-3 uppercase select-none"
        aria-hidden="true"
      >
        vs
      </span>

      {/* Enemy bans — right group */}
      <div className="flex items-center gap-1" aria-label="Enemy bans">
        {enemy.map((src, i) => (
          <BanSlot
            key={i}
            src={src}
            active={activeEnemySlot === i}
            name={`Enemy ban ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
