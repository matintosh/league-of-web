"use client";

import { Fragment, useId, useState } from "react";
import type { ChampionDetail, AbilityEntry, ChampionMastery } from "@low/fixtures";
import { championSplashUrl, loadingArtUrl, championSquareUrl } from "@low/fixtures";
import { SkinCard } from "./skin-card";

/**
 * Resolved CDN art for the Overview `RadialStatWheel`. All URLs are supplied by
 * the caller (component contract: URLs in, no fetching). When omitted, the wheel
 * falls back to a token-styled hand-drawn target so nothing breaks offline.
 *
 * Shape matches `CHAMPION_STAT_WHEEL_ART` from `@low/fixtures`.
 */
export interface StatWheelArt {
  /** Backing plate — concentric target with grey role glyphs baked at corners. */
  backing: string;
  /**
   * Filled teal arc-fan overlays, one per rating tier (index 0 = l1 … 2 = l3).
   * The wheel selects `segments[difficulty - 1]` to fill that many rings.
   */
  segments: readonly string[];
}

// ---------------------------------------------------------------------------
// Tab union + tab definitions
// ---------------------------------------------------------------------------

export type DetailTab = "overview" | "abilities" | "mastery" | "eternals" | "skins";

/** Exhaustive Record mapping — TypeScript will error if a tab is missing. */
const TAB_LABELS: Record<DetailTab, string> = {
  overview: "Overview",
  abilities: "Abilities",
  mastery: "Mastery",
  eternals: "Eternals",
  skins: "Skins",
};

