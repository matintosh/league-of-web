"use client";

import { useId } from "react";
import type { SummonerSpell } from "@low/fixtures";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SpellsTabProps {
  /** Full list of summoner spells to display in the 4-column grid. */
  spells: SummonerSpell[];
  /** Id of the currently selected spell. */
  selectedSpellId: string;
  /** Called when user clicks a spell cell. */
  onSelectSpell: (id: string) => void;
}

// ---------------------------------------------------------------------------
// Internal sub-components
// ---------------------------------------------------------------------------

interface SpellCellProps {
  spell: SummonerSpell;
  selected: boolean;
  onSelect: () => void;
  labelId: string;
}

function SpellCell({ spell, selected, onSelect, labelId }: SpellCellProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-labelledby={labelId}
      aria-pressed={selected}
      className={[
        "flex flex-col items-center gap-1 p-2 border transition-colors duration-150",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3",
        selected
          ? "border-gold-4 bg-blue-6"
          : "border-transparent bg-transparent hover:border-grey-3 hover:bg-blue-7",
      ].join(" ")}
    >
      <img
        src={spell.iconSrc}
        alt={spell.name}
        width={64}
        height={64}
        className="block shrink-0 w-16 h-16"
        style={{ imageRendering: "auto" }}
      />
      <span
        id={labelId}
        className="font-body text-xs text-grey-1 text-center leading-tight"
      >
        {spell.name}
      </span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// SpellsTab
// ---------------------------------------------------------------------------

/**
 * SpellsTab — Collection → Spells sub-tab.
 *
 * Two-column layout inside the Collection shell:
 * - Left (~300px): 4-column spell icon grid + thin divider + detail panel
 *   (spell name, unlock level, modes, description, cooldown).
 * - Right (flex-1): preview art (previewSrc) or bg-blue-8 fallback with
 *   the selected spell icon centered at 96px.
 *
 * Presentational only — props in, callbacks out. No data fetching.
 */
export function SpellsTab({ spells, selectedSpellId, onSelectSpell }: SpellsTabProps) {
  const uid = useId();
  const cellLabelId = (id: string) => `${uid}-spell-label-${id}`;

  const selected = spells.find((s) => s.id === selectedSpellId) ?? spells[0];

  return (
    <div className="flex h-full min-h-0 w-full">
      {/* ------------------------------------------------------------------ */}
      {/* Left column — grid + detail panel (~300px)                          */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="flex shrink-0 flex-col border-r border-gold-5 bg-hextech-black"
        style={{ width: 300 }}
      >
        {/* 4-column spell icon grid */}
        <div className="p-3">
          <div className="grid grid-cols-4 gap-0.5">
            {spells.map((spell) => (
              <SpellCell
                key={spell.id}
                spell={spell}
                selected={spell.id === selectedSpellId}
                onSelect={() => onSelectSpell(spell.id)}
                labelId={cellLabelId(spell.id)}
              />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="mx-3 border-t border-gold-5" />

        {/* Detail panel */}
        {selected && (
          <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-4 py-4">
            {/* Spell name */}
            <h2 className="font-display uppercase text-lg text-gold-1 leading-none">
              {selected.name}
            </h2>

            {/* Unlock level */}
            <p className="font-body text-xs text-grey-1 uppercase tracking-wide">
              {selected.unlockLabel}
            </p>

            {/* Available modes */}
            <p className="font-body text-xs text-grey-1">
              {selected.modes}
            </p>

            {/* Description */}
            <p className="font-body text-xs text-grey-1 leading-relaxed">
              {selected.description}
            </p>

            {/* Cooldown */}
            <p className="font-body text-xs text-grey-2">
              Cooldown: {selected.cooldownSeconds} seconds
            </p>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Right column — preview art or fallback                              */}
      {/* ------------------------------------------------------------------ */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-blue-8">
        {selected?.previewSrc ? (
          <>
            {/* Full-bleed background art, blurred + darkened */}
            <img
              src={selected.previewSrc}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ filter: "blur(4px) brightness(0.45)", transform: "scale(1.05)" }}
            />
            {/* Centered icon over art */}
            <div className="relative z-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              <img
                src={selected.iconSrc}
                alt={selected.name}
                width={96}
                height={96}
              />
            </div>
          </>
        ) : (
          /* Fallback — bg-blue-8 already on wrapper; just show icon centered */
          <img
            src={selected?.iconSrc}
            alt={selected?.name ?? ""}
            width={96}
            height={96}
            className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
          />
        )}
      </div>
    </div>
  );
}
