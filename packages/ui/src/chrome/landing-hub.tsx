/**
 * LandingHub — root hub that links to the three primary sections of league-of-web:
 *   • /client    — the League of Legends client clone
 *   • /login     — the LoL sign-in screen
 *   • /launcher  — the Riot/League game launcher
 *   • /merch     — the Riot merch store scaffold
 *
 * A secondary utility link (e.g. /showcase) can be supplied via `utilityLink`
 * and is rendered as a small footer-level text link, not a primary card.
 *
 * Presentational: receives section card definitions and link hrefs; renders
 * no router logic itself. Page wires it with next/link via the `cards` prop.
 *
 * Token note: this component uses Hextech tokens for its chrome because it
 * lives inside the Tailwind v4 theme that the root layout already loads.
 * The merch section card may note it has its own design system (--color-merch-*)
 * without that system being active here — it's a label, not a token usage.
 *
 * Motion: ambient shimmer, hero rise, title glow-pulse, and card stagger are
 * CSS-only keyframes defined in globals.css (landing-hub-* class names).
 * All animations are suppressed under prefers-reduced-motion via a media
 * query in globals.css — no JS is needed.
 */

export interface LandingHubCard {
  /** Unique key for the card */
  id: string;
  /** Short label, e.g. "CLIENT" */
  label: string;
  /** One-line description shown under the label */
  description: string;
  /** Route href — page wires this to next/link */
  href: string;
  /** Optional badge / system note shown below the description */
  badge?: string;
  /**
   * Optional secondary "browse components" link shown inside the card footer.
   * E.g. { label: "Browse components →", href: "/merch/showcase" }.
   */
  showcaseLink?: { label: string; href: string };
}

export interface LandingHubUtilityLink {
  /** Display label */
  label: string;
  /** Route href */
  href: string;
}

export interface LandingHubProps {
  /** Primary section cards — typically four: client, login, launcher, merch */
  cards: LandingHubCard[];
  /** Project title */
  title?: string;
  /** Project subtitle / tagline */
  subtitle?: string;
  /**
   * Optional secondary utility link rendered below the footer (e.g. /showcase).
   * Displayed as a small muted text link, not a primary card.
   */
  utilityLink?: LandingHubUtilityLink;
}

/**
 * LandingHub renders the portfolio root hub.
 *
 * Layout: full-viewport dark field with a Hextech ambient background shimmer,
 * a centred hero block (eyebrow, gold-gradient title, subtitle), four primary
 * section tiles in a responsive grid, and a footer utility link.
 *
 * Design language:
 * - Background: hextech-black field with a slow diagonal gradient shimmer
 *   (blue-7 ↔ blue-5 ↔ hextech-black) via the .landing-hub-ambient CSS class.
 * - Hero title: font-display, uppercase, gold gradient foil via a CSS
 *   linear-gradient clip + gentle glow-pulse animation.
 * - Cards: blue-7 surface, gold hairline border (gold-5 → gold-3 on hover),
 *   smooth translateY lift and shadow glow on hover, badge as a Hextech chip.
 * - Showcase link: sibling <a> below each card (no nested anchors).
 * - All motion is CSS-only and respects prefers-reduced-motion (see globals.css).
 */
