/**
 * LandingHub — root hub that links to the three primary sections of league-of-web:
 *   • /client  — the League of Legends client clone
 *   • /login   — the LoL sign-in screen
 *   • /merch   — the Riot merch store scaffold
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
  /** Primary section cards — typically three: client, login, merch */
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
 * Layout: a centered dark card with a title block, three primary section tiles
 * in a row, and a footer with project credits plus an optional utility link
 * (e.g. /showcase). The hub chrome uses Hextech tokens; each tile gets a gold
 * border and darkens on hover.
 */
export function LandingHub({ cards, title = "League of Web", subtitle, utilityLink }: LandingHubProps) {
  return (
    <div className="flex min-h-screen w-screen flex-col items-center justify-center bg-hextech-black px-6 py-16">
      {/* Title block */}
      <header className="mb-12 text-center">
        <p className="mb-2 font-display text-xs uppercase tracking-[0.3em] text-gold-4">
          Portfolio project
        </p>
        <h1 className="font-display text-4xl uppercase tracking-widest text-gold-1 md:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-xl text-base text-grey-1">{subtitle}</p>
        )}
      </header>

      {/* Primary section cards */}
      <nav
        aria-label="Sections"
        className="flex w-full max-w-3xl flex-col gap-4 sm:flex-row"
      >
        {cards.map((card) => (
          /* Each card slot is a flex column so the primary card link and the
             optional secondary showcase link stack vertically without nesting
             <a> inside <a> (invalid HTML) and without event handlers. */
          <div key={card.id} className="flex flex-1 flex-col gap-1">
            {/* Primary card — navigates to the section */}
            <a
              href={card.href}
              className="group flex flex-col gap-3 border border-gold-5 bg-blue-7 px-6 py-8 transition-colors duration-200 hover:border-gold-3 hover:bg-blue-6"
            >
              <span className="font-display text-xl uppercase tracking-widest text-gold-2 transition-colors duration-200 group-hover:text-gold-1">
                {card.label}
              </span>
              <span className="text-sm leading-relaxed text-grey-1">
                {card.description}
              </span>
              {card.badge && (
                <span className="mt-auto self-start border border-gold-5 px-2 py-0.5 font-body text-[10px] uppercase tracking-widest text-gold-4">
                  {card.badge}
                </span>
              )}
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

      {/* Footer */}
      <footer className="mt-16 text-center">
        <p className="font-body text-xs uppercase tracking-widest text-gold-5">
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
