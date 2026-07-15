"use client";

export interface NavProduct {
  /** Stable id emitted through `onSelect`, e.g. `"league"`, `"tft"`, `"lor"`. */
  id: string;
  /** Visible label, e.g. `LEAGUE`, `TFT`, `LoR`. */
  label: string;
  /**
   * Render the `[R]` gold pill variant (the Legends of Runeterra treatment in
   * the reference) — an olive gold-5 fill, gold-4 border, gold-2 cream label,
   * with a leading Runeterra "R" glyph.
   */
  pill?: boolean;
  /**
   * When true the tab renders muted with `aria-disabled` and does not fire
   * `onSelect`. In the reference every product is selectable, but our routing
   * has no destination for some products (e.g. LoR), so the composing page may
   * mark those disabled. Interactive by default.
   */
  disabled?: boolean;
}

export interface NavProductSwitcherProps {
  /**
   * Product tabs, left→right. In the current-era reference this is
   * `LEAGUE` (active) · `TFT` (muted) · `[R] LoR` (gold pill).
   */
  products: NavProduct[];
  /** ID of the currently active product. */
  activeId: string;
  /** Called with a product id when a non-disabled tab is clicked. */
  onSelect: (id: string) => void;
}

/**
 * The leading `R` glyph inside the LoR pill. The real client uses a Legends of
 * Runeterra brand mark; no CommunityDragon nav-band asset was found for it, so
 * per the #386 placeholder rule this is a hex-framed "R" glyph placeholder.
 *
 * TODO: swap for the real Runeterra mark when an asset URL is sourced (add a
 * helper to `@low/fixtures` alongside `navIconUrl`).
 */
function RuneterraGlyph() {
  return (
    <span
      aria-hidden="true"
      className="grid h-4 w-4 shrink-0 place-items-center rounded-[3px] border border-gold-3 font-display text-[9px] leading-none text-gold-2"
    >
      R
    </span>
  );
}

/**
 * NavProductSwitcher is the current-era product / mode switcher that sits in the
 * top nav band's left zone, immediately right of the PLAY button — three compact
 * tabs: `LEAGUE` (active, near-white), `TFT` (muted), and the `[R] LoR` gold
 * pill. Measured from docs/reference/client-current-navbar-product-tabs.png (a
 * crop of client-current-home-activity-center.jpg, 1280×720): the switcher spans
 * ≈ x225–445, then a large gap runs to the icon cluster (~x630). Sampled ink:
 * LEAGUE `rgb(253,250,241)` (near-white → gold-1), TFT `rgb(210,210,200)`
 * (muted → grey-1), the LoR pill olive fill `rgb(82,67,28)` (→ gold-5), border
 * `rgb(182,165,147)` (→ gold-4), cream label `rgb(225,206,173)` (→ gold-2).
 *
 * ROUTING PRESERVATION (issue #403, option 2 — hybrid): our app's screen
 * navigation (HOME/PROFILE/COLLECTION/COMPETITIVE/STORE/TFT) routes the whole
 * client through the TopNavbar's own nav-item row and is NOT re-architected
 * here. This component is a distinct switcher mounted left of those screen tabs
 * to close the measured left-zone geometry gap. Full "activity center"
 * relocation of screen access (option 1) is a follow-up epic.
 *
 * Purely presentational: products in, `onSelect(id)` out. No internal state, no
 * routing, no data fetching.
 */
export function NavProductSwitcher({
  products,
  activeId,
  onSelect,
}: NavProductSwitcherProps) {
  return (
    <div
      role="tablist"
      aria-label="Product switcher"
      className="flex items-center gap-4"
    >
      {products.map((product) => {
        const isActive = product.id === activeId;
        const isDisabled = product.disabled === true;

        if (product.pill) {
          return (
            <button
              key={product.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-disabled={isDisabled ? true : undefined}
              onClick={isDisabled ? undefined : () => onSelect(product.id)}
              className={[
                "flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-display text-xs tracking-wide transition-colors duration-150",
                isDisabled
                  ? "cursor-default border-gold-4 bg-gold-5 text-gold-2 opacity-70 pointer-events-none"
                  : isActive
                  ? "cursor-pointer border-gold-3 bg-gold-5 text-gold-1"
                  : "cursor-pointer border-gold-4 bg-gold-5 text-gold-2 hover:border-gold-3 hover:text-gold-1",
              ].join(" ")}
            >
              <RuneterraGlyph />
              {product.label}
            </button>
          );
        }

        return (
          <button
            key={product.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-disabled={isDisabled ? true : undefined}
            onClick={isDisabled ? undefined : () => onSelect(product.id)}
            className={[
              "font-display text-sm uppercase tracking-widest transition-colors duration-150",
              isDisabled
                ? "cursor-default text-grey-2 pointer-events-none"
                : isActive
                ? "cursor-pointer text-gold-1"
                : "cursor-pointer text-grey-1 hover:text-gold-1",
            ].join(" ")}
          >
            {product.label}
          </button>
        );
      })}
    </div>
  );
}
