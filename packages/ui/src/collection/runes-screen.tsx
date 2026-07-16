"use client";

import { useId } from "react";

// ---------------------------------------------------------------------------
// DDragon perk-images base — version-independent path per DDragon docs.
// All URLs verified HTTP 200 as of 2026-07.
// ---------------------------------------------------------------------------
const DDRAGON_PERKS = "https://ddragon.leagueoflegends.com/cdn/img/perk-images";

/** Map from numeric DDragon style ID → DDragon name string (used in numbered filename). */
const RUNE_PATH_BY_ID: Record<number, string> = {
  7201: "Precision",
  7200: "Domination",
  7202: "Sorcery",
  7204: "Resolve",
  7203: "Whimsy", // Inspiration is stored as "Whimsy" in DDragon path icons
};

/**
 * Rune path style icon URL. DDragon uses numbered filenames:
 * e.g. `Styles/7201_Precision.png`.
 * @param numericId — DDragon style id (7200-7204)
 */
export const runePathIconUrl = (numericId: number): string =>
  `${DDRAGON_PERKS}/Styles/${numericId}_${RUNE_PATH_BY_ID[numericId] ?? "Unknown"}.png`;

/**
 * Keystone / rune slot icon URL. DDragon path pattern:
 * `Styles/{PathName}/{FolderName}/{IconName}.png`
 * e.g. `Styles/Domination/Electrocute/Electrocute.png`
 */
export const runeIconUrl = (pathName: string, folderName: string, iconName: string): string =>
  `${DDRAGON_PERKS}/Styles/${pathName}/${folderName}/${iconName}.png`;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RunePath {
  /** Numeric DDragon style ID: 7201=Precision, 7200=Domination, 7202=Sorcery, 7204=Resolve, 7203=Inspiration */
  id: number;
  /** Display name, e.g. "Precision" */
  name: string;
  /** Verified HTTP 200 icon URL from DDragon perk-images */
  iconUrl: string;
}

export interface RunePage {
  id: string;
  name: string;
  /** True = Riot preset page; false = custom user page */
  isPreset: boolean;
  primaryPath: RunePath;
  secondaryPath: RunePath;
  /** Rune names shown in the hover overlay for primary path (keystone + up to 3 runes) */
  primaryRunes: string[];
  /** Rune names shown in the hover overlay for secondary path */
  secondaryRunes: string[];
  /** Key-art background image URL — typically a champion splash */
  artUrl?: string;
  /** Verified DDragon icon URL for the primary keystone rune */
  keystoneIconUrl?: string;
  /** Verified DDragon icon URL for a secondary rune */
  secondaryIconUrl?: string;
}

export interface RunesScreenProps {
  pages: RunePage[];
  /** Total page slots, e.g. 3 — shown as `XX / 03` */
  maxPages: number;
  /** Called when a page card is clicked */
  onSelectPage: (id: string) => void;
  /** Called when CREATE NEW button or CREATE NEW card is clicked */
  onCreatePage: () => void;
  /** Called when trash icon button is clicked */
  onDeletePage: (id: string) => void;
  /** Id of currently selected page, if any */
  selectedPageId?: string;
  /** Controlled search query */
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  /** Whether preset pages are hidden */
  hidePresets?: boolean;
  onHidePresetsChange?: (v: boolean) => void;
  /**
   * Full path set for the filter row (all five paths always visible, per the
   * reference). When omitted, falls back to paths derived from the pages list
   * (back-compat).
   */
  paths?: RunePath[];
  /** Active path filter (string-form of numeric id), or null = all paths */
  activePathFilter?: string | null;
  onPathFilterChange?: (pathId: string | null) => void;
}

// ---------------------------------------------------------------------------
// Internal sub-components
// ---------------------------------------------------------------------------

