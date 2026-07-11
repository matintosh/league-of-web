import type { ShowcaseEntry } from "../showcase";
import {
  SearchInputDefaultDemo,
  SearchInputWithValueDemo,
  SearchInputDisabledDemo,
} from "./search-input.demo";

export const searchInputShowcase: ShowcaseEntry = {
  slug: "search-input",
  name: "Search Input",
  area: "chrome",
  description:
    "Dark search field used in the collection sidebar to filter champions.",
  variants: [
    {
      name: "Default",
      notes: "Empty field, fully interactive.",
      render: () => <SearchInputDefaultDemo />,
    },
    {
      name: "With value",
      notes: 'Pre-filled with "Ahri".',
      render: () => <SearchInputWithValueDemo />,
    },
    {
      name: "Disabled",
      notes: "Non-interactive and visually dimmed.",
      render: () => <SearchInputDisabledDemo />,
    },
  ],
};
