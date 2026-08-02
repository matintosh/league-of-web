/**
 * LandingHub — root hub that links to the three main sections of league-of-web:
 *   • /client  — the League of Legends client clone
 *   • /merch   — the Riot merch store scaffold
 *   • /showcase — the component showcase
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
}

export interface LandingHubProps {
  /** Section cards — typically three: client, merch, showcase */
  cards: LandingHubCard[];
  /** Project title */
  title?: string;
  /** Project subtitle / tagline */
  subtitle?: string;
}

/**
 * LandingHub renders the portfolio root hub.
 *
 * Layout: a centered dark card with a title block, three clickable section
 * tiles in a row, and a footer note. The hub chrome uses Hextech tokens so it
 * feels at home in the existing token theme; each tile gets a gold border and
 * darkens on hover.
 */
export function LandingHub({ cards, title = "League of Web", subtitle }: LandingHubProps) {
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

      {/* Section cards */}
      <nav
        aria-label="Sections"
        className="flex w-full max-w-3xl flex-col gap-4 sm:flex-row"
      >
        {cards.map((card) => (
          /* next/link is rendered at the page layer (href wired via <a>);
             the component itself renders a plain <a> so it stays server-safe. */
          <a
            key={card.id}
            href={card.href}
            className="group flex flex-1 flex-col gap-3 border border-gold-5 bg-blue-7 px-6 py-8 transition-colors duration-200 hover:border-gold-3 hover:bg-blue-6"
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
        ))}
      </nav>

      {/* Footer */}
      <footer className="mt-16 text-center">
        <p className="font-body text-xs uppercase tracking-widest text-gold-5">
          league-of-web · portfolio · 2025
        </p>
      </footer>
    </div>
  );
}
