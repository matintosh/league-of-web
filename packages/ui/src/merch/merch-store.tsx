/**
 * MerchStore — presentational shell for the /merch section.
 *
 * This is the FOUNDATION component that the merch build loop slots content
 * into. It owns the page-level layout: header/nav placeholder at the top,
 * a main content slot, and a footer placeholder at the bottom.
 *
 * Token note: merch components use --color-merch-* custom properties, NOT
 * Hextech tokens. The merch store is its own design system (modern e-commerce,
 * not dark game-client). See packages/tokens/src/merch.css for the palette.
 * The Hextech no-default-palette rule is scoped to the client — merch may use
 * a clean modern layout with white backgrounds, warm greys, and the Riot merch
 * red accent.
 *
 * Later agents building merch features should import types from @low/fixtures
 * and pass data as props — never fetch inside @low/ui.
 */

export interface MerchNavLink {
  /** Unique key */
  id: string;
  /** Display label, e.g. "New Arrivals" */
  label: string;
  /** Route href */
  href: string;
}

export interface MerchStoreProps {
  /** Optional nav links to show in the header nav bar */
  navLinks?: MerchNavLink[];
  /** Main content slot — slotted by the page */
  children?: React.ReactNode;
  /** Store name shown in the header */
  storeName?: string;
}

/**
 * MerchStore shell — header + nav + main slot + footer.
 *
 * Uses --color-merch-* tokens declared in packages/tokens/src/merch.css,
 * which the /merch route imports. Falls back gracefully if those variables
 * are not loaded (inherits white/grey defaults).
 */
export function MerchStore({
  navLinks = [],
  children,
  storeName = "Riot Merch",
}: MerchStoreProps) {
  return (
    <div
      className="flex min-h-screen flex-col"
      style={{
        backgroundColor: "var(--color-merch-bg)",
        color: "var(--color-merch-ink)",
        fontFamily: "var(--font-merch, system-ui, sans-serif)",
      }}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Header / top nav                                                    */}
      {/* ------------------------------------------------------------------ */}
      <header
        className="sticky top-0 z-40 border-b"
        style={{
          backgroundColor: "var(--color-merch-bg)",
          borderColor: "var(--color-merch-border)",
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Wordmark */}
          <span
            className="text-lg font-bold uppercase tracking-widest"
            style={{ color: "var(--color-merch-red)" }}
          >
            {storeName}
          </span>

          {/* Nav links */}
          {navLinks.length > 0 && (
            <nav aria-label="Merch navigation" className="hidden gap-8 md:flex">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  className="text-sm uppercase tracking-wider transition-opacity duration-150 hover:opacity-70"
                  style={{ color: "var(--color-merch-ink)" }}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}

          {/* Cart placeholder */}
          <button
            type="button"
            aria-label="Cart"
            className="flex h-8 w-8 items-center justify-center rounded-full transition-opacity duration-150 hover:opacity-70"
            style={{ color: "var(--color-merch-ink)" }}
          >
            <svg
              aria-hidden="true"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </button>
        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* Main content slot                                                   */}
      {/* ------------------------------------------------------------------ */}
      <main className="flex-1">
        {children}
      </main>

      {/* ------------------------------------------------------------------ */}
      {/* Footer placeholder                                                  */}
      {/* ------------------------------------------------------------------ */}
      <footer
        className="border-t py-10"
        style={{
          backgroundColor: "var(--color-merch-surface)",
          borderColor: "var(--color-merch-border)",
          color: "var(--color-merch-muted)",
        }}
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <span
              className="text-sm font-bold uppercase tracking-widest"
              style={{ color: "var(--color-merch-red)" }}
            >
              {storeName}
            </span>
            <p className="text-xs uppercase tracking-wider">
              Riot Games official merchandise
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
