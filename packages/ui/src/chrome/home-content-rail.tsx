"use client";

import { useId, type ReactNode } from "react";

/**
 * Category glyph shown on a rail row's bullet. Each value maps to a distinct
 * inline SVG in {@link RailIcon}, matching the per-category glyphs in the
 * current-era LEAGUE HOME reference (theater mask, trophy, sparkle-diamond,
 * crescent, cycle-arrows, patch diamond). Omit / `"default"` → the generic
 * faceted gem bullet (back-compat).
 */
export type HomeContentRailIconType =
  | "mask"
  | "trophy"
  | "diamond"
  | "crescent"
  | "cycle"
  | "patch"
  | "default";

/** A single selectable featured-content row in the rail. */
export interface HomeContentRailItem {
  /** Stable id passed to `onSelect`. */
  id: string;
  /**
   * Uppercase label shown next to the gem bullet. May contain multiple words
   * that wrap onto 1–2 lines; embed a `\n` to force a specific line break.
   */
  label: string;
  /**
   * Champion portrait / square art URL. Shown only when this row is active.
   * Supplied by the page — the component never fetches.
   */
  thumbnailSrc?: string;
  /**
   * Category of the row, selecting which glyph the bullet renders when the row
   * is inactive (or active without a thumbnail). Omit for the generic gem.
   */
  iconType?: HomeContentRailIconType;
}

export interface HomeContentRailProps {
  /** Ordered list of featured rows, top → bottom. */
  items: HomeContentRailItem[];
  /** Id of the currently active (highlighted) row. */
  activeId: string;
  /** Fired with a row's id when the player selects it (including the pinned item). */
  onSelect: (id: string) => void;
  /**
   * Optional row pinned to the bottom of the rail, separated from the main
   * list (e.g. "PATCH NOTES"). Selecting it also fires `onSelect`.
   */
  pinnedItem?: { id: string; label: string; iconType?: HomeContentRailIconType };
}

/**
 * HomeContentRail — the left content-link rail of the current-era LEAGUE HOME.
 *
 * A vertical stack of featured rows the player selects to change the featured
 * splash on the right, plus one row pinned to the bottom (PATCH NOTES). Each
 * row is a gem bullet + a 1–2 line uppercase display label; the active row is
 * brighter gold and shows the item's champion thumbnail when present.
 *
 * Presentational: props in, callbacks out. No fetching — thumbnail art arrives
 * as a `src` string from the page. Rows use vertical tablist semantics
 * (`role="tab"` + `aria-selected`), since selecting a row swaps a featured
 * panel.
 */
export function HomeContentRail({
  items,
  activeId,
  onSelect,
  pinnedItem,
}: HomeContentRailProps) {
  return (
    <div
      data-shot="home-content-rail"
      role="tablist"
      aria-orientation="vertical"
      // #529: the rail has NO background/scrim at all — it is fully transparent so
      // the featured splash bleeds completely through (reversing the #524 scrim).
      // The only chrome separating the rail from the splash is a single 1px RIGHT
      // border in white at 50% opacity (via the new --color-white token, #529).
      className="flex h-[85%] mt-4 w-full min-w-[230px] max-w-[260px] flex-col border-r border-white/10 py-2"
    >
      <div className="flex flex-1 flex-col gap-1">
        {items.map((item) => (
          <ContentRailRow
            key={item.id}
            item={item}
            isActive={item.id === activeId}
            onSelect={onSelect}
          />
        ))}
      </div>

      {pinnedItem != null && (
        <div className="mt-6 border-t border-white/10 pt-4 w-[80%] mx-auto">
          <ContentRailRow
            item={pinnedItem}
            isActive={pinnedItem.id === activeId}
            onSelect={onSelect}
            noSidePadding={true}
          />
        </div>
      )}
    </div>
  );
}

interface ContentRailRowProps {
  item: HomeContentRailItem;
  isActive: boolean;
  onSelect: (id: string) => void;
  noSidePadding?: boolean;
}

