import type { ShowcaseEntry } from "../showcase";
import { SocialHeader } from "./social-header";
import { SocialHeaderActionLogDemo } from "./social-header.demo";

export const socialHeaderShowcase: ShowcaseEntry = {
  slug: "social-header",
  name: "SocialHeader",
  area: "chrome",
  description:
    'Top strip of the social sidebar — "SOCIAL" label (font-display xs uppercase grey-1) on the left and four icon buttons (add friend, groups, list, search) on the right.',
  variants: [
    {
      name: "Default (no callback)",
      notes:
        'Shows the "SOCIAL" label and all four 16px icon buttons (add-friend, groups, list, search — the search glyph lives here in the current-era rail header). Hover any button to see grey-1 → gold-1 colour transition. data-shot target for visual verification.',
      render: () => (
        <div data-shot="social-header" className="w-64 bg-blue-7">
          <SocialHeader />
        </div>
      ),
    },
    {
      name: "With action logging",
      notes:
        "Click any icon button — the last fired action key is shown below. Demonstrates onAction callback wiring.",
      render: () => <SocialHeaderActionLogDemo />,
    },
  ],
};
