**Area:** store

First slice of the Store screen. In the real LoL client the store opens as a full-surface view: a top category bar (FEATURED / CHAMPIONS / SKINS / CHROMAS / LOOT / ACCESSORIES) with wallet + "Purchase RP" on the right, above a grid of purchasable item cards (splash art, name, RP/BE price, sale badges). This issue ships the two store components, the fixture types/data they need, and a `/store` page in `apps/web` that assembles them.

**Visual reference**

*StoreNav* — full-width horizontal bar, `bg-blue-7`, 1px bottom border `border-gold-5`, height ≈ 56px. Left: category labels in `font-display` uppercase `text-sm tracking-widest`; inactive `text-grey-1`, hover `text-gold-2`, active `text-gold-1` with 2px `gold-3` bottom underline. Right: `walletSlot` (page passes `CurrencyDisplay`), then a small "PURCHASE RP" `HextechButton`-style CTA. No rounded corners.

*StoreItemCard* — vertical card, `bg-blue-7`, 1px border `border-gold-5`, hover border `border-gold-3` + slight brightness lift on art. Top: splash art crop, aspect ≈ 3:4 for `md`, 16:9 for `lg`, `object-cover`. Bottom strip (`bg-hextech-black/80`): item name `font-display` uppercase `text-gold-1 text-sm`, below it price row — currency amount in `text-gold-2` (RP) or `text-blue-3` (BE). Sale: `%` badge top-left corner (closest token, no raw hex) and original price struck-through in `text-grey-2` next to sale price. Optional "NEW" tag top-right in `text-gold-1` on `bg-blue-6`. No rounded corners.

*/store page* — route in `apps/web` reusing the chrome shell pattern from `/` (WindowFrame + TopNavbar). Under the navbar: StoreNav, then a responsive grid (4–5 cols desktop, `gap-4`, page padding ≈ `p-6`) of StoreItemCard over `bg-hextech-black`. Category switching just filters the fixture list client-side.

**Props sketch**

Fixture additions (`@low/fixtures`):

```ts
export type StoreCurrency = "rp" | "be";

export interface StoreItem {
  id: string;
  name: string;
  /** Data Dragon champion id, e.g. "Jinx" — page derives art via championSplashUrl(championId, skinNum) */
  championId: string;
  /** 0 = base splash */
  skinNum: number;
  kind: "champion" | "skin" | "chroma" | "bundle";
  category: string; // matches StoreNav category id
  price: { currency: StoreCurrency; amount: number };
  sale?: { originalAmount: number; percentOff: number };
  isNew?: boolean;
}

/** demoStoreItems: >=12 items covering every kind, both currencies, >=2 on sale, >=1 isNew, >=1 long name */
```

Components (`@low/ui`, `src/store/`):

```ts
interface StoreNavProps {
  categories: { id: string; label: string }[];
  activeId: string;
  onSelect: (id: string) => void;
  /** right side, e.g. <CurrencyDisplay/> — accept as node, do not import */
  walletSlot?: ReactNode;
  onPurchaseRp?: () => void;
}

interface StoreItemCardProps {
  item: StoreItem;          // type import only
  /** art URL supplied by page/showcase via championSplashUrl */
  imageSrc: string;
  size?: "md" | "lg";       // default "md"
  onClick?: (id: string) => void;
}
```

**States & variants**

StoreNav: default, hover, active category, with/without walletSlot; no disabled state; no overflow handling (6 fixed categories, never wrap).
StoreItemCard: default, hover, on sale, NEW badge, BE-priced vs RP-priced, `lg` size, long-name truncation (single line, ellipsis). No loading/empty state (page owns data).
/store page: default grid, category with few items (grid doesn't stretch cards), empty category shows centered `text-grey-2` "No items" note.

**Dependencies:** StoreNav slots `CurrencyDisplay` via `walletSlot` (ReactNode prop — do not import). Page composes `WindowFrame`, `TopNavbar`, `CurrencyDisplay`, `PlayerHovercard` same as `/`. For card art, match whatever image pattern ClientShell uses for splash art.

**Acceptance criteria**
- [ ] Matches reference visually
- [ ] Showcase entries (both components) with all meaningful variants
- [ ] Presentational only (props in, callbacks out); fixture values only in page/showcase
- [ ] `StoreItem` + `demoStoreItems` exported from `@low/fixtures`
- [ ] `/store` route renders grid, category filter works, builds as part of `pnpm build`
- [ ] Tokens only, typecheck + build pass
