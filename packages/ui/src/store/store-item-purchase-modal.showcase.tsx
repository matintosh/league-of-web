import type { ShowcaseEntry } from "../showcase";
import {
  StoreItemPurchaseModalCanAffordDemo,
  StoreItemPurchaseModalCannotAffordDemo,
  StoreItemPurchaseModalSingleItemDemo,
  StoreItemPurchaseModalInteractiveDemo,
} from "./store-item-purchase-modal.demo";

export const storeItemPurchaseModalShowcase: ShowcaseEntry = {
  slug: "store-item-purchase-modal",
  name: "Store Item Purchase Modal",
  area: "store",
  description:
    "Full-screen purchase overlay shown when clicking a Store item. Dark backdrop + ~940×430px gold-bordered panel with three zones: portrait set art (left), breakdown list + price + purchase button (center), 2×2 item preview grid (right). Floating × close button in the top-right corner.",
  variants: [
    {
      name: "Can afford — discounted bundle",
      notes:
        "Purchase button is active (gold border). Riot-red -22% badge + riot-red strikethrough original price. 2×2 preview grid with Champion, Skin, Ward Skin, Icon tiles — full-bleed art with labels overlaid on a bottom scrim; the gold frame appears only on hover (hover a tile to see it).",
      render: () => <StoreItemPurchaseModalCanAffordDemo />,
    },
    {
      name: "Cannot afford — insufficient RP",
      notes:
        "Button greyed-out (cursor-not-allowed). \"* Not enough RP\" error label appears above the price row and \"Not enough RP\" caption below the button.",
      render: () => <StoreItemPurchaseModalCannotAffordDemo />,
    },
    {
      name: "Single item (no bundle)",
      notes:
        "items prop has 1 entry — renders one large preview tile instead of 2×2 grid. No discount shown (originalPrice null, discountPct null).",
      render: () => <StoreItemPurchaseModalSingleItemDemo />,
    },
    {
      name: "Interactive open/close",
      notes:
        "Click the button to open. Close via × button or backdrop click.",
      render: () => <StoreItemPurchaseModalInteractiveDemo />,
    },
  ],
};
