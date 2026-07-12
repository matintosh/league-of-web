"use client";

import { useId, useState } from "react";
import type { ChampionDetail, AbilityEntry } from "@low/fixtures";
import { championSplashUrl, loadingArtUrl } from "@low/fixtures";
import { SkinCard } from "./skin-card";

// ---------------------------------------------------------------------------
// Tab union + tab definitions
// ---------------------------------------------------------------------------

export type DetailTab = "overview" | "abilities" | "skins";

/** Exhaustive Record mapping — TypeScript will error if a tab is missing. */
const TAB_LABELS: Record<DetailTab, string> = {
  overview: "Overview",
  abilities: "Abilities",
  skins: "Skins",
};

const TABS: DetailTab[] = ["overview", "abilities", "skins"];

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
}

function OverviewTab({ champion }: OverviewTabProps) {
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
            <RadialStatWheel />
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

/** Decorative radial stat wheel — blue-2 arcs, stylised stat display. */
function RadialStatWheel() {
  const CX = 60;
  const CY = 60;
  const SIZE = 120;

  // Five stat arcs at different radii + angles
  const arcs = [
    { r: 50, start: -90, sweep: 270 },
    { r: 42, start: -90, sweep: 200 },
    { r: 34, start: -90, sweep: 160 },
  ];

  function arcPath(cx: number, cy: number, r: number, startDeg: number, sweepDeg: number): string {
    const toRad = (d: number) => (d * Math.PI) / 180;
    const endDeg = startDeg + sweepDeg;
    const x1 = cx + r * Math.cos(toRad(startDeg));
    const y1 = cy + r * Math.sin(toRad(startDeg));
    const x2 = cx + r * Math.cos(toRad(endDeg));
    const y2 = cy + r * Math.sin(toRad(endDeg));
    const large = sweepDeg > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  }

  return (
    <svg
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      aria-hidden="true"
    >
      {/* Background rings */}
      {arcs.map((a, i) => (
        <circle
          key={`bg-${i}`}
          cx={CX}
          cy={CY}
          r={a.r}
          fill="none"
          stroke="var(--color-grey-3)"
          strokeWidth="1"
        />
      ))}
      {/* Filled arcs */}
      {arcs.map((a, i) => (
        <path
          key={`arc-${i}`}
          d={arcPath(CX, CY, a.r, a.start, a.sweep)}
          fill="none"
          stroke="var(--color-blue-2)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity={0.8 - i * 0.15}
        />
      ))}
      {/* Center dot */}
      <circle cx={CX} cy={CY} r={3} fill="var(--color-blue-2)" />
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
              <div key={ability.key} className="flex flex-col items-center gap-1.5">
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
export function ChampionDetail({ champion, onClose, initialTab = "overview" }: ChampionDetailProps) {
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
          <CrestGlyph />
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
        {activeTab === "overview" && <OverviewTab champion={champion} />}
        {activeTab === "abilities" && (
          <AbilitiesTab abilities={champion.abilities} champId={champion.id} />
        )}
        {activeTab === "skins" && <SkinsTab champion={champion} />}
      </div>
    </div>
  );
}
