"use client";

import { useState } from "react";
import type { MythicShopSkin } from "@low/fixtures";

// Video-state crossfade. The exalted card frames swap idle↔hover the way the
// real client sequences its magic-button video states — via the shared Hextech
// motion token --motion-crossfade (authored for exactly this video-state-machine
// use in packages/tokens/src/theme.css), so timing/easing stays centralized.
const VIDEO_CROSSFADE = "opacity var(--motion-crossfade)";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Real-client exalted (Mythic) card-frame magic videos for one card, one URL
 * per animation part. All full-frame 400×512 straight-alpha webms that composite
 * over the card's splash art. All optional — a part only layers when its URL is
 * supplied, and the static card always renders beneath, so a missing or broken
 * clip never regresses the static look. Pages/showcase supply URLs from
 * `@low/fixtures` (`exaltedCardVideoUrl(tier, part)`); NO fetching in `@low/ui`.
 *
 * Sequence: `top` → `bot` play once as the reveal, then `loop` idles, with
 * `hover` crossfading in on pointer-over. Tier three ships no `loop` (leave it
 * undefined — after the reveal the card simply rests on the settled `bot` frame).
 */
export interface ExaltedCardFrameSources {
  /** One-shot reveal phase 1 — pennant/banner outline sweeps in. Hands off to `bot`. */
  top?: string;
  /** One-shot reveal phase 2 — full frame settles (arch, crest, rim). Hands off to `loop`. */
  bot?: string;
  /** Ambient idle loop — sparse tier-tinted sparkle drift. Absent for tier three. */
  loop?: string;
  /** Hover flourish — the full art-deco border traced bright; crossfades in on hover. */
  hover?: string;
}

export interface MythicShopPanelProps {
  /**
   * Ordered list of prestige skin entries to display in the 4-column grid.
   * Callers should pass SAMPLE_MYTHIC_SHOP_ITEMS from @low/fixtures.
   */
  skins: MythicShopSkin[];
  /**
   * URL for the Mythic Essence icon shown next to each ME price.
   * Pass mythicEssenceIconUrl() from @low/fixtures.
   */
  meIconSrc: string;
  /**
   * Optional animated exalted card-frame videos, keyed by skin `id`. When a
   * skin's id maps to a {@link ExaltedCardFrameSources}, that card overlays the
   * animated art-deco frame (reveal → idle loop → hover swap) atop its splash
   * art; cards with no entry render as before. Pages supply the URLs via
   * `exaltedCardVideoUrl(tier, part)` from `@low/fixtures`. Under
   * `prefers-reduced-motion` the frame videos are hidden and the static card shows.
   */
  exaltedFrames?: Record<string, ExaltedCardFrameSources>;
  /**
   * Called when a skin card is clicked (e.g. to open a purchase modal).
   * The full skin entry is passed as the argument.
   */
  onSkinClick?: (skin: MythicShopSkin) => void;
}

// ---------------------------------------------------------------------------
// ExaltedCardFrame — the animated card-frame video state machine
// ---------------------------------------------------------------------------

/**
 * Resolved active layer of the exalted frame sequence. `"rest"` is the settled
 * state with NO opaque video layer — used for tier three, whose reveal clips end
 * on a near-opaque frame and which ships no transparent idle loop to hand off to;
 * resting there would scrim the splash, so instead every video fades out and the
 * card settles to its splash + static CSS gold border (the frame at rest).
 */
type FrameState = "top" | "bot" | "loop" | "hover" | "rest";

/**
 * Stacked full-frame video overlay that plays the exalted card-frame sequence:
 * `top` → `bot` reveal once on mount, then `loop` idles, with `hover` crossfading
 * in while the card is hovered. All layers mount together and only the active one
 * is opaque (crossfaded via `--motion-crossfade`) — keeping every decoder warm
 * avoids the remount stalls a single swapping `<video src>` hits.
 *
 * Straight-alpha overlays, `pointer-events-none`, decorative (`aria-hidden`), and
 * `motion-reduce:hidden` so reduced-motion users get the static card with no
 * first-frame flash. Tier three ships no `loop`; because its reveal clips end on
 * a near-opaque frame, holding there would scrim the splash — so once the reveal
 * ends it fades all video out to `"rest"` (graceful absence: splash + static gold
 * border), and hover still crossfades its flourish in and back out.
 */
