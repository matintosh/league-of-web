"use client";

// ChallengesScreen — Profile → CHALLENGES sub-tab (era: 2022+, Patch 12.9+).
// Reference: docs/reference/client-profile-challenges-tab.jpg (2560×1440).
// Presentational — props in, callbacks out, no data fetching.

import type { ChallengeCategory, ChallengeItem, ChallengeTier } from "@low/fixtures";

export type { ChallengeCategory, ChallengeItem, ChallengeTier };

export interface ChallengesScreenProps {
  /** Player's total challenge score, e.g. 4725. */
  totalScore: number;
  /** Player's overall tier, e.g. "silver". */
  scoreTier: ChallengeTier;
  /** Currently active category filter. Controlled by the page. */
  activeCategory: ChallengeCategory;
  /** Called when the player clicks a category filter. */
  onCategoryChange?: (cat: ChallengeCategory) => void;
  /** Challenges to display. The page pre-filters by activeCategory. */
  challenges: ChallengeItem[];
  /** Called when a challenge card is clicked. */
  onChallengeClick?: (id: string) => void;
}

const CATEGORIES: { id: ChallengeCategory; label: string }[] = [
  { id: "all",               label: "ALL" },
  { id: "imagination",       label: "IMAGINATION" },
  { id: "expertise",         label: "EXPERTISE" },
  { id: "teamwork-strategy", label: "TEAMWORK & STRATEGY" },
  { id: "veterancy",         label: "VETERANCY" },
  { id: "collection",        label: "COLLECTION" },
  { id: "legacy",            label: "LEGACY" },
];

function formatScore(n: number): string {
  return n.toLocaleString("en-US");
}

function tierTextClass(tier: ChallengeTier): string {
  switch (tier) {
    case "iron":        return "text-grey-1";
    case "bronze":      return "text-gold-2";
    case "silver":      return "text-grey-1";
    case "gold":        return "text-gold-cream";
    case "platinum":    return "text-blue-2";
    case "diamond":     return "text-blue-1";
    case "master":
    case "grandmaster": return "text-gold-1";
    case "challenger":  return "text-gold-coin";
    default:            return "text-grey-1";
  }
}

function tierBorderClass(tier: ChallengeTier): string {
  switch (tier) {
    case "iron":        return "border-grey-2";
    case "bronze":      return "border-gold-4";
    case "silver":      return "border-grey-1";
    case "gold":        return "border-gold-3";
    case "platinum":    return "border-blue-3";
    case "diamond":     return "border-blue-2";
    case "master":
    case "grandmaster":
    case "challenger":  return "border-gold-2";
    default:            return "border-grey-2";
  }
}

function CrystalIcon({ tier }: { tier: ChallengeTier }) {
  return (
    <svg aria-hidden="true" width="64" height="72" viewBox="0 0 64 72" fill="none" className={tierTextClass(tier)}>
      <polygon points="32,2 62,17 62,55 32,70 2,55 2,17" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.15" />
      <polygon points="32,12 52,22 52,50 32,60 12,50 12,22" stroke="currentColor" strokeWidth="1" fill="currentColor" fillOpacity="0.2" />
      <line x1="32" y1="2"  x2="32" y2="12" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <line x1="32" y1="60" x2="32" y2="70" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <line x1="2"  y1="17" x2="12" y2="22" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <line x1="62" y1="17" x2="52" y2="22" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <line x1="2"  y1="55" x2="12" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <line x1="62" y1="55" x2="52" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.6" />
    </svg>
  );
}

function TokenIcon({ src, name }: { src: string; name: string }) {
  return (
    <div className="relative mx-auto flex h-[72px] w-[72px] items-center justify-center">
      <div className="h-[68px] w-[68px] overflow-hidden bg-blue-5" style={{ clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)" }}>
        <img src={src} alt={name} width={68} height={68} className="h-full w-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
      </div>
      <svg aria-hidden="true" width="72" height="72" viewBox="0 0 72 72" fill="none" className="pointer-events-none absolute inset-0 text-gold-4">
        <polygon points="36,2 70,19 70,53 36,70 2,53 2,19" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
    </div>
  );
}

function TierBadge({ tier }: { tier: ChallengeTier }) {
  return (
    <span className={["inline-flex items-center border px-1.5 py-0.5", "font-display text-[9px] uppercase tracking-widest leading-none", tierTextClass(tier), tierBorderClass(tier)].join(" ")}>
      {tier.toUpperCase()}
    </span>
  );
}

function ChallengeTooltip({ challenge }: { challenge: ChallengeItem }) {
  const { name, tier, progress, playerPercentage, nextRewardLabel, nextRewardIconSrc } = challenge;
  const progressPct = progress && progress.total > 0 ? Math.min(1, progress.current / progress.total) : 0;
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-full top-1/2 z-20 ml-2 -translate-y-1/2 w-[200px] bg-blue-7 border border-gold-5 px-3 py-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
    >
      <span className="font-display text-xs uppercase tracking-wider text-gold-cream leading-snug">{name}</span>
      <TierBadge tier={tier} />
      {playerPercentage !== undefined && (
        <p className="font-body text-[10px] text-grey-1 leading-tight">{playerPercentage.toFixed(1)}% of players have this</p>
      )}
      {progress && (
        <div className="flex flex-col gap-1">
          <div className="h-1.5 w-full rounded-sm bg-blue-5 overflow-hidden">
            <div className="h-full rounded-sm bg-blue-2 transition-[width] duration-300" style={{ width: `${progressPct * 100}%` }} />
          </div>
          <span className="font-body text-[10px] text-grey-1">{progress.current} / {progress.total}</span>
        </div>
      )}
      <div className="border-t border-gold-5 pt-2">
        <p className="font-display text-[9px] uppercase tracking-widest text-gold-4 mb-1">Next Level Rewards</p>
        <div className="flex items-center gap-1.5">
          {nextRewardIconSrc ? (
            <img src={nextRewardIconSrc} alt="" width={16} height={16} className="shrink-0" />
          ) : (
            <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0 text-gold-3">
              <rect x="2" y="2" width="8" height="8" fill="currentColor" transform="rotate(45,6,6)" />
            </svg>
          )}
          <span className="font-body text-[10px] text-gold-cream leading-tight">{nextRewardLabel}</span>
        </div>
      </div>
    </div>
  );
}

