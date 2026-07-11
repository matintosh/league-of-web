import type { ShowcaseEntry } from "../showcase";
import { StatMedallion } from "./stat-medallion";

export const statMedallionShowcase: ShowcaseEntry = {
  slug: "stat-medallion",
  name: "Stat Medallion",
  area: "collection",
  description:
    "Circular ornate stat emblem from the collection sidebar — double gold ring with diamond finials, large number, and caption.",
  variants: [
    {
      name: "Default",
      render: () => <StatMedallion value="4" caption="TOTAL SKINS OWNED" />,
    },
    {
      name: "Large number",
      render: () => <StatMedallion value="147" caption="TOTAL SKINS OWNED" />,
    },
    {
      name: "Long caption",
      render: () => (
        <StatMedallion value="12" caption="TOTAL CHAMPIONS OWNED IN COLLECTION" />
      ),
    },
  ],
};
