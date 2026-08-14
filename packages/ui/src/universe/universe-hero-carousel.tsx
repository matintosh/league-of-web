import { useId } from "react";

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

/** Content-type crest medallion (champion emblem in a gold ring). */
function CrestMedallion() {
  return (
    <span
      className="flex items-center justify-center rounded-full"
      style={{
        width: "38px",
        height: "38px",
        border: "1px solid var(--color-universe-title)",
        backgroundColor: "var(--color-hextech-black)",
      }}
      aria-hidden="true"
    >
      <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
        <path d="M9 2 L12.5 5 L12.5 10 Q12.5 14 9 16 Q5.5 14 5.5 10 L5.5 5 Z" fill="var(--color-universe-title)" />
        <path d="M9 5 L9 12 M7 7 L11 7" stroke="var(--color-hextech-black)" strokeWidth="1" strokeLinecap="round" />
      </svg>
    </span>
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

  return (
    <div className="relative w-full overflow-hidden" style={{ height: "560px", backgroundColor: "var(--color-universe-bg)" }}>
      <style>{`
        @keyframes uhcKenBurns { from { transform: scale(1.03) } to { transform: scale(1.12) } }
        @keyframes uhcRise { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: translateY(0) } }
        .uhc-center { animation: uhcKenBurns 9000ms ease-out forwards; transform-origin: 50% 40%; }
        .uhc-plate { animation: uhcRise 500ms ease-out both; }
        @media (prefers-reduced-motion: reduce) { .uhc-center { animation: none } .uhc-plate { animation: none } }
      `}</style>

      {/* ── Desaturated neighbor splashes (3-up coverflow) ── */}
      {multi && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img key={`p${safeIndex}`} src={prevSlide.splashUrl} alt="" aria-hidden="true"
            className="absolute inset-y-0 left-0 h-full object-cover"
            style={{ width: "32%", filter: "grayscale(1) brightness(0.3)", objectPosition: "center top" }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img key={`n${safeIndex}`} src={nextSlide.splashUrl} alt="" aria-hidden="true"
            className="absolute inset-y-0 right-0 h-full object-cover"
            style={{ width: "32%", filter: "grayscale(1) brightness(0.3)", objectPosition: "center top" }} />
        </>
      )}

      {/* ── Center splash — full colour, Ken Burns ── */}
      <div className="absolute inset-y-0 overflow-hidden" style={{ left: "50%", transform: "translateX(-50%)", width: multi ? "42%" : "100%" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img key={`c${safeIndex}`} src={current.splashUrl} alt={current.title} className="uhc-center h-full w-full object-cover" style={{ objectPosition: "center top" }} />
        {/* soft edge blend into the grayscale neighbors */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10" style={{ background: "linear-gradient(to right, var(--color-universe-bg), transparent)" }} aria-hidden="true" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10" style={{ background: "linear-gradient(to left, var(--color-universe-bg), transparent)" }} aria-hidden="true" />
      </div>

      {/* bottom vignette so the nameplate reads */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2" style={{ background: "linear-gradient(to top, var(--color-universe-bg) 0%, transparent 100%)" }} aria-hidden="true" />

      {/* ── Faded neighbor titles at far edges ── */}
      {multi && (
        <>
          <p className="absolute left-8 top-[46%] font-display uppercase" style={{ color: "var(--color-universe-title)", opacity: 0.35, fontSize: "14px", letterSpacing: "3px" }} aria-hidden="true">{prevSlide.title}</p>
          <p className="absolute right-8 top-[46%] font-display uppercase" style={{ color: "var(--color-universe-title)", opacity: 0.35, fontSize: "14px", letterSpacing: "3px" }} aria-hidden="true">{nextSlide.title}</p>
        </>
      )}

      {/* ── Arrows on the center splash edges ── */}
      {multi && (
        <>
          <div className="absolute top-[42%] -translate-y-1/2" style={{ left: "31%" }}>
            <ArrowButton direction="prev" onClick={onPrev} label="Previous slide" ringId={prevRingId} />
          </div>
          <div className="absolute top-[42%] -translate-y-1/2" style={{ right: "31%" }}>
            <ArrowButton direction="next" onClick={onNext} label="Next slide" ringId={nextRingId} />
          </div>
        </>
      )}

      {/* ── Angular gold nameplate panel — overlaps bottom center ── */}
      <a
        href={current.href ?? "#"}
        onClick={onSelect ? (e) => { e.preventDefault(); onSelect(index); } : undefined}
        className="uhc-plate absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center"
        style={{ width: "480px", textDecoration: "none" }}
        aria-label={`${current.title} — ${current.overline}`}
      >
        {/* SVG frame: notched top + dark fill + gold outline */}
        <svg viewBox="0 0 480 184" width="480" height="184" className="absolute inset-0" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id={plateId} x1="0" y1="0" x2="480" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="var(--color-gold-4)" />
              <stop offset="50%" stopColor="var(--color-gold-2)" />
              <stop offset="100%" stopColor="var(--color-gold-4)" />
            </linearGradient>
          </defs>
          <path d="M2,20 L168,20 L200,3 L280,3 L312,20 L478,20 L478,182 L2,182 Z"
            fill="var(--color-universe-bg)" fillOpacity="0.96"
            stroke={`url(#${plateId})`} strokeWidth="1.5" />
        </svg>

        {/* Content over the frame */}
        <div className="relative flex flex-col items-center px-6 pt-3 pb-6" style={{ minHeight: "184px", justifyContent: "center" }}>
          <CrestMedallion />
          <p className="mt-3 text-center uppercase" style={{ fontSize: "14px", fontWeight: 400, color: "var(--color-universe-title)", letterSpacing: "4px", fontFamily: "var(--font-body)" }}>
            {current.overline}
          </p>
          <p className="mt-2 text-center font-display uppercase" style={{ fontSize: "30px", fontWeight: 400, color: "var(--color-universe-overline)", letterSpacing: "3px", lineHeight: 1 }}>
            {current.title}
          </p>
          <div className="mt-3 h-px w-16" style={{ backgroundColor: "var(--color-universe-overline)" }} aria-hidden="true" />
        </div>
      </a>
    </div>
  );
}
