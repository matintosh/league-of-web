# Merch Store — Site Map & Coverage

A living **site map** of our **/merch** clone vs the real store at <https://merch.riotgames.com/>.
Goal: 1:1 with the real site — every PAGE built, real brand assets, Playwright-measured, no placeholders.

**Legend:** ✅ page live · 🔨 in progress (open issue) · ⬜ page missing · ⛔ out of scope (real commerce/auth backend)

**Status:** last updated 2026-08-03 · **9 / 9 page types live 🎉** · **22 components** shipped · mobile pixel-perfect ✅ (#618-#623) · **desktop 1:1 fidelity pass ✅ COMPLETE** — PDP typography+proportions #627/#628 (PR #630) + listing 2-col flush redesign #629 (PR #631: real cards w/ franchise overlay + multi-badge + REFINE across all 4 pages, homepage corrected 4-col→2-col, MerchProduct badge→+badges[]+franchiseLabel). Cart = DRY. Every page measured/verified at BOTH 1280 + 390. **Real imagery ✅ SHIPPED** (#632) — uses the actual merch.riotgames.com Sanity-CDN hero banners + 8 real products (hotlink via Next remotePatterns + `merchAssetUrl` helper); champion-splash art gone from /merch. **Independent `/merch/showcase` ✅ SHIPPED** (#633) — under the /merch layout, all 22 merch components render with real merch tokens + Inter (fixed the tokenless-render bug); branded "Merch Design System" page, linked from landing hub. **Hero fixed ✅** — scrim removed (#634) + reselected to VIVID real full-art banners (#635). **Full working nav 🔨** (user-directed) — Categories/Featured dropdown menus + `/merch/sale` + mobile menu + onCategoryClick wired on EVERY page (was only Shop-All, only on 3 pages). **Site map now COMPREHENSIVE** — every `page.tsx` route is listed (store pages + nav-destination routes + supporting routes like /merch/showcase + the [handle] redirect).

> The real store prefixes with `/` (e.g. `/product/<handle>`); our clone nests everything under
> `/merch`. This map tracks PAGES (routes) first; the component table at the bottom tracks the parts
> each page composes. Maintained by the merch loop (refreshed every tick, incl. idle).

---

## PAGES (the site map)

| Page | Real URL | Our route | Status | Composes |
|---|---|---|---|---|
| **Homepage** | `/` | `/merch` | ✅ | Header · HeroBanner · ProductGrid · Footer |
| **Product detail (PDP)** | `/product/<handle>` | `/merch/product/[handle]` | ✅ (canonical; `/merch/[handle]` → 308 redirect) | Gallery · PurchasePanel · (related, accordions ⬜) |
| **Shop All** | `/shop-all/` | `/merch/shop-all` | ✅ | CollectionHero · FilterSortBar · ProductGrid |
| **Collections index** | `/collection/` | `/merch/collection` | ✅ | heading · CategoryTileGrid (3-col tile grid) |
| **Collection / category** | `/collection/<handle>` | `/merch/collection/[handle]` | ✅ | CollectionHero · FilterSortBar · ProductGrid |
| **Cart page** | `/cart` | `/merch/cart` | ✅ | full-page cart: MerchCartPage (line items · summary · checkout) |
| **Search** | `/search` | `/merch/search` | ✅ | MerchSearchBar · results ProductGrid · empty state |
| **Info pages** (FAQ / Shipping / Returns / Collectability / Accessibility / Legal / Cookies / Terms / Privacy) | `/pages/<slug>` | `/merch/pages/[slug]` | ✅ | InfoPage template (9 slugs, footer links wired + resolve 200) |
| **Account / sign-in** | `/account` | `/merch/account` | ✅ | MerchSignInPanel — presentational sign-in stub (no real auth) |

### Nav-destination routes (header nav must reach these)
| Page | Real URL | Our route | Status | Notes |
|---|---|---|---|---|
| **Sale** | `/sale/` | `/merch/sale` | 🔨 nav-build | sale-filtered listing (part of the full-working-nav build) |
| **Categories ▾** | nav dropdown | menu → `/merch/collection/<cat>` | 🔨 nav-build | dropdown menu of product categories |
| **Featured ▾** | nav dropdown | menu → `/merch/collection/<slug>` | 🔨 nav-build | dropdown menu of featured collections/franchises |
| **My Shop** | `/account` (gold) | `/merch/account` | 🔨 nav-build | gold nav item → account |

### Supporting routes (not store pages, but real routes in our app)
| Page | Our route | Status | Notes |
|---|---|---|---|
| **PDP legacy redirect** | `/merch/[handle]` | ✅ | 308 → `/merch/product/[handle]` (kept so old links resolve) |
| **Component showcase** | `/merch/showcase` | ✅ | independent merch design-system browser (22 components, real tokens) |
| **Showcase detail** | `/merch/showcase/[slug]` | ✅ | per-component variants |

> Every `page.tsx` under `apps/web/src/app/merch/` is represented in one of the three tables above. Store-page fidelity is tracked in `docs/merch-fidelity.md`.

## PAGES — next up (build order)

**All 9 store page types shipped.** Active + remaining:

1. **Full working nav** 🔨 — dropdown menus (Categories/Featured) + `/merch/sale` + mobile menu + wire onCategoryClick on every page (user-directed; builder-nav in flight)
2. **PDP sub-components** — related-products carousel ✅ · description accordions ✅ · size-guide ✅ (shipped; remaining: none critical)
3. **Ongoing 1:1 fidelity polish** — the fidelity-engine meta-loop (:53) pixel-diffs each store page vs the real site and files residual deltas

---

## COMPONENTS (the parts pages compose)

**Legend:** ✅ done · 🔨 open issue · ⬜ not started

| Component | Status | Used by |
|---|---|---|
| `MerchHeader` (real Riot logo) | ✅ | all |
| `MerchFooter` | ✅ | all |
| `MerchStore` (shell) | ✅ | all |
| `MerchHeroBanner` | ✅ | Homepage |
| `MerchProductCard` | ✅ | grids |
| `MerchProductGrid` | ✅ | Homepage, Collection, Shop All, Search |
| `MerchCollectionHero` | ✅ | Collection, Shop All |
| `MerchProductGallery` | ✅ | PDP |
| `MerchPurchasePanel` | ✅ | PDP |
| `MerchCartDrawer` | ✅ | all (header cart) |
| Category tile grid (`CategoryTileGrid` + `CategoryTile`) | ✅ | Homepage, Collections index |
| `MerchFilterSortBar` (filter chips + sort dropdown) | ✅ | Collection, Shop All |
| `MerchShopCarousel` (franchise product carousel) | ✅ | PDP |
| `MerchProductInfoTabs` (Description tab below buy panel) | ✅ | PDP |
| `MerchSizeGuideModal` (apparel size table) + PurchasePanel amend | ✅ | PDP |
| Correction: homepage needs NO separate category-tile grid (hero+chip-strip+grid already matches real) | ✅ DRY | — |
| Info-page template (`MerchInfoPage`) | ✅ | Info pages |
| `MerchCartPage` (full-page cart: line items table + order summary) | ✅ | Cart page |

---

## Out of scope

- Checkout flow, payment, real auth/account backend — no real commerce (presentational stubs only where a page is expected).
- Individual product/collection *instances* — we clone page *templates* + representative dummy data (champion splashes via `championSplashUrl`), not Riot's full catalog.