function ChallengeCard({ challenge, onClick }: { challenge: ChallengeItem; onClick?: () => void }) {
  const { name, criteria, scoreContribution, tier, tokenIconSrc, nextRewardLabel, nextRewardIconSrc } = challenge;
  const content = (
    <>
      <div className="mb-2 flex items-center gap-1">
        <span className="inline-flex items-center bg-blue-5 px-1.5 py-0.5 font-display text-[10px] text-gold-cream">{scoreContribution}</span>
      </div>
      <TokenIcon src={tokenIconSrc} name={name} />
      <div className="mt-2 flex justify-center"><TierBadge tier={tier} /></div>
      <p className="mt-1.5 text-center font-display text-[11px] uppercase tracking-wider text-gold-cream leading-snug">{name}</p>
      <p className="mt-1 text-center font-body text-[9px] text-grey-1 leading-snug line-clamp-2">{criteria}</p>
      <div className="mt-2 flex items-center justify-center gap-1 border-t border-gold-5/40 pt-1.5">
        {nextRewardIconSrc ? (
          <img src={nextRewardIconSrc} alt="" width={12} height={12} className="shrink-0" />
        ) : (
          <svg aria-hidden="true" width="10" height="10" viewBox="0 0 10 10" fill="none" className="shrink-0 text-gold-3">
            <rect x="2" y="2" width="6" height="6" fill="currentColor" transform="rotate(45,5,5)" />
          </svg>
        )}
        <span className="font-body text-[9px] text-grey-1 leading-none truncate">{nextRewardLabel}</span>
      </div>
      <ChallengeTooltip challenge={challenge} />
    </>
  );
  const sharedClass = ["group relative flex flex-col p-3", "bg-blue-7 border border-gold-5/40 hover:border-gold-4", "transition-colors duration-150", "overflow-visible", "hover:z-10", onClick ? "cursor-pointer" : "cursor-default"].join(" ");
  if (onClick) {
    return <button type="button" onClick={onClick} aria-label={name} className={sharedClass}>{content}</button>;
  }
  return <div className={sharedClass}>{content}</div>;
}

/**
 * ChallengesScreen — Profile → CHALLENGES tab content (era: 2022+).
 *
 * Left sidebar: hexagonal crystal icon, total score, tier label, 6 category
 * filter buttons. Right: 5-column ChallengeCard grid with hover tooltips.
 *
 * State ownership: activeCategory is controlled by the page so it survives
 * main-nav switches. The page pre-filters challenges before passing them in.
 */
export function ChallengesScreen({ totalScore, scoreTier, activeCategory, onCategoryChange, challenges, onChallengeClick }: ChallengesScreenProps) {
  return (
    <div className="flex h-full min-h-0 w-full">
      {/* Sidebar */}
      <aside className="flex w-[205px] shrink-0 flex-col border-r border-gold-5 bg-blue-8 px-4 py-5" aria-label="Challenge score and categories">
        <div className="flex justify-center"><CrystalIcon tier={scoreTier} /></div>
        <div className="mt-3 text-center">
          <p className="font-display text-3xl leading-none text-gold-cream tracking-wide">{formatScore(totalScore)}</p>
          <p className="mt-0.5 font-display text-xs uppercase tracking-widest text-grey-1">{scoreTier.toUpperCase()}</p>
        </div>
        <div className="my-4 h-px bg-gold-5/40" />
        <nav aria-label="Challenge categories">
          <ul className="flex flex-col gap-1" role="list">
            {CATEGORIES.map(({ id, label }) => {
              const isActive = id === activeCategory;
              return (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => onCategoryChange?.(id)}
                    aria-pressed={isActive}
                    className={["flex w-full items-center gap-2 px-2 py-1.5", "font-display text-[10px] uppercase tracking-widest leading-none", "transition-colors duration-150 text-left", isActive ? "text-blue-2 border-b border-blue-2" : "text-grey-1 hover:text-gold-cream cursor-pointer"].join(" ")}
                  >
                    <span className={["inline-block h-1.5 w-1.5 rounded-full shrink-0", isActive ? "bg-blue-2" : "bg-grey-2"].join(" ")} />
                    {label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Card grid */}
      <main className="flex flex-1 min-w-0 flex-col overflow-y-auto bg-blue-8 p-4" aria-label="Challenges grid">
        {challenges.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="font-display text-sm uppercase tracking-widest text-grey-2">No challenges in this category</p>
          </div>
        ) : (
          <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(5, minmax(0, 1fr))" }}>
            {challenges.map((ch) => (
              <ChallengeCard key={ch.id} challenge={ch} onClick={onChallengeClick ? () => onChallengeClick(ch.id) : undefined} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