const TABS: DetailTab[] = ["overview", "abilities", "mastery", "eternals", "skins"];

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface ChampionDetailProps {
  /** Full champion detail data — id, name, title, lore, abilities, skins, stats. */
  champion: ChampionDetail;
  /**
   * Called when the user closes the overlay via the ✕ button.
   *
   * NOTE: Escape key handling is intentionally OUT OF SCOPE for this component.
   * The parent screen (collection-screen.tsx) is responsible for listening to
   * keyboard events and calling onClose. Reason: the overlay sits inside a
   * larger shell that may have other Escape listeners; delegating upward
   * avoids double-handling and keeps this component side-effect-free.
   */
  onClose: () => void;
  /**
   * Initially active tab. Defaults to "overview".
   *
   * TAB STATE DECISION: Internal.
   * ChampionDetail is a self-contained overlay — it has no siblings that need
   * to know which tab is active, and callers never need to control or read the
   * tab. The FilterTabs component (a reusable filter row shared by many pages)
   * is controlled because it must be composed with external state (sort, search).
   * This overlay has no such coordination need, so internal state is the right
   * call. It reduces prop-drilling and simplifies every call site.
   * Documented here as the deliberate exception to the FilterTabs precedent.
   */
  initialTab?: DetailTab;
  /**
   * Mastery data for the MASTERY tab. When absent, the tab renders a
   * "Not yet ranked" placeholder state.
   */
  mastery?: ChampionMastery;
  /**
   * Resolved CDN art for the Overview stat wheel (`CHAMPION_STAT_WHEEL_ART`
   * from `@low/fixtures`). When omitted, the wheel renders a token-styled
   * hand-drawn fallback — the component never fetches these itself.
   */
  statWheelArt?: StatWheelArt;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Small gold wolf-paw/crest glyph used in the header. */
function CrestGlyph() {
  return (
    <svg
      width={40}
      height={40}
      viewBox="0 0 40 40"
      aria-hidden="true"
      className="shrink-0 text-gold-3"
    >
      {/* Stylised hextech crest — simplified geometric approximation */}
      <polygon
        points="20,4 36,12 36,28 20,36 4,28 4,12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <polygon
        points="20,10 30,16 30,26 20,32 10,26 10,16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.6"
      />
      <circle cx="20" cy="20" r="3" fill="currentColor" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Overview tab
// ---------------------------------------------------------------------------

interface OverviewTabProps {
  champion: ChampionDetail;
  statWheelArt?: StatWheelArt;
}

function OverviewTab({ champion, statWheelArt }: OverviewTabProps) {
  const FILLED_SEGS = champion.difficulty;
  const TOTAL_SEGS = 3;

  return (
    <div className="relative flex h-full min-h-0 overflow-hidden">
      {/* Full-bleed splash art */}
      <img
        src={championSplashUrl(champion.id, 0)}
        alt={champion.name}
        className="absolute inset-0 h-full w-full object-cover object-top"
        aria-hidden="true"
      />

      {/* Left gradient scrim — fades splash behind the info panel */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-[420px]"
        style={{
          background:
            "linear-gradient(to right, var(--color-hextech-black) 55%, transparent 100%)",
        }}
      />

      {/* Info panel — sits above the scrim */}
      <div className="relative z-10 flex h-full flex-col justify-center gap-3 px-8 py-6" style={{ width: 380 }}>
        {/* Two-column row: stats labels left, RadialStatWheel right */}
        <div className="flex items-center gap-6">
          {/* Left column: Damage / Style / Difficulty */}
          <div className="flex flex-col gap-3 flex-1 min-w-0">
            {/* Damage */}
            <div>
              <p className="font-body text-xs uppercase tracking-widest text-grey-1">
                Damage:
              </p>
              <p className="font-body text-sm text-gold-cream">{champion.damage}</p>
            </div>

            {/* Style slider */}
            <div>
              <p className="font-body text-xs uppercase tracking-widest text-grey-1 mb-2">
                Style:
              </p>
              <div className="relative flex items-center gap-2">
                {/* Left glyph — fighter/melee */}
                <svg width={16} height={16} viewBox="0 0 16 16" aria-hidden="true" className="shrink-0 text-grey-1">
                  <path d="M8 2 L14 8 L8 14 L2 8 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
                </svg>
                {/* Track */}
                <div className="relative flex-1 h-[2px] bg-grey-3">
                  {/* Filled portion */}
                  <div
                    className="absolute inset-y-0 left-0 bg-gold-3"
                    style={{ width: `${champion.styleFraction * 100}%` }}
                  />
                  {/* Dot */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-3 w-3 rounded-full border-2 border-gold-3 bg-hextech-black"
                    style={{ left: `${champion.styleFraction * 100}%` }}
                  />
                </div>
                {/* Right glyph — mage/ranged */}
                <svg width={16} height={16} viewBox="0 0 16 16" aria-hidden="true" className="shrink-0 text-grey-1">
                  <circle cx="8" cy="8" r="5" fill="none" stroke="currentColor" strokeWidth="1.2" />
                  <circle cx="8" cy="8" r="2" fill="currentColor" />
                </svg>
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <p className="font-body text-xs uppercase tracking-widest text-grey-1 mb-2">
                Difficulty:
              </p>
              <div className="flex items-center gap-1.5">
                {Array.from({ length: TOTAL_SEGS }).map((_, i) => (
                  <div
                    key={i}
                    className={[
                      "h-[6px] flex-1 rounded-sm",
                      i < FILLED_SEGS ? "bg-gold-3" : "bg-grey-3",
                    ].join(" ")}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right column: RadialStatWheel */}
          <div className="shrink-0">
            <RadialStatWheel difficulty={champion.difficulty} art={statWheelArt} />
          </div>
        </div>

        {/* Lore */}
        <p className="font-body text-sm leading-relaxed text-grey-1 line-clamp-5">
          {champion.lore}
        </p>

        {/* Bottom action row */}
        <div className="flex items-center gap-3">
          {/* OWNED chip */}
          <div className="border border-grey-2 px-4 py-1.5">
            <span className="font-display text-xs uppercase tracking-widest text-grey-1">
              Owned
            </span>
          </div>
          {/* Learn More — external link styled as secondary button */}
          <a
            href={`https://universe.leagueoflegends.com/en_US/champion/${champion.id.toLowerCase()}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center border border-gold-4 bg-grey-4 px-4 py-1.5 font-display text-xs uppercase tracking-widest text-gold-cream hover:border-gold-3 hover:text-gold-1 transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3"
          >
            Learn More ↗
          </a>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// RadialStatWheel — filled segmented radial diagram (champion-overview target).
//
// Reference: docs/reference/client-champion-overview-statwheel.jpg
//
// The real client composites TWO CDN images from the champion-details plugin
// (issue #438), supplied as resolved URLs via the `art` prop:
//   1. `cdp_graph_backing.png` (800×800) — the dark concentric target plate,
//      with the four grey generic role glyphs (goblet/shield/fist/spiral) and
//      the bright-teal centre dot already baked in at NW/NE/SW/SE.
//   2. `cdp-graph-segment-l{1,2,3}.png` (800×800) — the filled teal "signal
//      fan" overlay, centred on the plate; the tier (l1/l2/l3) maps 1:1 to the
//      champion `difficulty` rating (1 → l1 … 3 → l3), lighting that many rings.
// Both are transparent PNGs pre-tinted to the exact client teal, so no CSS
// color is applied — the tokens rule is about CSS colors, not asset URLs.
//
// FALLBACK (art absent): a token-styled hand-drawn target — two concentric
// annular bands alternating blue-3 / dark-teal over a hextech-black backing,
// a blue-3 centre dot, and hand-traced grey role glyphs at the corners. This
// keeps the showcase and offline renders from breaking with no layout shift.
//
// Fallback color mapping (reference rgb → token):
//   bright segment  rgb(0,151,172)   → var(--color-blue-3)  (#0397ab)
//   dark segment    rgb(77,126,137)  → color-mix(blue-3 52%, hextech-black)
//   navy backing    rgb(2,10,20)     → var(--color-hextech-black) (#010a13)
//   center dot      rgb(0,157,179)   → var(--color-blue-3)
//   role glyphs     rgb(165,165,157) → var(--color-grey-1)  (#a09b8c)
// ---------------------------------------------------------------------------

/** One filled annular segment (donut wedge) between two radii, two angles. */
function annularSegment(
  cx: number,
  cy: number,
  rInner: number,
  rOuter: number,
  startDeg: number,
  endDeg: number,
): string {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const p = (r: number, d: number): [number, number] => [
    cx + r * Math.cos(toRad(d)),
    cy + r * Math.sin(toRad(d)),
  ];
  const [x1, y1] = p(rOuter, startDeg);
  const [x2, y2] = p(rOuter, endDeg);
  const [x3, y3] = p(rInner, endDeg);
  const [x4, y4] = p(rInner, startDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return [
    `M ${x1} ${y1}`,
    `A ${rOuter} ${rOuter} 0 ${large} 1 ${x2} ${y2}`,
    `L ${x3} ${y3}`,
    `A ${rInner} ${rInner} 0 ${large} 0 ${x4} ${y4}`,
    "Z",
  ].join(" ");
}

/** Simple role glyph silhouettes traced from the reference (goblet/shield/fist/spiral). */
function RoleGlyph({ role }: { role: "goblet" | "shield" | "fist" | "spiral" }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 16 16",
    fill: "none" as const,
    stroke: "currentColor",
    "aria-hidden": true,
  };
  switch (role) {
    case "goblet":
      // Chalice / goblet — bowl on a stem and foot.
      return (
        <svg {...common} className="text-grey-1">
          <path d="M4 2 H12 A4 4 0 0 1 8 8 A4 4 0 0 1 4 2 Z" strokeWidth="1.1" strokeLinejoin="round" />
          <line x1="8" y1="8" x2="8" y2="12" strokeWidth="1.1" />
          <line x1="5" y1="13" x2="11" y2="13" strokeWidth="1.1" strokeLinecap="round" />
        </svg>
      );
    case "shield":
      // Kite shield crest.
      return (
        <svg {...common} className="text-grey-1">
          <path d="M8 2 L13 4 V8 C13 11 10.5 13.2 8 14 C5.5 13.2 3 11 3 8 V4 Z" strokeWidth="1.1" strokeLinejoin="round" />
          <line x1="8" y1="4.5" x2="8" y2="12" strokeWidth="0.9" opacity="0.6" />
        </svg>
      );
    case "fist":
      // Gauntlet / clenched fist.
      return (
        <svg {...common} className="text-grey-1">
          <path d="M4 7 V5.5 A1 1 0 0 1 6 5.5 V6.5 M6 6 V4.5 A1 1 0 0 1 8 4.5 V6 M8 5.5 A1 1 0 0 1 10 5.5 V6.5 M10 6.5 V6 A1 1 0 0 1 12 6.5 V10 A4 4 0 0 1 4 10 Z" strokeWidth="1" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
      );
    case "spiral":
      // Spiral / vortex.
      return (
        <svg {...common} className="text-grey-1">
          <path d="M8 8 A1.5 1.5 0 0 1 9.5 6.5 A3 3 0 0 1 6.5 9.5 A4.5 4.5 0 0 1 11 5 A6 6 0 0 1 5 11" strokeWidth="1.1" strokeLinecap="round" />
        </svg>
      );
  }
}

/**
 * Radial stat wheel — the champion-overview target diagram.
 *
 * When `art` is supplied, composites the real client CDN images: the
 * `cdp_graph_backing` plate with the `cdp-graph-segment-l{difficulty}` teal
 * fan layered on top (center-aligned). When `art` is absent, renders a
 * token-styled hand-drawn fallback (see `RadialStatWheelFallback`).
 *
 * @param difficulty Rating 1–3; selects the l1/l2/l3 segment overlay.
 * @param art Resolved CDN URLs; omit for the hand-drawn fallback.
 */
function RadialStatWheel({
  difficulty,
  art,
}: {
  difficulty: 1 | 2 | 3;
  art?: StatWheelArt;
}) {
  const SIZE = 132;

  // Real CDN art path — backing plate + the matching-tier teal segment fan.
  const segmentSrc = art?.segments[difficulty - 1];
  if (art) {
    return (
      <div
        className="relative shrink-0"
        style={{ width: SIZE, height: SIZE }}
        aria-hidden="true"
      >
        {/* Backing plate (grey role glyphs + centre dot baked in) */}
        <img
          src={art.backing}
          alt=""
          width={SIZE}
          height={SIZE}
          className="absolute inset-0 h-full w-full object-contain"
        />
        {/* Filled teal segment fan for this difficulty tier, centred over it */}
        {segmentSrc && (
          <img
            src={segmentSrc}
            alt=""
            width={SIZE}
            height={SIZE}
            className="absolute inset-0 h-full w-full object-contain"
          />
        )}
      </div>
    );
  }

  return <RadialStatWheelFallback />;
}

/**
 * Token-styled hand-drawn stat wheel — the offline fallback when no CDN art is
 * supplied. Filled segmented concentric target with a blue-3 center dot and
 * four traced role glyphs at the corners. See block comment above for the
 * reference color mapping.
 */
function RadialStatWheelFallback() {
  const id = useId();
  const SIZE = 132;
  const CX = SIZE / 2;
  const CY = SIZE / 2;

  const DOT_R = 6;
  // Two concentric bands. Radii scaled from the 108px reference footprint.
  const bands = [
    { rInner: 12, rOuter: 26 }, // inner band
    { rInner: 32, rOuter: 47 }, // outer band
  ];
  const SEGMENTS = 12; // radial divisions per band
  const GAP_DEG = 3; // thin navy gap between segments

  const bright = "var(--color-blue-3)";
  const dark = "color-mix(in srgb, var(--color-blue-3) 52%, var(--color-hextech-black))";

  return (
    <svg
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      aria-hidden="true"
      className="shrink-0"
    >
      {/* Dark navy backing disc — segments and gaps sit over it */}
      <circle cx={CX} cy={CY} r={49} fill="var(--color-hextech-black)" />

      {/* Filled segmented bands */}
      {bands.map((band, bi) =>
        Array.from({ length: SEGMENTS }).map((_, si) => {
          const step = 360 / SEGMENTS;
          const start = si * step - 90 + GAP_DEG / 2;
          const end = (si + 1) * step - 90 - GAP_DEG / 2;
          // Alternate bright/dark; offset the outer band so bands interlock.
          const isBright = (si + bi) % 2 === 0;
          return (
            <path
              key={`${id}-seg-${bi}-${si}`}
              d={annularSegment(CX, CY, band.rInner, band.rOuter, start, end)}
              fill={isBright ? bright : dark}
            />
          );
        }),
      )}

      {/* Center dot — bright teal (blue-3) */}
      <circle cx={CX} cy={CY} r={DOT_R} fill="var(--color-blue-3)" />

      {/* Four role glyphs flanking the wheel at NW / NE / SW / SE */}
      <foreignObject x={2} y={4} width="16" height="16">
        <RoleGlyph role="goblet" />
      </foreignObject>
      <foreignObject x={SIZE - 18} y={4} width="16" height="16">
        <RoleGlyph role="shield" />
      </foreignObject>
      <foreignObject x={2} y={SIZE - 20} width="16" height="16">
        <RoleGlyph role="fist" />
      </foreignObject>
      <foreignObject x={SIZE - 18} y={SIZE - 20} width="16" height="16">
        <RoleGlyph role="spiral" />
      </foreignObject>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Abilities tab
// ---------------------------------------------------------------------------

interface AbilitiesTabProps {
  abilities: ChampionDetail["abilities"];
  champId: string;
}

function AbilitiesTab({ abilities, champId }: AbilitiesTabProps) {
  const [selectedKey, setSelectedKey] = useState<AbilityEntry["key"]>("P");
  const tabId = useId();

  const selected = abilities.find((a) => a.key === selectedKey)!;

  return (
    <div className="relative flex h-full min-h-0 overflow-hidden">
      {/* Background splash — abilities tab shows the same splash, slightly darker */}
      <img
        src={championSplashUrl(champId, 0)}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-top"
        aria-hidden="true"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: "color-mix(in srgb, var(--color-hextech-black) 72%, transparent)" }}
      />

      {/* Content panel */}
      <div className="relative z-10 flex h-full flex-col px-8 py-10" style={{ width: 420 }}>
        {/* Ability icon row */}
        <div
          role="tablist"
          aria-label="Ability slots"
          className="flex items-end gap-3 mb-8"
        >
          {abilities.map((ability) => {
            const isActive = ability.key === selectedKey;
            return (
              <Fragment key={ability.key}>
              <div className="flex flex-col items-center gap-1.5">
                <button
                  type="button"
                  role="tab"
                  id={`${tabId}-tab-${ability.key}`}
                  aria-selected={isActive}
                  aria-controls={`${tabId}-panel`}
                  onClick={() => setSelectedKey(ability.key)}
                  className={[
                    "relative h-14 w-14 overflow-hidden transition-all duration-150 cursor-pointer",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3",
                    isActive
                      ? "border-2 border-gold-2 drop-shadow-[0_0_8px_var(--color-gold-3)]"
                      : "border border-grey-3 hover:border-gold-4 brightness-75 hover:brightness-100",
                  ].join(" ")}
                >
                  <img
                    src={ability.iconSrc}
                    alt={ability.name}
                    width={56}
                    height={56}
                    className="h-full w-full object-cover"
                  />
                </button>
                <span className="font-display text-xs uppercase tracking-widest text-grey-1">
                  {ability.key}
                </span>
              </div>
              {/* Passive→spell separator (#1031): 1px grey divider after the P slot */}
              {ability.key === "P" && (
                <div aria-hidden="true" className="self-stretch w-px bg-grey-3" />
              )}
              </Fragment>
            );
          })}
        </div>

        {/* Ability detail */}
        <div
          id={`${tabId}-panel`}
          role="tabpanel"
          aria-labelledby={`${tabId}-tab-${selectedKey}`}
        >
          <h3 className="font-display text-xl uppercase tracking-wider text-gold-1 mb-3">
            {selected.name}
          </h3>
          <p className="font-body text-sm leading-relaxed text-grey-1">
            {selected.description}
          </p>
        </div>

        {/* Video-out-of-scope note — no video placeholder rendered */}
        {/* Right side: per-reference the abilities tab shows the splash bg only; video playback is out of scope. */}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mastery tab
// ---------------------------------------------------------------------------

interface MasteryTabProps {
  mastery?: ChampionMastery;
  champId: string;
}

/**
 * Fallback SVG crest ring — used when no image loads or level < 5.
 * Renders a stylised gold hexagonal crest with a center gem shape.
 */
function MasteryCrestSvg({ level }: { level: number }) {
  const id = useId();
  return (
    <svg
      width={200}
      height={200}
      viewBox="0 0 200 200"
      aria-hidden="true"
      role="img"
    >
      <defs>
        <radialGradient id={`${id}-gem`} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="var(--color-blue-2)" stopOpacity="0.9" />
          <stop offset="60%" stopColor="var(--color-blue-4)" stopOpacity="0.7" />
          <stop offset="100%" stopColor="var(--color-hextech-black)" stopOpacity="1" />
        </radialGradient>
      </defs>
      {/* Outer gold ring */}
      <circle cx="100" cy="100" r="92" fill="none" stroke="var(--color-gold-2)" strokeWidth="3" />
      {/* Inner thin ring */}
      <circle cx="100" cy="100" r="82" fill="none" stroke="var(--color-gold-4)" strokeWidth="1" />
      {/* Hexagonal frame */}
      <polygon
        points="100,20 172,62 172,138 100,180 28,138 28,62"
        fill="none"
        stroke="var(--color-gold-3)"
        strokeWidth="2"
      />
      {/* Center gem */}
      <polygon
        points="100,55 140,78 140,122 100,145 60,122 60,78"
        fill={`url(#${id}-gem)`}
        stroke="var(--color-gold-2)"
        strokeWidth="1.5"
      />
      {/* Level number */}
      <text
        x="100"
        y="108"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="36"
        fontFamily="var(--font-display)"
        fill="var(--color-gold-1)"
        fontWeight="bold"
      >
        {level}
      </text>
    </svg>
  );
}

function MasteryTab({ mastery, champId }: MasteryTabProps) {
  const hasMastery = mastery != null;

  return (
    <div className="relative flex h-full min-h-0 overflow-hidden bg-blue-7">
      {/* Subtle splash background scrim — same as abilities tab but darker */}
      <img
        src={championSplashUrl(champId, 0)}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-top"
        aria-hidden="true"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: "color-mix(in srgb, var(--color-hextech-black) 88%, transparent)" }}
      />

      {/* Main content area */}
      <div className="relative z-10 flex h-full w-full min-h-0">
        {/* Center zone */}
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 py-6 min-w-0">
          {hasMastery ? (
            <>
              {/* Mastery crest image with SVG fallback */}
              <div className="relative flex items-center justify-center" style={{ width: 200, height: 200 }}>
                <img
                  src={mastery.masteryCrestSrc}
                  alt={`Mastery level ${mastery.level} crest`}
                  width={200}
                  height={200}
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    // Hide broken image; the SVG fallback below takes over
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
                {/* Always-present SVG overlay — renders ABOVE the crest img (level ring + number); img is the photographic base beneath */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <MasteryCrestSvg level={mastery.level} />
                </div>
              </div>

              {/* Level label */}
              <div className="text-center">
                <p className="font-display text-xl uppercase tracking-widest text-gold-1">
                  Level {mastery.level} Mastery
                </p>
                <p className="font-body text-sm text-grey-1 mt-1">
                  {mastery.points.toLocaleString()} pts
                </p>
              </div>

              {/* Action icon row — Wishlist / Share */}
              <div className="flex items-center gap-4 mt-1">
                <button
                  type="button"
                  aria-label="Add to wishlist"
                  className="flex h-8 w-8 items-center justify-center border border-gold-4 text-gold-2 hover:border-gold-2 hover:text-gold-1 transition-colors duration-150 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3"
                >
                  {/* Heart icon */}
                  <svg width={14} height={14} viewBox="0 0 14 14" aria-hidden="true" fill="none">
                    <path
                      d="M7 12S1 8.5 1 4.5C1 2.57 2.57 1 4.5 1c1 0 1.93.5 2.5 1.3C7.57 1.5 8.5 1 9.5 1 11.43 1 13 2.57 13 4.5 13 8.5 7 12 7 12z"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  aria-label="Share"
                  className="flex h-8 w-8 items-center justify-center border border-gold-4 text-gold-2 hover:border-gold-2 hover:text-gold-1 transition-colors duration-150 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3"
                >
                  {/* Share/link icon */}
                  <svg width={14} height={14} viewBox="0 0 14 14" aria-hidden="true" fill="none">
                    <circle cx="11" cy="3" r="1.5" stroke="currentColor" strokeWidth="1.2" />
                    <circle cx="11" cy="11" r="1.5" stroke="currentColor" strokeWidth="1.2" />
                    <circle cx="3" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.2" />
                    <line x1="4.4" y1="6.3" x2="9.6" y2="3.7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    <line x1="4.4" y1="7.7" x2="9.6" y2="10.3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              {/* Bottom reward strip */}
              <div className="mt-auto w-full border-t border-gold-5 pt-3">
                <div className="flex items-center gap-3">
                  {/* Split selector */}
                  <div className="flex items-center gap-2 border border-grey-3 bg-grey-cool px-3 py-1.5">
                    <span className="font-display text-xs uppercase tracking-widest text-grey-1">
                      Start
                    </span>
                    <span className="font-body text-xs text-grey-2">|</span>
                    <span className="font-display text-xs uppercase tracking-widest text-gold-2">
                      Split 2
                    </span>
                    <svg width={10} height={10} viewBox="0 0 10 10" aria-hidden="true" className="text-grey-1">
                      <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" />
                    </svg>
                  </div>
                  {/* Reward icon slots */}
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="h-10 w-10 border border-gold-5 bg-blue-8 flex items-center justify-center"
                        aria-label={`Reward slot ${i}`}
                      >
                        <svg width={18} height={18} viewBox="0 0 18 18" aria-hidden="true" className="text-gold-4">
                          <polygon
                            points="9,2 16,6 16,12 9,16 2,12 2,6"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                          />
                          <circle cx="9" cy="9" r="2" fill="currentColor" opacity="0.5" />
                        </svg>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* No mastery data — placeholder state */
            <div className="flex flex-col items-center gap-4 text-center">
              <MasteryCrestSvg level={0} />
              <p className="font-display text-lg uppercase tracking-widest text-grey-2">
                Not Yet Ranked
              </p>
              <p className="font-body text-sm text-grey-2 max-w-xs">
                Play games with this champion to earn mastery points and unlock rewards.
              </p>
            </div>
          )}
        </div>

        {/* Right sidebar — Milestone panel (only shown when mastery data present) */}
        {hasMastery && (
          <div
            className="shrink-0 flex flex-col gap-3 border-l border-gold-5 px-5 py-6"
            style={{ width: 220, background: "color-mix(in srgb, var(--color-blue-8) 80%, transparent)" }}
          >
            {/* Milestone header */}
            <p className="font-display text-xs uppercase tracking-widest text-gold-2">
              {mastery.currentMilestone ?? "Milestone I"}
            </p>
            <div className="h-px bg-gold-5" />

            {/* Checklist */}
            {(mastery.milestoneChecks ?? []).map((check, i) => (
              <div key={i} className="flex items-start gap-2">
                {/* Checkbox mark */}
                <div
                  className={[
                    "mt-0.5 shrink-0 h-3.5 w-3.5 border",
                    check.fulfilled ? "border-gold-2 bg-gold-4" : "border-grey-3",
                  ].join(" ")}
                >
                  {check.fulfilled && (
                    <svg viewBox="0 0 14 14" className="h-full w-full text-gold-1" aria-hidden="true">
                      <path d="M2 7l3.5 3.5L12 3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                    </svg>
                  )}
                </div>
                <span className="font-body text-xs text-grey-1 leading-snug">{check.label}</span>
              </div>
            ))}

            {/* Next milestone rewards */}
            {(mastery.nextMilestoneRewards ?? []).length > 0 && (
              <>
                <div className="h-px bg-gold-5 mt-2" />
                <p className="font-display text-xs uppercase tracking-widest text-gold-3">
                  Next Milestone Rewards
                </p>
                <ul className="flex flex-col gap-1">
                  {mastery.nextMilestoneRewards!.map((reward, i) => (
                    <li key={i} className="font-body text-xs text-grey-1 flex items-center gap-1.5">
                      <span className="text-gold-3">•</span>
                      {reward}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Eternals tab
// ---------------------------------------------------------------------------

function EternalsTab() {
  return (
    <div className="flex h-full min-h-0 flex-col items-center justify-center gap-4 bg-hextech-black px-8 py-10">
      {/* Eternals orb icon — inline SVG approximation of the Eternals gem */}
      <svg
        width={80}
        height={80}
        viewBox="0 0 80 80"
        aria-hidden="true"
      >
        <circle cx="40" cy="40" r="36" fill="none" stroke="var(--color-gold-4)" strokeWidth="1" />
        <circle cx="40" cy="40" r="28" fill="none" stroke="var(--color-gold-5)" strokeWidth="1" opacity="0.5" />
        {/* Gem facets */}
        <polygon
          points="40,12 62,30 62,50 40,68 18,50 18,30"
          fill="none"
          stroke="var(--color-gold-3)"
          strokeWidth="1"
          opacity="0.6"
        />
        <polygon
          points="40,22 54,32 54,48 40,58 26,48 26,32"
          fill="var(--color-blue-7)"
          stroke="var(--color-gold-4)"
          strokeWidth="1"
          opacity="0.8"
        />
        {/* Sparkle cross */}
        <line x1="40" y1="28" x2="40" y2="52" stroke="var(--color-blue-2)" strokeWidth="1" opacity="0.5" />
        <line x1="28" y1="40" x2="52" y2="40" stroke="var(--color-blue-2)" strokeWidth="1" opacity="0.5" />
      </svg>

      <p className="font-display text-lg uppercase tracking-widest text-grey-2">
        No Eternals Earned
      </p>
      <p className="font-body text-sm text-grey-2 max-w-xs text-center leading-relaxed">
        Eternals track and showcase your champion mastery milestones. Unlock Eternals
        in the store to begin tracking your legacy.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Skins tab
// ---------------------------------------------------------------------------

interface SkinsTabProps {
  champion: ChampionDetail;
}

function SkinsTab({ champion }: SkinsTabProps) {
  return (
    <div className="h-full overflow-y-auto bg-hextech-black px-8 py-8">
      <div className="flex flex-wrap gap-4">
        {champion.skins.map((skin) => (
          <SkinCard
            key={skin.skinIndex}
            name={skin.name}
            imageSrc={loadingArtUrl(champion.id, skin.skinIndex)}
            owned={skin.owned}
          />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ChampionDetail
// ---------------------------------------------------------------------------

/**
 * ChampionDetail — full-window champion detail overlay for the collection screen.
 *
 * Covers the content area below the navbar; the social rail stays visible (the
 * parent shell controls layout — this component fills its container via h-full).
 *
 * **Tab state: INTERNAL** (see `initialTab` JSDoc for rationale).
 *
 * **Escape key: OUT OF SCOPE** — see `onClose` JSDoc.
 *
 * Presentational only — props in, callbacks out. No data fetching.
 */
export function ChampionDetail({ champion, onClose, initialTab = "overview", mastery, statWheelArt }: ChampionDetailProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>(initialTab);
  const headingId = useId();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={headingId}
      className="flex h-full flex-col bg-hextech-black"
      style={{
        filter: "drop-shadow(0 0 24px rgba(0,0,0,0.8))",
      }}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                             */}
      {/* ------------------------------------------------------------------ */}
      <div className="relative shrink-0 border-b border-gold-5 bg-blue-7 px-6 pt-5 pb-0">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close champion detail"
          className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full border border-grey-3 text-grey-1 hover:border-gold-3 hover:text-gold-1 transition-colors duration-150 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3"
        >
          <svg width={10} height={10} viewBox="0 0 10 10" aria-hidden="true">
            <line x1="1" y1="1" x2="9" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="9" y1="1" x2="1" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* Champion identity */}
        <div className="flex items-center gap-4 mb-4">
          {/* Real Data Dragon champion square portrait (#1030) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={championSquareUrl(champion.id)}
            alt=""
            aria-hidden="true"
            width={56}
            height={56}
            className="shrink-0 border border-gold-4 object-cover"
          />
          <div>
            <h2
              id={headingId}
              className="font-display text-2xl uppercase tracking-widest text-gold-1"
            >
              {champion.name}
            </h2>
            <p className="font-body text-xs uppercase tracking-wide text-gold-cream mt-0.5">
              {champion.title}
            </p>
          </div>
        </div>

        {/* Tab row */}
        <div role="tablist" aria-label="Champion detail tabs" className="flex gap-8">
          {TABS.map((tab) => {
            const isActive = tab === activeTab;
            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab)}
                className={[
                  "shrink-0 pb-2 font-display text-sm uppercase tracking-widest transition-colors duration-150 cursor-pointer",
                  "border-b-2",
                  isActive
                    ? "border-gold-3 text-gold-2"
                    : "border-transparent text-grey-1 hover:text-gold-1",
                ].join(" ")}
              >
                {TAB_LABELS[tab]}
              </button>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Tab content                                                        */}
      {/* ------------------------------------------------------------------ */}
      <div className="relative flex-1 min-h-0">
        {activeTab === "overview" && <OverviewTab champion={champion} statWheelArt={statWheelArt} />}
        {activeTab === "abilities" && (
          <AbilitiesTab abilities={champion.abilities} champId={champion.id} />
        )}
        {activeTab === "mastery" && (
          <MasteryTab mastery={mastery} champId={champion.id} />
        )}
        {activeTab === "eternals" && <EternalsTab />}
        {activeTab === "skins" && <SkinsTab champion={champion} />}
      </div>
    </div>
  );
}