/** Diamond-plus placeholder used in the CREATE NEW card center */
function DiamondPlusIcon() {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      aria-hidden="true"
      fill="none"
    >
      <rect
        x="6"
        y="6"
        width="52"
        height="52"
        stroke="var(--color-gold-4)"
        strokeWidth="1.5"
        transform="rotate(45, 32, 32)"
      />
      <rect
        x="13"
        y="13"
        width="38"
        height="38"
        stroke="var(--color-gold-3)"
        strokeWidth="1"
        transform="rotate(45, 32, 32)"
      />
      <line x1="32" y1="22" x2="32" y2="42" stroke="var(--color-gold-3)" strokeWidth="2" strokeLinecap="round" />
      <line x1="22" y1="32" x2="42" y2="32" stroke="var(--color-gold-3)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** Gold bookmark icon rendered at the top-right of each page card */
function BookmarkIcon() {
  return (
    <svg
      width="16"
      height="20"
      viewBox="0 0 16 20"
      aria-hidden="true"
      fill="none"
    >
      <path
        d="M2 2 H14 V18 L8 13 L2 18 Z"
        stroke="var(--color-gold-2)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Trash bin icon for the ghost delete button */
function TrashIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="2 4 14 4" />
      <path d="M5 4V2h6v2" />
      <path d="M3 4l1 10h8l1-10" />
      <line x1="6" y1="7" x2="6.5" y2="12" />
      <line x1="10" y1="7" x2="9.5" y2="12" />
    </svg>
  );
}

/**
 * "All runes" swirl glyph — the leading filter control that clears the path
 * filter (selects every path). Drawn to match the reference crop: a spiral
 * swirl centered inside a rotated-square (diamond) frame, in neutral grey.
 * No DDragon/CDragon asset exists for this control (both candidate paths 404),
 * so it is SVG-drawn here.
 */
function AllRunesIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      {/* Pointed diamond frame — sharp top/bottom points, side points at mid-height */}
      <path d="M16 4 L25 16 L16 28 L7 16 Z" />
      {/* Angular S-swirl coiling inward, matching the runes emblem */}
      <path
        d="M13 12.5 L18.5 12.5 L18.5 19.5 L12.5 19.5 L12.5 15 L16 15 L16 17"
      />
    </svg>
  );
}

/** Diamond bullet used in the hover overlay rune name list */
function DiamondBullet() {
  return (
    <svg width="5" height="5" viewBox="0 0 5 5" aria-hidden="true" className="shrink-0">
      <rect
        x="0.5" y="0.5" width="4" height="4"
        fill="var(--color-gold-3)"
        transform="rotate(45, 2.5, 2.5)"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// RunePageCard
// ---------------------------------------------------------------------------

interface RunePageCardProps {
  page: RunePage;
  selected: boolean;
  onSelect: () => void;
}

function RunePageCard({ page, selected, onSelect }: RunePageCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={page.name}
      aria-pressed={selected}
      className={[
        "group relative flex shrink-0 flex-col overflow-hidden",
        "border transition-colors duration-150",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3",
        selected
          ? "border-gold-3 shadow-[0_0_12px_2px_var(--color-gold-5)]"
          : "border-gold-5 hover:border-gold-4",
      ].join(" ")}
      style={{ width: 230, height: 310 }}
    >
      {/* Background art or fallback */}
      {page.artUrl ? (
        <img
          src={page.artUrl}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
      ) : (
        <div className="absolute inset-0 bg-blue-6" />
      )}

      {/* Gradient vignette — darkens bottom so labels read on any art */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, color-mix(in srgb, var(--color-hextech-black) 25%, transparent) 0%, color-mix(in srgb, var(--color-hextech-black) 50%, transparent) 55%, color-mix(in srgb, var(--color-hextech-black) 92%, transparent) 100%)",
        }}
      />

      {/* Hover overlay — rune name list, appears on pointer-over */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex flex-col justify-start bg-hextech-black/75 px-3 pt-3 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
      >
        <span className="mb-1 font-display text-[10px] uppercase tracking-widest text-gold-cream">
          {page.primaryPath.name}
        </span>
        {page.primaryRunes.map((name) => (
          <span
            key={name}
            className="flex items-center gap-1 font-display text-[9px] uppercase tracking-wider text-gold-1 leading-relaxed"
          >
            <DiamondBullet />
            {name}
          </span>
        ))}
        {page.secondaryRunes.length > 0 && (
          <>
            <span className="mb-1 mt-2 font-display text-[10px] uppercase tracking-widest text-gold-cream">
              {page.secondaryPath.name}
            </span>
            {page.secondaryRunes.map((name) => (
              <span
                key={name}
                className="flex items-center gap-1 font-display text-[9px] uppercase tracking-wider text-gold-1 leading-relaxed"
              >
                <DiamondBullet />
                {name}
              </span>
            ))}
          </>
        )}
      </div>

      {/* Bookmark pin — top-right */}
      <div className="absolute right-2 top-2 pointer-events-none">
        <BookmarkIcon />
      </div>

      {/* Bottom info block */}
      <div className="absolute bottom-0 left-0 right-0 px-3 pb-3">
        <p className="mb-0.5 font-display text-[9px] uppercase tracking-widest text-grey-2">
          {page.isPreset ? "[ Preset ]" : "[ Custom ]"}
        </p>
        <p className="font-display text-sm uppercase tracking-wider text-gold-1 leading-tight">
          {page.name}
        </p>
        {/* Rune icon pair */}
        {(page.keystoneIconUrl || page.secondaryIconUrl) && (
          <div className="mt-2 flex items-center gap-2">
            {page.keystoneIconUrl && (
              <img
                src={page.keystoneIconUrl}
                alt={`${page.primaryPath.name} keystone`}
                width={28}
                height={28}
                className="rounded-full bg-hextech-black"
              />
            )}
            {page.secondaryIconUrl && (
              <img
                src={page.secondaryIconUrl}
                alt={`${page.secondaryPath.name} rune`}
                width={28}
                height={28}
                className="rounded-full bg-hextech-black"
              />
            )}
          </div>
        )}
      </div>
    </button>
  );
}

