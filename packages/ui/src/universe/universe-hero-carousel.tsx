import { useId } from "react";

/**
 * UniverseHeroCarousel — the home page hero carousel on universe.leagueoflegends.com.
 *
 * Structure (Ref: docs/reference/universe-landing.png):
 *   ┌────────────────────────────────────────────────────────────┐
 *   │  Full-width champion splash (object-cover, ~460px tall)    │
 *   │  [dark vignette — left + right edges fade to near-black]   │
 *   │  [prev slide title, faded, far left]  [< arrow] ... [> arrow] [next title, faded, right] │
 *   │                                                            │
 *   │            [crest ornament SVG]                            │
 *   │            OVERLINE (gold caps, small)                     │
 *   │            BIG TITLE (font-display serif caps)             │
 *   │            [thin gold underline bar]                       │
 *   └────────────────────────────────────────────────────────────┘
 *
 * Controlled: parent passes `index`, `onPrev`, `onNext`. Stateful demo in *.demo.tsx.
 * Server-safe (no 'use client') — no internal state. SVG ids via useId.
 * Tokens-only. Issue #971.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UniverseHeroSlide {
  /** Overline text, e.g. "THE ASHEN EXORCIST". Shown in gold caps above title. */
  overline: string;
  /** Big title text, e.g. "LOCKE". Shown in font-display serif caps. */
  title: string;
  /** Full splash art URL. Use championSplashUrl() from @low/fixtures. */
  splashUrl: string;
  /** Link href for the slide CTA. @default "#" */
  href?: string;
}