function ContentRailRow({ item, isActive, onSelect, noSidePadding = false }: ContentRailRowProps) {
  const showThumb = isActive && item.thumbnailSrc != null;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => onSelect(item.id)}
      className={[
        "group flex w-full cursor-pointer items-center gap-3 py-1.5 text-left transition-colors duration-150",
        noSidePadding ? "" : "px-5",
        isActive ? "text-gold-1" : "text-gold-cream hover:text-gold-1",
      ].join(" ")}
    >
      {showThumb ? (
        <img
          src={item.thumbnailSrc}
          alt=""
          aria-hidden="true"
          className="h-8 w-8 shrink-0 rounded-sm border border-gold-5 object-cover"
        />
      ) : (
        // #506: subtle dark drop-shadow so the glyph stays crisp over the splash
        // now that the rail has no scrim panel behind it. #545: per-category
        // glyph via iconType (falls back to the gem bullet when absent).
        <RailIcon
          iconType={item.iconType}
          className="h-4 w-4 shrink-0 [filter:drop-shadow(0_1px_1px_color-mix(in_srgb,var(--color-hextech-black)_75%,transparent))]"
        />
      )}

      <span
        // #506: MINIMAL per-text shadow (behind the label only, not a rail
        // panel) keeps the gold label legible over the busy splash now that the
        // #503 scrim is gone — matching the reference, which relies on the
        // splash reading darker at the far-left.
        className={[
          "whitespace-pre-line font-display text-[13px] uppercase leading-tight tracking-wide [text-shadow:0_1px_3px_color-mix(in_srgb,var(--color-hextech-black)_80%,transparent)]",
          isActive ? "font-semibold" : "",
        ].join(" ")}
      >
        {item.label}
      </span>
    </button>
  );
}

/**
 * RailIcon — dispatches to the per-category glyph for a row's bullet, matching
 * the distinct glyphs in the current-era LEAGUE HOME reference. Falls back to
 * the generic {@link GemBullet} when `iconType` is absent or `"default"`, so
 * existing call sites are unchanged. All glyphs fill via `currentColor` and so
 * inherit the row's active/inactive gold. Decorative (`aria-hidden`).
 */
function RailIcon({
  iconType,
  className,
}: {
  iconType?: HomeContentRailIconType;
  className?: string;
}) {
  switch (iconType) {
    case "mask":
      return <MaskGlyph className={className} />;
    case "trophy":
      return <TrophyGlyph className={className} />;
    case "diamond":
      return <SparkleGlyph className={className} />;
    case "crescent":
      return <CrescentGlyph className={className} />;
    case "cycle":
      return <CycleGlyph className={className} />;
    case "patch":
    case "default":
    case undefined:
    default:
      return <GemBullet className={className} />;
  }
}

/** Shared props for the leaf glyph SVGs. */
interface GlyphProps {
  className?: string;
}

/** Base svg wrapper for the flat single-color category glyphs (16×16). */
function GlyphSvg({ className, children }: GlyphProps & { children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {children}
    </svg>
  );
}

/**
 * Theater / tragedy mask — WORLD CHAMPIONS row. A rounded shield-mask with two
 * slanted eye slits and a curved smile, matching the reference glyph.
 */
function MaskGlyph({ className }: GlyphProps) {
  return (
    <GlyphSvg className={className}>
      {/* Mask body: wide brow tapering to a chin. */}
      <path d="M2.4 3.2c1.9-.7 3.7-1 5.6-1s3.7.3 5.6 1c.3 3-.3 6-2.1 8.3-1 1.2-2.1 2-3.5 2s-2.5-.8-3.5-2C2.7 9.2 2.1 6.2 2.4 3.2Z" />
      {/* Eye slits + smile knocked out with the row/splash colour behind. */}
      <path
        fill="var(--color-hextech-black)"
        d="M4.9 6c.9-.5 1.7-.5 2.4.1-.7.6-1.5.7-2.4-.1Zm3.8.1c.7-.6 1.5-.6 2.4-.1-.9.8-1.7.7-2.4.1ZM5.6 9.1c1.5 1 3.3 1 4.8 0-.6 1-1.5 1.6-2.4 1.6s-1.8-.6-2.4-1.6Z"
      />
    </GlyphSvg>
  );
}

/**
 * Trophy / laurel wing — RANKED row. A stemmed cup on a plinth flanked by two
 * small handle wings, standing in for the reference's ranked emblem.
 */
function TrophyGlyph({ className }: GlyphProps) {
  return (
    <GlyphSvg className={className}>
      {/* Cup bowl. */}
      <path d="M4.5 2.2h7c0 2.6-.4 4.6-1.6 5.7-.6.6-1.4.9-1.9.9s-1.3-.3-1.9-.9C4.9 6.8 4.5 4.8 4.5 2.2Z" />
      {/* Side handles / wings. */}
      <path d="M4.4 2.8c-1.4.1-2 .9-2 2 0 1.2.9 2 2.3 2.1-.2-.6-.3-1.4-.3-2.1v-2Zm7.2 0c1.4.1 2 .9 2 2 0 1.2-.9 2-2.3 2.1.2-.6.3-1.4.3-2.1v-2Z" />
      {/* Stem + base plinth. */}
      <path d="M7.4 8.4h1.2v2.3h1.7v1.2H5.7v-1.2h1.7V8.4Zm-3 4.3h7.2v1.2H4.4v-1.2Z" />
    </GlyphSvg>
  );
}

