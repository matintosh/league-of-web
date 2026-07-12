import type { ShowcaseEntry } from "../showcase";
import {
  CurrencyDisplayDefaultDemo,
  CurrencyDisplayZeroDemo,
  CurrencyDisplayLargeDemo,
  CurrencyDisplayStackedDemo,
} from "./currency-display.demo";

export const currencyDisplayShowcase: ShowcaseEntry = {
  slug: "currency-display",
  name: "Currency Display",
  area: "chrome",
  description:
    "The RP and BE currency readout shown in the top-right navbar — icon, formatted amount, and a + buy button per currency.",
  variants: [
    {
      name: "Default",
      notes: "Realistic wallet values from demoWallet (1,350 RP · 48,210 BE).",
      render: () => <CurrencyDisplayDefaultDemo />,
    },
    {
      name: "Zero Amounts",
      notes: "Both currencies at 0 — no special empty state, just the number.",
      render: () => <CurrencyDisplayZeroDemo />,
    },
    {
      name: "Large Numbers",
      notes: "12,345 RP and 1,234,567 BE — confirms thousands separator at every magnitude.",
      render: () => <CurrencyDisplayLargeDemo />,
    },
    {
      name: "Stacked",
      notes: "stacked=true — two right-aligned rows (RP/BE) matching the reference top-bar two-row currency block.",
      render: () => <CurrencyDisplayStackedDemo />,
    },
  ],
};