export interface UniverseHeroCarouselProps {
  /** Array of hero slides. */
  slides: UniverseHeroSlide[];
  /** Currently active slide index (0-based). Controlled by parent. */
  index: number;
  /** Fired when the prev arrow is clicked. */
  onPrev?: () => void;
  /** Fired when the next arrow is clicked. */
  onNext?: () => void;
  /** Fired when the current slide's title/crest area is clicked. */
  onSelect?: (index: number) => void;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Crest ornament — decorative diamond/wing SVG above the overline. */
function CrestOrnament({ gradientId }: { gradientId: string }) {
  return (
    <svg
      aria-hidden="true"
      width="48"
      height="32"
      viewBox="0 0 48 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="48" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--color-gold-4)" />
          <stop offset="50%" stopColor="var(--color-gold-2)" />
          <stop offset="100%" stopColor="var(--color-gold-4)" />
        </linearGradient>
      </defs>
      {/* Central diamond */}
      <polygon
        points="24,4 30,16 24,28 18,16"
        fill={`url(#${gradientId})`}
        opacity="0.9"
      />
      {/* Left wing lines */}
      <line x1="0" y1="16" x2="16" y2="16" stroke="var(--color-gold-3)" strokeWidth="0.75" opacity="0.6" />
      <line x1="4" y1="12" x2="16" y2="16" stroke="var(--color-gold-3)" strokeWidth="0.5" opacity="0.4" />
      <line x1="4" y1="20" x2="16" y2="16" stroke="var(--color-gold-3)" strokeWidth="0.5" opacity="0.4" />
      {/* Right wing lines */}
      <line x1="32" y1="16" x2="48" y2="16" stroke="var(--color-gold-3)" strokeWidth="0.75" opacity="0.6" />
      <line x1="32" y1="16" x2="44" y2="12" stroke="var(--color-gold-3)" strokeWidth="0.5" opacity="0.4" />
      <line x1="32" y1="16" x2="44" y2="20" stroke="var(--color-gold-3)" strokeWidth="0.5" opacity="0.4" />
    </svg>
  );
}

/** Circular gold-ringed arrow button (prev/next). */
function ArrowButton({
  direction,
  onClick,
  label,
  ringId,
}: {
  direction: "prev" | "next";
  onClick?: () => void;
  label: string;
  ringId: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="group relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold-4 hover:border-gold-2 transition-[border-color,opacity] duration-150 hover:opacity-90"
      style={{
        background: "color-mix(in srgb, var(--color-hextech-black) 50%, transparent)",
        cursor: "pointer",
        outline: "none",
      }}
    >
      <svg
        aria-hidden="true"
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={ringId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--color-gold-2)" />
            <stop offset="100%" stopColor="var(--color-gold-4)" />
          </linearGradient>
        </defs>
        {direction === "prev" ? (
          <path
            d="M9 2 L4 7 L9 12"
            stroke={`url(#${ringId})`}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M5 2 L10 7 L5 12"
            stroke={`url(#${ringId})`}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

/**
 * UniverseHeroCarousel — home page hero splash carousel.
 *
 * Controlled: caller owns `index`, `onPrev`, `onNext`. Server-safe (no state).
 * Tokens-only — all colors via var(--color-*) or color-mix.
 */
export function UniverseHeroCarousel({
  slides,
  index,
  onPrev,
  onNext,
  onSelect,
}: UniverseHeroCarouselProps) {
  const crestGradId = useId();
  const prevRingId = useId();
  const nextRingId = useId();

  if (!slides.length) return null;

  // Safe indexing — slides is non-empty after the guard above.
  const safeIndex = ((index % slides.length) + slides.length) % slides.length;
  const current = slides[safeIndex] as UniverseHeroSlide;
  const prevIdx = ((safeIndex - 1) + slides.length) % slides.length;
  const nextIdx = (safeIndex + 1) % slides.length;
  const prevSlide = slides[prevIdx] as UniverseHeroSlide;
  const nextSlide = slides[nextIdx] as UniverseHeroSlide;
  const showPeek = slides.length > 1;

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        height: "460px",
        backgroundColor: "var(--color-universe-bg)",
      }}
    >
      {/* ── Splash art — full-bleed, object-cover ── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={current.splashUrl}
        src={current.splashUrl}
        alt={current.title}
        className="absolute inset-0 h-full w-full object-cover object-top"
        style={{ transition: "opacity 400ms ease" }}
      />

      {/* ── Dark vignette — left edge ── */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-1/3"
        style={{
          background:
            "linear-gradient(to right, color-mix(in srgb, var(--color-hextech-black) 85%, transparent) 0%, transparent 100%)",
        }}
        aria-hidden="true"
      />
      {/* ── Dark vignette — right edge ── */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-1/3"
        style={{
          background:
            "linear-gradient(to left, color-mix(in srgb, var(--color-hextech-black) 85%, transparent) 0%, transparent 100%)",
        }}
        aria-hidden="true"
      />
      {/* ── Dark vignette — bottom edge ── */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5"
        style={{
          background:
            "linear-gradient(to top, color-mix(in srgb, var(--color-hextech-black) 90%, transparent) 0%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* ── Prev/Next peek titles — far left / far right ── */}
      {showPeek && (
        <>
          {/* Prev slide title peek — far left (title only, no overline per ref) */}
          <div
            className="absolute left-4 top-1/2 flex -translate-y-1/2 flex-col items-start"
            style={{ opacity: 0.35 }}
            aria-hidden="true"
          >
            <p
              className="font-display text-xs uppercase"
              style={{
                color: "var(--color-universe-story-ink)",
                letterSpacing: "0.06em",
              }}
            >
              {prevSlide.title}
            </p>
          </div>

          {/* Next slide title peek — far right (title only, no overline per ref) */}
          <div
            className="absolute right-4 top-1/2 flex -translate-y-1/2 flex-col items-end"
            style={{ opacity: 0.35 }}
            aria-hidden="true"
          >
            <p
              className="font-display text-xs uppercase"
              style={{
                color: "var(--color-universe-story-ink)",
                letterSpacing: "0.06em",
              }}
            >
              {nextSlide.title}
            </p>
          </div>
        </>
      )}

      {/* ── Arrow buttons — centered vertically, near left and right edges ── */}
      {showPeek && (
        <>
          <div className="absolute left-[130px] top-1/2 -translate-y-1/2">
            <ArrowButton
              direction="prev"
              onClick={onPrev}
              label="Previous slide"
              ringId={prevRingId}
            />
          </div>
          <div className="absolute right-[130px] top-1/2 -translate-y-1/2">
            <ArrowButton
              direction="next"
              onClick={onNext}
              label="Next slide"
              ringId={nextRingId}
            />
          </div>
        </>
      )}

      {/* ── Centered text block — crest + overline + title + underline ── */}
      <a
        href={current.href ?? "#"}
        onClick={
          onSelect
            ? (e) => {
                e.preventDefault();
                onSelect(index);
              }
            : undefined
        }
        className="absolute inset-x-0 bottom-10 flex flex-col items-center gap-1.5"
        style={{ textDecoration: "none" }}
        aria-label={`${current.title} — ${current.overline}`}
      >
        {/* Crest ornament */}
        <CrestOrnament gradientId={crestGradId} />

        {/* Overline — gold caps, small, letter-spaced */}
        <p
          className="text-[11px] uppercase"
          style={{
            color: "var(--color-gold-2)",
            fontFamily: "var(--font-body)",
            letterSpacing: "0.16em",
            textShadow:
              "0 1px 6px color-mix(in srgb, var(--color-hextech-black) 70%, transparent)",
          }}
        >
          {current.overline}
        </p>

        {/* Big title — font-display serif caps */}
        <p
          className="font-display text-4xl uppercase leading-none"
          style={{
            color: "var(--color-universe-story-ink)",
            letterSpacing: "0.08em",
            textShadow:
              "0 2px 12px color-mix(in srgb, var(--color-hextech-black) 60%, transparent)",
          }}
        >
          {current.title}
        </p>

        {/* Thin gold underline bar */}
        <div
          className="mt-1 h-px w-24"
          style={{ backgroundColor: "var(--color-gold-3)" }}
          aria-hidden="true"
        />
      </a>
    </div>
  );
}