/**
 * Sparkle diamond — SAHN-UZAL MORDEKAISER row. A four-pointed star with
 * concave sides and thin diagonal accents, the reference's skin-row glyph.
 */
function SparkleGlyph({ className }: GlyphProps) {
  return (
    <GlyphSvg className={className}>
      {/* Main four-pointed sparkle with concave waists. */}
      <path d="M8 .8c.5 3 1.5 4 4.5 4.5-3 .5-4 1.5-4.5 4.5-.5-3-1.5-4-4.5-4.5C6.5 4.8 7.5 3.8 8 .8Z" transform="translate(0 2.3)" />
      {/* Small diagonal spark accents at the diagonals. */}
      <path d="M2.9 3.1c1 .3 1.3.6 1.6 1.6.3-1 .6-1.3 1.6-1.6-1-.3-1.3-.6-1.6-1.6-.3 1-.6 1.3-1.6 1.6Z" opacity="0.75" />
      <path d="M11.5 11.8c1 .3 1.3.6 1.6 1.6.3-1 .6-1.3 1.6-1.6-1-.3-1.3-.6-1.6-1.6-.3 1-.6 1.3-1.6 1.6Z" opacity="0.75" />
    </GlyphSvg>
  );
}

/**
 * Crescent — ECLIPSE ETERNAL ASPECT DIANA row. A waxing crescent with a small
 * star nestled in its curve, echoing Diana's moon motif.
 */
function CrescentGlyph({ className }: GlyphProps) {
  return (
    <GlyphSvg className={className}>
      {/* Crescent: full disc minus an offset disc. */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 1a7 7 0 1 0 4.9 12A5.6 5.6 0 0 1 8 1Z"
      />
      {/* Small four-point star inside the crescent's hollow. */}
      <path d="M11.3 5.3c.3 1.4.6 1.7 2 2-1.4.3-1.7.6-2 2-.3-1.4-.6-1.7-2-2 1.4-.3 1.7-.6 2-2Z" />
    </GlyphSvg>
  );
}

/**
 * Cycle arrows — SEASON: PANDEMONIUM row. Two curved arrows chasing each other
 * in a ring, the reference's rotating-season glyph.
 */
function CycleGlyph({ className }: GlyphProps) {
  return (
    <GlyphSvg className={className}>
      {/* Two open arcs forming a rotation ring. */}
      <path d="M8 2.4a5.6 5.6 0 0 1 4.9 2.9l-.1.1H10a.7.7 0 0 0 0 1.4h4a.7.7 0 0 0 .7-.7v-4a.7.7 0 1 0-1.4 0v1.7A7 7 0 0 0 8 1a.7.7 0 0 0 0 1.4Z" />
      <path d="M8 13.6a5.6 5.6 0 0 1-4.9-2.9l.1-.1H6a.7.7 0 0 0 0-1.4H2a.7.7 0 0 0-.7.7v4a.7.7 0 1 0 1.4 0v-1.7A7 7 0 0 0 8 15a.7.7 0 0 0 0-1.4Z" />
    </GlyphSvg>
  );
}

/**
 * Gold gem/diamond bullet glyph — a faceted diamond, token-filled via
 * `currentColor` so it inherits the row's active/inactive gold. Decorative.
 * Also used for the PATCH NOTES pinned row (`iconType: "patch"`).
 */
function GemBullet({ className }: { className?: string }) {
  const gradientId = useId();

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id={gradientId} x1="8" y1="1" x2="8" y2="15" gradientUnits="userSpaceOnUse">
          <stop stopColor="currentColor" stopOpacity="0.9" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      <path d="M8 1 15 8 8 15 1 8 8 1Z" fill={`url(#${gradientId})`} />
      <path d="M8 1 15 8 8 15 1 8 8 1Z" stroke="currentColor" strokeWidth="0.75" strokeLinejoin="round" />
      <path d="M8 1 8 15M1 8 15 8" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.55" />
    </svg>
  );
}
