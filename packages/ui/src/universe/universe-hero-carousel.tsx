import { useId } from "react";
import { universeContentIcon } from "@low/fixtures";

/**
 * UniverseHeroCarousel — home hero coverflow on universe.leagueoflegends.com.
 *
 * Structure (values extracted from the live site via getComputedStyle):
 *   - 3-up coverflow: prev + next splashes flank the center, DESATURATED via
 *     filter grayscale(1) brightness(0.3); the center splash is full-colour with
 *     a slow Ken Burns zoom.
 *   - Circular gold-ring arrows sit on the center splash's left/right edges.
 *   - An angular gold-outlined NAMEPLATE panel (~480x184, #0f0f0f) overlaps the
 *     bottom center: notched top + crest medallion + overline (cream #c4b998,
 *     4px tracking) + title (gold #937341, 30px Beaufort, 3px tracking) + underline.
 *   - Faded prev/next titles peek at the far edges.
 *
 * Controlled: parent passes `index`, `onPrev`, `onNext` (auto-advance lives in
 * the client wrapper). Server-safe (no state). Tokens-only. Issue #971.
 */

export interface UniverseHeroSlide {
  /** Overline text, e.g. "THE ASHEN EXORCIST". */
  overline: string;
  /** Big title text, e.g. "LOCKE". */
  title: string;
  /** Full splash art URL. Use championSplashUrl() from @low/fixtures. */
  splashUrl: string;
  /** Link href for the slide CTA. @default "#" */
  href?: string;
}

export interface UniverseHeroCarouselProps {
  slides: UniverseHeroSlide[];
  /** Currently active slide index (0-based). Controlled by parent. */
  index: number;
  onPrev?: () => void;
  onNext?: () => void;
  onSelect?: (index: number) => void;
}

/** Content-type crest medallion — real emblem image from the live site. */
function CrestMedallion() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={universeContentIcon("champion")}
      alt=""
      aria-hidden="true"
      width={38}
      height={38}
      className="block"
      style={{ backgroundColor: "var(--color-hextech-black)", borderRadius: "50%", width: "38px", height: "38px", objectFit: "contain" }}
    />
  );
}