// ---------------------------------------------------------------------------
// CREATE NEW card
// ---------------------------------------------------------------------------

function CreateNewCard({ onCreate }: { onCreate: () => void }) {
  return (
    <button
      type="button"
      onClick={onCreate}
      aria-label="Create new rune page"
      className={[
        "relative flex shrink-0 flex-col items-center justify-center gap-4",
        "border border-dashed border-gold-4 bg-hextech-black",
        "transition-colors duration-150",
        "hover:border-gold-3 hover:bg-blue-7",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3",
      ].join(" ")}
      style={{ width: 230, height: 310 }}
    >
      <DiamondPlusIcon />
      <div className="text-center">
        <p className="font-display text-sm uppercase tracking-widest text-gold-2">
          Create New
        </p>
        <p className="mt-1 font-body text-xs text-grey-2">
          Choose your Runes.
        </p>
      </div>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Path filter button
// ---------------------------------------------------------------------------

/**
 * Leading "all runes" filter button — selects every path (clears the filter).
 * Active when no specific path filter is set.
 */
function AllRunesFilterButton({
  active,
  onSelect,
}: {
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label="Filter by all runes"
      aria-pressed={active}
      className={[
        "relative flex flex-col items-center pb-1 text-grey-1",
        "transition-opacity duration-150",
        active ? "opacity-100" : "opacity-55 hover:opacity-90",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3",
      ].join(" ")}
    >
      <AllRunesIcon />
      {active && (
        <span
          aria-hidden="true"
          className="absolute -bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-gold-3"
        />
      )}
    </button>
  );
}

interface PathFilterButtonProps {
  path: RunePath;
  active: boolean;
  onToggle: () => void;
}

function PathFilterButton({ path, active, onToggle }: PathFilterButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`Filter by ${path.name}`}
      aria-pressed={active}
      className={[
        "relative flex flex-col items-center pb-1",
        "transition-opacity duration-150",
        active ? "opacity-100" : "opacity-55 hover:opacity-90",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3",
      ].join(" ")}
    >
      <img
        src={path.iconUrl}
        alt={path.name}
        width={32}
        height={32}
        className="rounded-full"
      />
      {/* Gold underline when active — matches reference */}
      {active && (
        <span
          aria-hidden="true"
          className="absolute -bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-gold-3"
        />
      )}
    </button>
  );
}

// ---------------------------------------------------------------------------
// RunesScreen
// ---------------------------------------------------------------------------

