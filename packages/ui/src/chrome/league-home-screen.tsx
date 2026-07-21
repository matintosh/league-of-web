"use client";

import { useId } from "react";
import type { ReactNode } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** The featured-content copy + splash shown over the right side of the screen. */
export interface LeagueHomeFeatured {
  /** Small gold eyebrow above the title, e.g. "NEW SKIN". */
  eyebrow: string;
  /** Large display title; may contain a `\n` to force a two-line break. */
  title: string;
  /** One- to two-sentence body copy under the title. */
  body: string;
  /**
   * Full-bleed champion splash URL filling the center/right of the screen.
   * Supplied by the page (`championSplashUrl(...)`) — the component never fetches.
   */
  splashSrc: string;
}

/** A single skin thumbnail card in the bottom-right SKINS strip. */
export interface LeagueHomeSkin {
  /** Stable id passed to `onSelectSkin`. */
  id: string;
  /** Skin caption shown under the art tile. */
  name: string;
  /**
   * Skin art tile URL (loading art / splash). Supplied by the page — the
   * component never fetches.
   */
  artSrc: string;
  /** When true, the card shows an "Owned" check badge. */
  owned?: boolean;
}

export interface LeagueHomeScreenProps {
  /** Featured copy + splash for the currently selected rail item. */
  featured: LeagueHomeFeatured;
  /**
   * The left content-link rail, mounted as the fixed-width left column.
   * Pass a composed `<HomeContentRail />` (from #456) so this screen stays
   * layout-only and owns no selection state.
   */
  railSlot: ReactNode;
  /** SKINS strip cards (bottom-right). Typically two: the featured skin + a bonus. */
  skins: LeagueHomeSkin[];
  /** Fired with a skin's id when its thumbnail card is clicked. */
  onSelectSkin?: (id: string) => void;
  /** Fired when the GO TO STORE button is clicked; the page routes to the store. */
  onGoToStore?: () => void;
  /** Fired when the mute disc is clicked. Presentational — no audio plays. */
  onToggleMute?: () => void;
  /** Whether the featured audio is muted (drives the mute-disc glyph). */
  muted?: boolean;
  /**
   * Pixels by which the featured splash + scrims extend ABOVE this screen's top
   * edge, so the key-art bleeds up behind a transparent nav band overlaying the
   * content (issue #501 — the MF splash shows through the nav). Only the splash
   * layer bleeds up; the rail, copy, and skins strip stay inside the screen box
   * (which the page pads down to clear the band). 0 (default) = no bleed.
   */
  splashBleedTop?: number;
}

/**
 * LeagueHomeScreen — the current-era LEAGUE HOME featured-content landing.
 *
 * A fixed-width left content-link rail (passed in as `railSlot`) beside a
 * full-bleed champion splash filling the remainder. Over the splash: a gold
 * eyebrow + display title + body copy anchored lower-left (behind a left/bottom
 * hextech-black scrim so the copy and rail stay legible), a mute disc top-right,
 * and a SKINS thumbnail strip + GO TO STORE button anchored bottom-right.
 *
 * Presentational: props in, callbacks out. No fetching — splash and skin art
 * arrive as `src` strings from the page. The rail is a child slot, so this
 * component owns no selection state.
 */
