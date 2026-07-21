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
  /**
   * When true, a small up-right external-link arrow (↗) renders immediately
   * right of the tab — the affordance the client draws next to the LoR pill
   * because Legends of Runeterra launches an external product (#462). The glyph
   * comes from `externalLinkSrc` when supplied, else a faithful inline ↗.
   */
  external?: boolean;
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
  /**
   * Optional URL for the external-link ↗ glyph rendered right of any product
   * flagged `external` (#462). Pass `lorArrowUrl()` from `@low/fixtures` at the
   * page level. When omitted, a faithful inline token-filled ↗ is drawn.
   */
  externalLinkSrc?: string;
}

/**
 * Small up-right external-link arrow (↗), token-filled fallback for when no
 * `externalLinkSrc` asset URL is supplied. Matches the ~8×8 client glyph
 * (button-lor-arrow.svg) drawn right of the LoR pill.
 */
function ExternalLinkGlyph() {
  return (
    <svg
      aria-hidden="true"
      width="9"
      height="9"
      viewBox="0 0 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-gold-2"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.3 0H1.8V0.9H5.4L0 6.3V7.2H0.9L6.3 1.8V5.4H7.2V0H6.3Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Full-height darker CELL behind the active product tab (#523). The 2025 client
 * (ref-nav/active-tab.png) renders the active LEAGUE tab inside a subtle
 * vertical-gradient panel spanning the ENTIRE band height — darker at the top
 * (where the gold chevron notches over it) and lifting slightly toward the
 * bottom — rather than a small centred pill backing. Inactive tabs (TFT) have no
 * cell; the LoR gold pill keeps its own treatment.
 *
 * The panel is a strong translucent hextech-black wash (color-mix over the token,
 * so the Miss Fortune splash still bleeds a touch through) — #529 deepens it so
 * the selected tab reads as an OBVIOUSLY darker recessed cell vs the plain TFT
 * tab (the #523 55%→30% wash was nearly invisible over the dark blurred nav).
 * ~80% hextech-black at the top (where the gold chevron notches over it) eases
 * to ~48% mid, then a stronger gold-4 accent (~18%) warms the very bottom edge to
 * echo the key-art. It sits UNDER the label + chevron (both raised above it via
 * `relative`) so text stays legible.
 */
function ActiveCell() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, color-mix(in srgb, var(--color-hextech-black) 80%, transparent) 0%, color-mix(in srgb, var(--color-hextech-black) 48%, transparent) 40%, color-mix(in srgb, var(--color-gold-4) 55%, transparent) 100%)",
     
     
      }}
    />
  );
}

/**
 * Gold down-chevron that drops from the band's top edge, centered over the
 * active product tab (#462). Reuses the `ActiveChevron` geometry from
 * top-navbar.tsx (20×14 gold-3 double-V) so the switcher's active indicator
 * matches the screen-nav row exactly.
 */
function ActiveChevron() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2"
    >
      <svg
        width="20"
        height="14"
        viewBox="0 0 20 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-gold-3"
      >
        <polyline
          points="1,1 10,8 19,1"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <polyline
          points="4,7 10,13 16,7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </span>
  );
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
  externalLinkSrc,
}: NavProductSwitcherProps) {
  return (
    <div
      role="tablist"
      aria-label="Product switcher"
      /* #523: `items-stretch` + `self-stretch` so the switcher fills the band's
         full height (the band is items-stretch at h-22). This lets the active
         product tab render a FULL-HEIGHT darker cell reaching the gold top border
         where the chevron notches, matching the reference LEAGUE treatment
         (ref-nav active-tab.png). Non-active tabs stay vertically centred. */
      className="flex items-stretch self-stretch gap-4"
    >
      {products.map((product) => {
        const isActive = product.id === activeId;
        const isDisabled = product.disabled === true;

        if (product.pill) {
          return (
            <div key={product.id} className="flex items-center gap-2">
              <button
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
              {/* External-link ↗ (#462) — real button-lor-arrow.svg when a URL
                  is supplied, else a token-filled inline fallback. */}
              {product.external &&
                (externalLinkSrc ? (
                  <img
                    src={externalLinkSrc}
                    alt=""
                    aria-hidden="true"
                    width={9}
                    height={9}
                  />
                ) : (
                  <ExternalLinkGlyph />
                ))}
            </div>
          );
        }

        return (
          /* Non-pill product tab. `self-stretch` (#523) makes the tab span the
             band's full height so the active LEAGUE tab reads as a full-height
             CELL (per ref-nav active-tab.png), not a small centred chip. `relative`
             anchors the full-height cell layer + the down-chevron, which now sits
             at the band's top edge (top-0) where it notches down over the cell. */
          <span
            key={product.id}
            className="relative flex items-center self-stretch"
          >
            {isActive && <ActiveCell />}
            {isActive && <ActiveChevron />}
            <button
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-disabled={isDisabled ? true : undefined}
              onClick={isDisabled ? undefined : () => onSelect(product.id)}
              className={[
                "relative px-3 py-1 font-display text-sm uppercase tracking-widest transition-colors duration-150",
                isDisabled
                  ? "cursor-default text-grey-2 pointer-events-none"
                  : isActive
                  ? "cursor-pointer text-gold-1 font-bold"
                  : "cursor-pointer text-grey-1 hover:text-gold-1",
              ].join(" ")}
            >
              {product.label}
            </button>
          </span>
        );
      })}
    </div>
  );
}