/** Circular gold-ringed arrow button (prev/next). */
function ArrowButton({ direction, onClick, label, ringId }: { direction: "prev" | "next"; onClick?: () => void; label: string; ringId: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold-4 transition-[border-color,background-color] duration-150 hover:border-gold-2"
      style={{ background: "color-mix(in srgb, var(--color-hextech-black) 45%, transparent)", cursor: "pointer" }}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <defs>
          <linearGradient id={ringId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--color-gold-2)" />
            <stop offset="100%" stopColor="var(--color-gold-4)" />
          </linearGradient>
        </defs>
        <path d={direction === "prev" ? "M9 2 L4 7 L9 12" : "M5 2 L10 7 L5 12"} stroke={`url(#${ringId})`} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

export function UniverseHeroCarousel({ slides, index, onPrev, onNext, onSelect }: UniverseHeroCarouselProps) {
  const prevRingId = useId();
  const nextRingId = useId();
  const plateId = useId();

  if (!slides.length) return null;
  const n = slides.length;
  const safeIndex = ((index % n) + n) % n;
  const current = slides[safeIndex] as UniverseHeroSlide;
  const prevSlide = slides[(safeIndex - 1 + n) % n] as UniverseHeroSlide;
  const nextSlide = slides[(safeIndex + 1) % n] as UniverseHeroSlide;
  const multi = n > 1;

  // Real geometry (extract_styles on live site): center splash 900x468 (62.5% at
  // 1440), neighbours ~270px (19%) each, nameplate 480x188 (#0f0f0f) tucked flush
  // under the splash (notch overlaps the splash bottom — connected, not floating).
  const SPLASH_H = 468;
  const PLATE_TOP = 416; // nameplate top: notch overlaps the splash bottom

  return (
    <div className="relative w-full overflow-hidden" style={{ height: "600px", backgroundColor: "var(--color-universe-bg)" }}>
      <style>{`
        @keyframes uhcKenBurns { from { transform: scale(1.03) } to { transform: scale(1.1) } }
        @keyframes uhcRise { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: translateY(0) } }
        .uhc-center { animation: uhcKenBurns 9000ms ease-out forwards; transform-origin: 50% 40%; }
        .uhc-plate { animation: uhcRise 500ms ease-out both; }
        @media (prefers-reduced-motion: reduce) { .uhc-center { animation: none } .uhc-plate { animation: none } }
      `}</style>

      {/* ── Desaturated neighbour splashes (3-up coverflow), ~19% each, splash-height ── */}
      {multi && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img key={`p${safeIndex}`} src={prevSlide.splashUrl} alt="" aria-hidden="true"
            className="absolute left-0 top-0 object-cover"
            style={{ width: "19%", height: `${SPLASH_H}px`, filter: "grayscale(1) brightness(0.28)", objectPosition: "center top" }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img key={`n${safeIndex}`} src={nextSlide.splashUrl} alt="" aria-hidden="true"
            className="absolute right-0 top-0 object-cover"
            style={{ width: "19%", height: `${SPLASH_H}px`, filter: "grayscale(1) brightness(0.28)", objectPosition: "center top" }} />
        </>
      )}

      {/* ── Center splash — 62.5% wide × 468 tall, full colour, Ken Burns ── */}
      <div className="absolute top-0 overflow-hidden" style={{ left: "50%", transform: "translateX(-50%)", width: multi ? "62.5%" : "100%", height: `${SPLASH_H}px` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img key={`c${safeIndex}`} src={current.splashUrl} alt={current.title} className="uhc-center h-full w-full object-cover" style={{ objectPosition: "center top" }} />
      </div>

      {/* fade the dark area below the splash */}
      <div className="pointer-events-none absolute inset-x-0 top-0" style={{ height: `${SPLASH_H}px`, background: `linear-gradient(to top, var(--color-universe-bg) 0%, transparent 22%)` }} aria-hidden="true" />

      {/* ── Faded neighbour titles — below each neighbour, in the dark ── */}
      {multi && (
        <>
          <p className="absolute left-0 w-[19%] text-center font-display uppercase" style={{ top: `${SPLASH_H + 24}px`, color: "var(--color-universe-title)", opacity: 0.3, fontSize: "14px", letterSpacing: "3px" }} aria-hidden="true">{prevSlide.title}</p>
          <p className="absolute right-0 w-[19%] text-center font-display uppercase" style={{ top: `${SPLASH_H + 24}px`, color: "var(--color-universe-title)", opacity: 0.3, fontSize: "14px", letterSpacing: "3px" }} aria-hidden="true">{nextSlide.title}</p>
        </>
      )}

      {/* ── Arrows on the center splash left/right edges ── */}
      {multi && (
        <>
          <div className="absolute" style={{ top: "196px", left: "20.5%" }}>
            <ArrowButton direction="prev" onClick={onPrev} label="Previous slide" ringId={prevRingId} />
          </div>
          <div className="absolute" style={{ top: "196px", right: "20.5%" }}>
            <ArrowButton direction="next" onClick={onNext} label="Next slide" ringId={nextRingId} />
          </div>
        </>
      )}

      {/* ── Nameplate — 480×188 #0f0f0f, notched top tucked under the splash ── */}
      <a
        href={current.href ?? "#"}
        onClick={onSelect ? (e) => { e.preventDefault(); onSelect(index); } : undefined}
        className="uhc-plate absolute left-1/2 block -translate-x-1/2"
        style={{ top: `${PLATE_TOP}px`, width: "480px", height: "188px", textDecoration: "none" }}
        aria-label={`${current.title} — ${current.overline}`}
      >
        {/* SVG frame: shallow notched top + near-black fill + subtle gold hairline */}
        <svg viewBox="0 0 480 188" width="480" height="188" className="absolute inset-0" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id={plateId} x1="0" y1="0" x2="480" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="color-mix(in srgb, var(--color-gold-4) 70%, transparent)" />
              <stop offset="50%" stopColor="var(--color-gold-3)" />
              <stop offset="100%" stopColor="color-mix(in srgb, var(--color-gold-4) 70%, transparent)" />
            </linearGradient>
          </defs>
          <path d="M1,26 L200,26 L220,8 L260,8 L280,26 L479,26 L479,186 L1,186 Z"
            fill="var(--color-universe-card-bg)"
            stroke={`url(#${plateId})`} strokeWidth="1" />
        </svg>

        {/* Content — crest at the notch (over the splash seam), then overline/title/underline */}
        <div className="relative flex h-full flex-col items-center" style={{ paddingTop: "6px" }}>
          <CrestMedallion />
          <p className="mt-4 text-center uppercase" style={{ fontSize: "14px", fontWeight: 400, color: "var(--color-universe-title)", letterSpacing: "4px", fontFamily: "var(--font-body)" }}>
            {current.overline}
          </p>
          <p className="mt-2 text-center font-display uppercase" style={{ fontSize: "30px", fontWeight: 400, color: "var(--color-universe-overline)", letterSpacing: "3px", lineHeight: 1 }}>
            {current.title}
          </p>
          <div className="mt-4 h-px w-16" style={{ backgroundColor: "var(--color-universe-overline)" }} aria-hidden="true" />
        </div>
      </a>
    </div>
  );
}
