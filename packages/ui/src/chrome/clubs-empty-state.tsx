"use client";

import { SearchInput } from "./search-input";

// ---------------------------------------------------------------------------
// HextechDiamond glyph — Hextech `<>` diamond SVG repeated across feature columns.
// Inline, aria-hidden, currentColor so callers control tint via className/style.
// ---------------------------------------------------------------------------

function HextechDiamond() {
  return (
    <svg
      aria-hidden="true"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer diamond */}
      <rect
        x="16"
        y="2"
        width="19.8"
        height="19.8"
        rx="1"
        transform="rotate(45 16 16)"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="none"
      />
      {/* Inner diamond */}
      <rect
        x="16"
        y="7"
        width="12.7"
        height="12.7"
        rx="0.6"
        transform="rotate(45 16 16)"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
      {/* Corner accent dots at N/E/S/W */}
      <circle cx="16" cy="2.6" r="1.2" fill="currentColor" />
      <circle cx="29.4" cy="16" r="1.2" fill="currentColor" />
      <circle cx="16" cy="29.4" r="1.2" fill="currentColor" />
      <circle cx="2.6" cy="16" r="1.2" fill="currentColor" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// External-link arrow glyph — inline arrow-up-right, used by "Learn More" link.
// ---------------------------------------------------------------------------

function ExternalLinkIcon() {
  return (
    <svg
      aria-hidden="true"
      width="11"
      height="11"
      viewBox="0 0 11 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block translate-y-[-1px]"
    >
      <path
        d="M2 9L9 2M9 2H4M9 2V7"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Feature column data — static, not a prop (page-level fixture rule applies
// only to fixture *values* from @low/fixtures; static UI copy is fine here).
// ---------------------------------------------------------------------------

interface FeatureColumn {
  title: string;
  body: string;
}

const FEATURE_COLUMNS: FeatureColumn[] = [
  {
    title: "CREATE A CLUB",
    body: "Own your own club! Become official and unlock your club tag by recruiting at least 5 total members.",
  },
  {
    title: "REPRESENT YOUR CLUB",
    body: "Represent your club with an in-game tag. You can only rep one club at a time.",
  },
  {
    title: "JOIN A CLUB",
    body: "Become a member of up to three clubs. Promote members to officers to help run your club. Clubs are limited to 100 members.",
  },
];

// ---------------------------------------------------------------------------
// Public props
// ---------------------------------------------------------------------------

/**
 * ClubsEmptyState — presentational empty-state page for the Profile → Clubs tab.
 *
 * Rendered when the viewer hasn't joined any clubs.
 * Layout (top→bottom):
 *   - Summoner Search input anchored top-right
 *   - Header zone: large headline + two body paragraphs + "Learn More" link
 *   - Three-column feature strip with Hextech diamond glyphs
 *   - Thin horizontal rule
 *   - Centred "CREATE CLUB" CTA button
 *
 * All interactions are delegated upward via callbacks; no internal state.
 */
export interface ClubsEmptyStateProps {
  /** Fired when the user clicks the "CREATE CLUB" button. */
  onCreateClub: () => void;
  /** Fired when the user clicks the "Learn More About Clubs" link. */
  onLearnMore: () => void;
  /** Fired on every keystroke in the Summoner Search input. */
  onSummonerSearch: (query: string) => void;
}

// ---------------------------------------------------------------------------
// ClubsEmptyState
// ---------------------------------------------------------------------------

export function ClubsEmptyState({
  onCreateClub,
  onLearnMore,
  onSummonerSearch,
}: ClubsEmptyStateProps) {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-blue-7">
      {/* Teal Hextech corner filigree watermark — decorative, aria-hidden */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Bottom-right teal glow filigree (pixel-matched to reference) */}
        <div
          className="absolute bottom-0 right-0 h-[420px] w-[420px] opacity-30"
          style={{
            background:
              "radial-gradient(ellipse at 100% 100%, var(--color-blue-3) 0%, var(--color-blue-5) 35%, transparent 70%)",
          }}
        />
        {/* Subtle inner corner lines */}
        <svg
          className="absolute bottom-4 right-4 text-blue-3 opacity-20"
          width="220"
          height="220"
          viewBox="0 0 220 220"
          fill="none"
        >
          <path
            d="M220 0 L220 220 L0 220"
            stroke="currentColor"
            strokeWidth="1"
          />
          <path
            d="M220 30 L220 220 L30 220"
            stroke="currentColor"
            strokeWidth="0.6"
          />
          <path
            d="M220 60 L220 220 L60 220"
            stroke="currentColor"
            strokeWidth="0.4"
          />
        </svg>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Summoner Search — top-right                                         */}
      {/* ------------------------------------------------------------------ */}
      <div className="relative z-10 flex shrink-0 justify-end px-6 pt-4">
        <SearchInput
          value=""
          onChange={onSummonerSearch}
          placeholder="Summoner Search"
          aria-label="Summoner Search"
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Scrollable main content                                             */}
      {/* ------------------------------------------------------------------ */}
      <div className="relative z-10 flex flex-1 flex-col overflow-y-auto px-12 pb-10 pt-8">
        {/* Header zone */}
        <div className="mb-10 max-w-[680px]">
          <h1 className="mb-4 font-display text-[32px] uppercase leading-tight tracking-widest text-gold-1">
            JOIN CLUBS WITH YOUR FRIENDS
          </h1>
          <p className="mb-3 text-[13px] leading-relaxed text-grey-1">
            Clubs give you a unique group name, unique tag, and a persistent
            chat where you can organize a premade or just talk smack with your
            buds.
          </p>
          <p className="mb-3 text-[13px] leading-relaxed text-grey-1">
            Join a club with your friends today, or grab a friend and make your
            own!
          </p>
          <button
            type="button"
            onClick={onLearnMore}
            className="inline-flex cursor-pointer items-center gap-1 text-[12px] text-gold-3 transition-colors duration-150 hover:text-gold-1 hover:underline"
          >
            Learn More About Clubs
            <ExternalLinkIcon />
          </button>
        </div>

        {/* Three-column feature strip */}
        <div className="mb-6 grid grid-cols-3 gap-8">
          {FEATURE_COLUMNS.map((col) => (
            <div key={col.title} className="flex flex-col items-center text-center">
              {/* Column title */}
              <h2 className="mb-3 font-display text-[14px] uppercase tracking-widest text-gold-1">
                {col.title}
              </h2>
              {/* Hextech diamond glyph */}
              <div className="mb-3 text-gold-3">
                <HextechDiamond />
              </div>
              {/* Column body copy */}
              <p className="text-[12px] leading-relaxed text-grey-2">
                {col.body}
              </p>
            </div>
          ))}
        </div>

        {/* Horizontal rule divider */}
        <hr className="mb-8 border-gold-5 opacity-30" />

        {/* CTA zone — centred CREATE CLUB button */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={onCreateClub}
            className={[
              "h-9 w-[140px] cursor-pointer border border-gold-3 bg-transparent",
              "font-display text-[12px] uppercase tracking-widest text-gold-1",
              "transition-colors duration-150 hover:bg-gold-3/10",
            ].join(" ")}
          >
            CREATE CLUB
          </button>
        </div>
      </div>
    </div>
  );
}
