# Merch Store — Coverage Map

A living map of our **/merch** clone vs the real store at <https://merch.riotgames.com/en-us/>.
Goal: 1:1 with the real site — real brand assets, Playwright-measured values, no placeholders.

**Legend:** ✅ done (on `main`) · 🔨 in progress (open issue) · ⬜ not started · ⛔ out of scope (checkout/auth/real commerce)

**Status:** last updated 2026-08-03 · **10 / ~18** in-scope components shipped · 0 open merch issues

> Maintained by the merch loop: the research cron refreshes this map each tick, and it's
> refreshed on idle (when the build board is empty). Components live in `packages/ui/src/merch/`;
> the store uses its own `--color-merch-*` design system (see `packages/tokens/src/merch.css`).

---

## Global chrome

| Component | Status | Notes |
|---|---|---|
| Header / top nav (logo, categories, search, cart, account) | ✅ `MerchHeader` | Real Riot Games wordmark SVG (extracted from live site) |
| Announcement / promo bar (above header) | ⬜ | Never confirmed visible on the real site — verify first |
| Footer (link columns, newsletter, social, legal) | ✅ `MerchFooter` | Social icons are real brand marks |

## Homepage (`/merch`)

| Component | Status | Notes |
|---|---|---|
| Hero banner / carousel | ✅ `MerchHeroBanner` | Autoplay carousel w/ slides + dot nav |
| Category tile grid (Apparel / Collectibles / Art / Accessories) | ⬜ | Image tiles below the hero |
| Product grid section ("New Arrivals" + Shop All) | ✅ `MerchProductGrid` | Composes `MerchProductCard` |
| Product card (image, title, price, badge, hover) | ✅ `MerchProductCard` | |

## Collection / category page

| Component | Status | Notes |
|---|---|---|
| Collection hero / banner (breadcrumb, heading) | ✅ `MerchCollectionHero` | Dark + light themes |
| Filter / sort bar | ⬜ | Sidebar vs top-bar, filter chips, sort dropdown |
| Product grid | ✅ (reuses `MerchProductGrid`) | |

## Product-detail page (`/merch/[handle]`)

| Component | Status | Notes |
|---|---|---|
| Product gallery (main image + thumbnail strip) | ✅ `MerchProductGallery` | Controlled selectedIndex |
| Purchase panel (title, price, variants, qty, Add to Cart) | ✅ `MerchPurchasePanel` | Variant chips, qty stepper, sale/OOS states |
| Description / spec accordions | ⬜ | Collapsible product info sections |
| Related products / "Shop the Collection" carousel | ⬜ | Horizontal scroll, 4–6 items |
| Size guide modal | ⬜ | Linked from the size selector |

## Cart

| Component | Status | Notes |
|---|---|---|
| Cart drawer (line items, subtotal, checkout, empty state) | ✅ `MerchCartDrawer` | 400px right slide-in + scrim |
| Full cart page | ⬜ | Standalone `/merch/cart` (if the real site has one) |

## Search

| Component | Status | Notes |
|---|---|---|
| Search overlay / results | ⬜ | Triggered from the header search icon |

## Personalization / other

| Component | Status | Notes |
|---|---|---|
| "My Shop" / Riot Mart tab | ⬜ | Personalized picks section |
| Store shell / layout | ✅ `MerchStore` | Page scaffold |
| Checkout flow | ⛔ | Out of scope (no real commerce) |
| Account / auth pages | ⛔ | Out of scope |

---

## Next up (research rotation)

Ordered by visibility / foundational value:

1. **Category tile grid** (homepage, below hero) — high visibility
2. **Filter / sort bar** (collection pages) — needed for a real category browse
3. **PDP related-products carousel** ("Shop the Collection")
4. **Description / spec accordions** (PDP)
5. **Size guide modal** (PDP)
6. **Search overlay** (header)
7. Verify the **promo bar** exists before building
8. **My Shop** personalization tab

## Routes live on prod

- `/merch` — homepage (header → hero → grid → footer)
- `/merch/[handle]` — product-detail page (gallery + purchase panel)