function ExaltedCardFrame({
  sources,
  hovered,
}: {
  sources: ExaltedCardFrameSources;
  hovered: boolean;
}) {
  // Reveal progresses top → bot → done. Each flips once its one-shot clip ends
  // (or immediately when that clip is absent), leaving the resting state to
  // loop/hover. A card with no top/bot goes straight to the resting state.
  const [topDone, setTopDone] = useState(!sources.top);
  const [botDone, setBotDone] = useState(!sources.bot);

  // Resolve the single active frame state, in priority order: hover wins while
  // the pointer is over (only once the reveal has finished so the intro isn't
  // interrupted); then the reveal phases; then the idle loop rests beneath, or
  // "rest" (nothing opaque) when there is no loop to hand off to.
  let state: FrameState;
  const revealDone = topDone && botDone;
  if (hovered && revealDone && sources.hover) {
    state = "hover";
  } else if (!topDone && sources.top) {
    state = "top";
  } else if (!botDone && sources.bot) {
    state = "bot";
  } else if (sources.loop) {
    state = "loop";
  } else {
    // No idle loop (tier three): settle to splash + static border, no scrim.
    state = "rest";
  }

  const layers: {
    key: FrameState;
    src?: string;
    loop: boolean;
    onEnded?: () => void;
  }[] = [
    { key: "loop", src: sources.loop, loop: true },
    { key: "hover", src: sources.hover, loop: true },
    { key: "top", src: sources.top, loop: false, onEnded: () => setTopDone(true) },
    { key: "bot", src: sources.bot, loop: false, onEnded: () => setBotDone(true) },
  ];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[1] motion-reduce:hidden"
    >
      {layers.map(({ key, src, loop, onEnded }) =>
        src ? (
          <video
            key={key}
            src={src}
            autoPlay
            loop={loop}
            muted
            playsInline
            preload="auto"
            onEnded={onEnded}
            className="absolute inset-0 h-full w-full"
            style={{
              objectFit: "fill",
              opacity: state === key ? 1 : 0,
              transition: VIDEO_CROSSFADE,
            }}
          />
        ) : null,
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// MythicShopCard — individual prestige skin card
// ---------------------------------------------------------------------------

/**
 * Single card in the Mythic Shop 4-column grid.
 *
 * Reference (docs/reference/client-loot-mythic-shop.png, 2024+ era):
 * - Full-bleed splash art fills the card
 * - Dark gradient overlay at the bottom reveals the skin name + ME price
 * - ME icon (teal diamond) left of numeric cost
 * - Thin gold border on hover
 *
 * When `frameSources` is supplied the card overlays the animated exalted
 * art-deco frame (reveal → idle → hover swap) between the splash and the text
 * scrim. Hover is tracked in JS so the frame's hover clip crossfades in/out; the
 * static gold border + splash still render beneath as the reduced-motion / no-URL
 * fallback.
 */
function MythicShopCard({
  skin,
  meIconSrc,
  frameSources,
  onClick,
}: {
  skin: MythicShopSkin;
  meIconSrc: string;
  frameSources?: ExaltedCardFrameSources;
  onClick?: (skin: MythicShopSkin) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${skin.skinName} — ${skin.mythicEssenceCost} Mythic Essence`}
      onClick={() => onClick?.(skin)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick?.(skin);
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className={`group relative flex aspect-[308/560] w-full ${onClick ? "cursor-pointer" : "cursor-default"} select-none flex-col overflow-hidden border border-gold-5 transition-colors duration-150 hover:border-gold-3`}
    >
      {/* Splash art — fills card */}
      <img
        src={skin.skinSplashSrc}
        alt={skin.skinName}
        className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
      />

      {/* Animated exalted card frame — art-deco border overlay (optional) */}
      {frameSources ? (
        <ExaltedCardFrame sources={frameSources} hovered={hovered} />
      ) : null}

      {/* Bottom gradient overlay — dark scrim so text is readable over art.
          z-[2] keeps the name/price above the frame video (z-[1]). */}
      <div
        className="absolute inset-x-0 bottom-0 z-[2] flex flex-col gap-0.5 p-2"
        style={{
          background: "linear-gradient(to top, var(--color-blue-8) 0%, transparent 100%)",
        }}
      >
        {/* Skin name */}
        <p className="font-display text-[11px] leading-tight text-gold-cream">
          {skin.skinName}
        </p>

        {/* ME price row */}
        <div className="flex items-center gap-1">
          <img
            src={meIconSrc}
            alt="Mythic Essence"
            width={14}
            height={14}
            className="h-3.5 w-3.5 flex-shrink-0 object-contain"
          />
          <span className="font-display text-[11px] leading-none text-blue-2">
            {skin.mythicEssenceCost}
          </span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MythicShopPanel — full panel (header + grid)
// ---------------------------------------------------------------------------

/**
 * MythicShopPanel — MYTHIC SHOP sub-tab content for LootTab.
 *
 * Era: 2024+ (Patch 14.24+ "THE SANCTUM" sub-nav architecture, Riot /dev article).
 * Scope: content-only per controller adjudication — sub-tab switching is
 * handled in LootTab; this component owns only the right-panel area rendered
 * when activeSubTab === "mythic-shop".
 *
 * Reference: docs/reference/client-loot-mythic-shop.png (2560×1440).
 *
 * Layout:
 *   - Centered header "MYTHIC SHOP" (font-display text-gold-cream)
 *   - Description paragraph (text-grey-1 text-xs)
 *   - "Click here to learn more" external link
 *   - 4-column grid of MythicShopCard components (prestige skin art + ME price)
 */
export function MythicShopPanel({
  skins,
  meIconSrc,
  exaltedFrames,
  onSkinClick,
}: MythicShopPanelProps) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-blue-8">
      {/* Header zone */}
      <div className="flex flex-shrink-0 flex-col items-center gap-1.5 px-4 py-4 text-center">
        <h2 className="font-display text-2xl uppercase tracking-widest text-gold-cream">
          MYTHIC SHOP
        </h2>
        <p className="max-w-md font-body text-xs leading-relaxed text-grey-1">
          Unlock new and classic content exclusively for Mythic Essence.
          Inventory rotates with new patches.{" "}
          <a
            href="https://www.leagueoflegends.com/en-us/news/game-updates/dev-exalted-skins-the-mythic-shop-and-nexus-finishers/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-2 underline underline-offset-2 transition-colors duration-150 hover:text-blue-1"
          >
            Click here to learn more ↗
          </a>
        </p>
      </div>

      {/* 4-column skin card grid */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {skins.length === 0 ? (
          <p className="mt-8 text-center font-body text-xs text-grey-2">
            No items available — check back after the next patch.
          </p>
        ) : (
          <div className="grid grid-cols-4 gap-2.5">
            {skins.map((skin) => (
              <MythicShopCard
                key={skin.id}
                skin={skin}
                meIconSrc={meIconSrc}
                frameSources={exaltedFrames?.[skin.id]}
                onClick={onSkinClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