export function LeagueHomeScreen({
  featured,
  railSlot,
  skins,
  onSelectSkin,
  onGoToStore,
  onToggleMute,
  muted = false,
  splashBleedTop = 0,
}: LeagueHomeScreenProps) {
  return (
    <div
      data-shot="league-home-screen"
      className="relative flex h-full w-full overflow-visible bg-hextech-black"
    >
      {/* ---------------------------------------------------------------- */}
      {/* SPLASH — FULL-BLEED layer behind BOTH columns (#503).             */}
      {/* The featured key-art spans the entire content area (left rail +   */}
      {/* right region), so with the rail now semi-transparent (#503) the   */}
      {/* MF splash + flames bleed through behind the rail items, matching  */}
      {/* the reference. Sits at z-0 under the rail (z-10) and right-region */}
      {/* overlays (z-10). Preserves the #501 upward bleed: the layer       */}
      {/* extends UP by `splashBleedTop` above this screen's top edge so    */}
      {/* the art fills behind the transparent nav band. `overflow-hidden`  */}
      {/* here (not on the parent) keeps the object-cover crop clean while  */}
      {/* the parent stays `overflow-visible` so the art escapes upward.    */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 overflow-hidden"
        style={{ top: -splashBleedTop }}
      >
        {/* Splash — object-cover fills the region, top-anchored on the face */}
        <img
          src={featured.splashSrc}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-top"
        />

        {/* #506: the #503 left scrim panel is REMOVED — the rail is now fully
            transparent over the splash (no left wash), so the key-art bleeds
            through the rail area completely, matching the reference. Rail-label
            legibility is handled by a MINIMAL per-text shadow in the rail rows,
            not a left scrim. Only the bottom scrim remains. */}
        {/* Bottom scrim — darkens the lower edge so the copy + skins strip
            stay legible over the splash. Unchanged (#501). */}
        <div
          className="absolute inset-x-0 bottom-0"
          style={{
            height: "62%",
            background:
              "linear-gradient(to top, color-mix(in srgb, var(--color-hextech-black) 92%, transparent) 0%, color-mix(in srgb, var(--color-hextech-black) 45%, transparent) 48%, transparent 100%)",
          }}
        />
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* LEFT — content-link rail (fixed-width column, from #456).         */}
      {/* Semi-transparent (#503): sits ABOVE the splash layer (z-10) so    */}
      {/* the art bleeds through its scrim.                                 */}
      {/* ---------------------------------------------------------------- */}
      <div className="relative z-10 shrink-0">{railSlot}</div>

      {/* ---------------------------------------------------------------- */}
      {/* RIGHT — featured overlays above the shared splash layer           */}
      {/* ---------------------------------------------------------------- */}
      <div className="relative z-10 min-w-0 flex-1">
        {/* -------------------------------------------------------------- */}
        {/* MUTE DISC — top-right, presentational (static glyph)            */}
        {/* -------------------------------------------------------------- */}
        <button
          type="button"
          onClick={onToggleMute}
          aria-pressed={muted}
          aria-label={muted ? "Unmute featured audio" : "Mute featured audio"}
          className="absolute right-5 top-5 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-gold-5 bg-hextech-black/60 text-gold-2 transition-colors duration-150 hover:border-gold-2 hover:text-gold-1"
        >
          <MuteGlyph muted={muted} className="h-4 w-4" />
        </button>

        {/* -------------------------------------------------------------- */}
        {/* FEATURED COPY — eyebrow / title / body, lower-left over splash  */}
        {/* -------------------------------------------------------------- */}
        <div className="absolute bottom-8 left-8 z-10 max-w-[46%]">
          <p className="font-display text-xs uppercase tracking-[0.2em] text-gold-1">
            {featured.eyebrow}
          </p>
          <h2 className="mt-2 whitespace-pre-line font-display text-4xl uppercase leading-[1.05] tracking-wide text-gold-1">
            {featured.title}
          </h2>
          <p className="mt-3 max-w-md font-body text-sm leading-snug text-gold-cream">
            {featured.body}
          </p>
        </div>

        {/* -------------------------------------------------------------- */}
        {/* SKINS STRIP + GO TO STORE — bottom-right                        */}
        {/* -------------------------------------------------------------- */}
        <div className="absolute bottom-8 right-8 z-10 flex flex-col items-end gap-3">
          <div className="flex flex-col items-end gap-1.5">
            <p className="font-display text-xs uppercase tracking-[0.2em] text-gold-2">
              Skins
            </p>
            <div className="flex items-end gap-2.5">
              {skins.map((skin) => (
                <SkinCard
                  key={skin.id}
                  skin={skin}
                  onSelect={onSelectSkin}
                />
              ))}
            </div>
          </div>

          {/* #534: HEXTECH BRONZE RECTANGLE — the standard store button. Sharp
              square corners (no rounded), a bright gold-4 outline, cream serif
              label, and a vertical dark antique bronze-gold fill: a warm
              brown-gold at top darkening to deep brown at the bottom. The fill
              is built from gold tokens via color-mix (gold-5 warmed with gold-4
              up top, gold-5 dropped toward hextech-black at the bottom) so no
              raw hex leaks in. Hover lightens the fill and brightens the border
              toward gold-2. A faint top-edge sheen sits in the upper third via a
              1px inset highlight overlay. */}
          <button
            type="button"
            onClick={onGoToStore}
            className="group/store relative cursor-pointer overflow-hidden border border-gold-4 px-6 py-2 font-display text-xs uppercase tracking-[0.14em] text-gold-1 transition-colors duration-150 hover:border-gold-2 [background:linear-gradient(to_bottom,color-mix(in_srgb,var(--color-gold-5)_82%,var(--color-gold-4))_0%,color-mix(in_srgb,var(--color-gold-5)_58%,var(--color-hextech-black))_100%)] hover:[background:linear-gradient(to_bottom,color-mix(in_srgb,var(--color-gold-4)_70%,var(--color-gold-5))_0%,color-mix(in_srgb,var(--color-gold-5)_70%,var(--color-hextech-black))_100%)]"
          >
            {/* Metallic sheen — faint warm highlight over the upper third. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-1/3"
              style={{
                background:
                  "linear-gradient(to bottom, color-mix(in srgb, var(--color-gold-2) 22%, transparent) 0%, transparent 100%)",
              }}
            />
            <span className="relative">Go to Store</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SkinCard — one thumbnail card in the SKINS strip
// ---------------------------------------------------------------------------

interface SkinCardProps {
  skin: LeagueHomeSkin;
  onSelect?: (id: string) => void;
}

function SkinCard({ skin, onSelect }: SkinCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(skin.id)}
      className="group flex w-[120px] cursor-pointer flex-col border border-gold-5 bg-hextech-black/70 text-left transition-colors duration-150 hover:border-gold-2"
    >
      {/* Art tile */}
      <div className="relative h-[72px] w-full overflow-hidden">
        <img
          src={skin.artSrc}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
        {skin.owned && (
          <span className="absolute right-1 top-1 flex items-center gap-1 bg-hextech-black/80 px-1.5 py-0.5 font-display text-[10px] uppercase tracking-wide text-gold-1">
            <CheckGlyph className="h-2.5 w-2.5" />
            Owned
          </span>
        )}
      </div>

      {/* Caption */}
      <span className="line-clamp-2 px-2 py-1.5 font-body text-[11px] leading-tight text-gold-cream group-hover:text-gold-1">
        {skin.name}
      </span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Glyphs — decorative, token-filled via currentColor
// ---------------------------------------------------------------------------

/** Speaker glyph; a slash overlays it when muted. Decorative. */
function MuteGlyph({ muted, className }: { muted: boolean; className?: string }) {
  const clipId = useId();

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M4 8h3l4-3v10l-4-3H4V8Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      {muted ? (
        <path
          d="M13 7l4 6M17 7l-4 6"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      ) : (
        <>
          <path d="M13.5 7.5a3.5 3.5 0 0 1 0 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M15.5 5.5a6 6 0 0 1 0 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.7" />
        </>
      )}
      <defs>
        <clipPath id={clipId}>
          <rect width="20" height="20" />
        </clipPath>
      </defs>
    </svg>
  );
}

/** Check-mark glyph for the Owned badge. Decorative. */
function CheckGlyph({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M2 6.5 4.5 9 10 3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