export function LandingHub({ cards, title = "League of Web", subtitle, utilityLink }: LandingHubProps) {
  return (
    /* Ambient background: slow-shimmer gradient across the full viewport.
       The gradient references token vars so no raw hex appears here.
       background-size: 300% 300% lets the keyframe travel across the field. */
    <div
      className="landing-hub-ambient relative flex min-h-screen w-screen flex-col items-center justify-center overflow-hidden px-6 py-16"
      style={{
        background: `
          radial-gradient(ellipse 80% 60% at 50% 0%,
            color-mix(in srgb, var(--color-blue-5) 35%, transparent) 0%,
            transparent 70%),
          linear-gradient(
            135deg,
            var(--color-hextech-black) 0%,
            var(--color-blue-7) 40%,
            color-mix(in srgb, var(--color-blue-5) 20%, var(--color-hextech-black)) 70%,
            var(--color-hextech-black) 100%
          )
        `,
        backgroundSize: "300% 300%",
      }}
    >
      {/* Subtle top-edge vignette to frame the hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-48"
        style={{
          background: `linear-gradient(to bottom, color-mix(in srgb, var(--color-gold-5) 12%, transparent), transparent)`,
        }}
      />

      {/* ── Hero block ── */}
      <header className="landing-hub-hero relative z-10 mb-14 text-center">
        {/* Eyebrow — small Hextech label above the title */}
        <p
          className="mb-3 font-display text-[10px] uppercase tracking-[0.4em] text-gold-4"
          aria-label="Portfolio project"
        >
          Portfolio Project
        </p>

        {/* Title — gold gradient foil clip */}
        <h1
          className="landing-hub-title-glow font-display text-5xl uppercase tracking-widest md:text-6xl lg:text-7xl"
          style={{
            background: `linear-gradient(
              135deg,
              var(--color-gold-1) 0%,
              var(--color-gold-cream) 25%,
              var(--color-gold-coin) 50%,
              var(--color-gold-2) 75%,
              var(--color-gold-1) 100%
            )`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {title}
        </h1>

        {/* Hairline gold rule under the title */}
        <div
          aria-hidden
          className="mx-auto mt-5 h-px w-48"
          style={{
            background: `linear-gradient(to right, transparent, var(--color-gold-4), var(--color-gold-3), var(--color-gold-4), transparent)`,
          }}
        />

        {subtitle && (
          <p className="mt-6 max-w-lg text-sm leading-relaxed text-grey-1 md:text-base">
            {subtitle}
          </p>
        )}
      </header>

      {/* ── Primary section cards ── */}
      <nav
        aria-label="Sections"
        className="relative z-10 grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {cards.map((card) => (
          /* Each slot stacks the primary card link and an optional showcase link
             without nesting <a> inside <a> (invalid HTML). */
          <div key={card.id} className="landing-hub-card flex flex-col gap-1.5">
            {/* Primary card — navigates to the section */}
            <a
              href={card.href}
              className="group relative flex flex-col gap-4 overflow-hidden border border-gold-5 bg-blue-7 px-5 py-7 transition-all duration-300 ease-out hover:-translate-y-1"
              style={{
                /* Hover shadow glow — composed via box-shadow with token vars.
                   Cannot express multi-stop box-shadow in Tailwind alone without
                   arbitrary values that would embed raw hex; use inline style
                   so token vars are referenced directly. */
                boxShadow: "0 0 0 0 transparent",
              }}
              /* The hover glow is handled by the pseudo-element approach below
                 combined with Tailwind group utilities. */
            >
              {/* Inset border overlay — intensifies to gold-3 on hover via opacity trick */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 border border-gold-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />

              {/* Ambient inner glow on hover — top-edge teal accent */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  opacity: 0,
                  background: `linear-gradient(to right, transparent, var(--color-gold-3), transparent)`,
                }}
              />

              {/* Card label */}
              <span className="font-display text-lg uppercase tracking-[0.18em] text-gold-2 transition-colors duration-200 group-hover:text-gold-1">
                {card.label}
              </span>

              {/* Card description */}
              <span className="text-xs leading-relaxed text-grey-1">
                {card.description}
              </span>

              {/* Badge — Hextech chip */}
              {card.badge && (
                <span
                  className="mt-auto self-start px-2 py-0.5 font-body text-[9px] uppercase tracking-widest text-gold-4 transition-colors duration-200 group-hover:text-gold-3"
                  style={{
                    border: `1px solid var(--color-gold-5)`,
                    background: `color-mix(in srgb, var(--color-gold-5) 30%, transparent)`,
                  }}
                >
                  {card.badge}
                </span>
              )}

              {/* Card surface hover tint — subtle blue-6 wash */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-blue-6 opacity-0 transition-opacity duration-300 group-hover:opacity-60"
              />
            </a>

            {/* Optional showcase link — sibling to the card, not nested inside */}
            {card.showcaseLink && (
              <a
                href={card.showcaseLink.href}
                className="self-start px-1 font-body text-[10px] uppercase tracking-widest text-gold-5 underline underline-offset-2 transition-colors duration-150 hover:text-gold-3"
              >
                {card.showcaseLink.label}
              </a>
            )}
          </div>
        ))}
      </nav>

      {/* ── Footer ── */}
      <footer className="relative z-10 mt-16 text-center">
        {/* Bottom hairline rule */}
        <div
          aria-hidden
          className="mx-auto mb-5 h-px w-24"
          style={{
            background: `linear-gradient(to right, transparent, var(--color-gold-5), transparent)`,
          }}
        />

        <p className="font-body text-[10px] uppercase tracking-widest text-gold-5">
          league-of-web · portfolio · 2025
        </p>

        {utilityLink && (
          <a
            href={utilityLink.href}
            className="mt-3 inline-block font-body text-[10px] uppercase tracking-widest text-gold-6 transition-colors duration-150 hover:text-gold-4"
          >
            {utilityLink.label}
          </a>
        )}
      </footer>
    </div>
  );
}