/**
 * RunesScreen — the Runes sub-tab of the Collection screen.
 *
 * Three zones per the issue spec:
 * 1. Toolbar — search input, path-filter icon buttons, hide-presets checkbox,
 *    page counter, CREATE NEW trapezoid button, trash ghost button.
 * 2. Page card grid — horizontal scrolling row; first card is always CREATE NEW,
 *    then preset/custom page cards.
 * 3. Selected state — active card highlighted with gold-3 border (detail panel
 *    is out of scope for the initial implementation).
 *
 * Presentational only — props in, callbacks out. No data fetching.
 */
export function RunesScreen({
  pages,
  maxPages,
  onSelectPage,
  onCreatePage,
  onDeletePage,
  selectedPageId,
  searchQuery = "",
  onSearchChange,
  hidePresets = false,
  onHidePresetsChange,
  paths,
  activePathFilter = null,
  onPathFilterChange,
}: RunesScreenProps) {
  const searchId = useId();
  const hidePresetsId = useId();

  // Path filter buttons: prefer the injected full set (reference shows all
  // five paths regardless of page usage); derive from pages as fallback.
  const allPaths: RunePath[] = paths ?? (() => {
    const seen = new Set<number>();
    const result: RunePath[] = [];
    for (const page of pages) {
      if (!seen.has(page.primaryPath.id)) {
        seen.add(page.primaryPath.id);
        result.push(page.primaryPath);
      }
    }
    return result;
  })();

  // Filtered page list
  const visiblePages = pages.filter((p) => {
    if (hidePresets && p.isPreset) return false;
    if (activePathFilter && String(p.primaryPath.id) !== activePathFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      if (!p.name.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  // Reference semantics: the counter tracks CUSTOM pages used vs max slots —
  // preset pages don't consume a slot ("00 / 03" with only presets).
  const paddedCount = String(pages.filter((p) => !p.isPreset).length).padStart(2, "0");
  const paddedMax = String(maxPages).padStart(2, "0");

  return (
    <div className="flex h-full flex-col bg-hextech-black">
      {/* ------------------------------------------------------------------ */}
      {/* Zone 1 — Toolbar                                                    */}
      {/* ------------------------------------------------------------------ */}
      <div className="shrink-0 flex items-center gap-4 border-b border-gold-5 bg-blue-7 px-4 py-2">
        {/* Search input */}
        <div
          className="relative flex items-center border border-grey-3 bg-hextech-black transition-colors focus-within:border-gold-4"
          style={{ width: 200 }}
        >
          <label htmlFor={searchId} className="sr-only">
            Search rune pages
          </label>
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className="pointer-events-none ml-2 h-4 w-4 shrink-0 text-grey-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <circle cx="6.5" cy="6.5" r="4" />
            <line x1="9.8" y1="9.8" x2="13.5" y2="13.5" />
          </svg>
          <input
            id={searchId}
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search"
            className="w-full bg-transparent py-1.5 pl-2 pr-3 font-body text-sm text-gold-1 placeholder:text-grey-2 outline-none [&::-webkit-search-cancel-button]:hidden"
          />
        </div>

        {/* Path filter buttons — leading "all runes" glyph, the 5 paths, then a divider */}
        <div className="flex items-center gap-3">
          <AllRunesFilterButton
            active={activePathFilter === null}
            onSelect={() => onPathFilterChange?.(null)}
          />
          {allPaths.map((path) => (
            <PathFilterButton
              key={path.id}
              path={path}
              active={activePathFilter === String(path.id)}
              onToggle={() =>
                onPathFilterChange?.(
                  activePathFilter === String(path.id) ? null : String(path.id),
                )
              }
            />
          ))}
          {/* Vertical divider before the hide-presets checkbox */}
          <span aria-hidden="true" className="ml-1 h-7 w-px bg-grey-3" />
        </div>

        {/* Hide preset pages checkbox — inline version matching the HextechCheckbox style */}
        <label
          htmlFor={hidePresetsId}
          className="flex cursor-pointer items-center gap-2 select-none"
        >
          <input
            id={hidePresetsId}
            type="checkbox"
            checked={hidePresets}
            onChange={(e) => onHidePresetsChange?.(e.target.checked)}
            className="peer sr-only"
          />
          <div
            aria-hidden="true"
            className="flex h-[14px] w-[14px] shrink-0 items-center justify-center border border-gold-4 bg-transparent peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-1 peer-focus-visible:outline-gold-3"
          >
            {hidePresets && (
              <svg
                aria-hidden="true"
                viewBox="0 0 14 14"
                className="h-[10px] w-[10px] text-gold-2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="2 7 5.5 10.5 12 3.5" />
              </svg>
            )}
          </div>
          <span className="font-body text-sm text-grey-1">Hide preset pages</span>
        </label>

        {/* Spacer pushes counter and actions to the right */}
        <div className="flex-1" />

        {/* Page counter — "00 / 03" */}
        <span className="font-display text-sm text-gold-2 tabular-nums">
          {paddedCount} / {paddedMax}
        </span>

        {/* CREATE NEW button — straight-sided rectangle, double-gold Hextech frame */}
        <button
          type="button"
          onClick={onCreatePage}
          aria-label="Create new rune page"
          className={[
            "group relative p-[3px]",
            "border border-gold-4 bg-hextech-black",
            "transition-colors duration-150",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gold-3",
          ].join(" ")}
        >
          {/* Inner frame + label */}
          <span
            className={[
              "flex items-center justify-center px-5 py-1.5",
              "border border-gold-4 font-display text-xs uppercase tracking-widest text-gold-cream",
              "transition-colors duration-150 group-hover:bg-gold-5 group-hover:text-gold-1",
            ].join(" ")}
          >
            Create New
          </span>
          {/* L-shaped corner-tick accents */}
          {(
            [
              "left-0 top-0 border-l border-t",
              "right-0 top-0 border-r border-t",
              "left-0 bottom-0 border-l border-b",
              "right-0 bottom-0 border-r border-b",
            ] as const
          ).map((pos) => (
            <span
              key={pos}
              aria-hidden="true"
              className={`pointer-events-none absolute h-2 w-2 border-gold-2 ${pos}`}
            />
          ))}
        </button>

        {/* Trash control — off-state toggle-switch pill: circular trash knob on
            the left, grey pill track extending right. */}
        <button
          type="button"
          onClick={() => selectedPageId && onDeletePage(selectedPageId)}
          aria-label={
            selectedPageId
              ? "Delete selected rune page"
              : "Delete rune page (no page selected)"
          }
          disabled={!selectedPageId}
          className={[
            "relative flex h-8 w-[58px] shrink-0 items-center rounded-full border",
            "transition-colors duration-150",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gold-3",
            selectedPageId
              ? "border-grey-2 cursor-pointer group hover:border-gold-4"
              : "border-grey-3 cursor-not-allowed opacity-40",
          ].join(" ")}
        >
          {/* Circular knob on the left with the trash icon */}
          <span
            aria-hidden="true"
            className={[
              "flex h-8 w-8 items-center justify-center rounded-full border",
              "transition-colors duration-150",
              selectedPageId
                ? "border-grey-1 bg-hextech-black text-grey-1 group-hover:border-gold-4 group-hover:text-gold-2"
                : "border-grey-3 bg-hextech-black text-grey-3",
            ].join(" ")}
          >
            <TrashIcon />
          </span>
        </button>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Zone 2 — Page card grid (horizontal scroll)                         */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden min-h-0">
        <div className="flex h-full items-start gap-4 px-6 pt-6 pb-4" style={{ minWidth: "max-content" }}>
          {/* CREATE NEW card — always first */}
          <CreateNewCard onCreate={onCreatePage} />

          {/* Rune page cards */}
          {visiblePages.map((page) => (
            <RunePageCard
              key={page.id}
              page={page}
              selected={selectedPageId === page.id}
              onSelect={() => onSelectPage(page.id)}
            />
          ))}

          {/* Empty state shown only when pages exist but all are filtered out */}
          {visiblePages.length === 0 && pages.length > 0 && (
            <div className="flex items-center px-8 py-4">
              <p className="font-body text-sm text-grey-2">
                No rune pages match this filter.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
