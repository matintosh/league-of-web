import type { ShowcaseEntry } from "../showcase";
import {
  CircleSubmitButtonDisabledDemo,
  CircleSubmitButtonEnabledDemo,
} from "./circle-submit-button.demo";

export const circleSubmitButtonShowcase: ShowcaseEntry = {
  slug: "circle-submit-button",
  name: "Circle Submit Button",
  area: "login",
  description:
    "48×48px rounded-square (r≈12px) submit button used on Riot's login page. Light grey (#c4c4c4) arrow when disabled; riot-red background with white arrow when enabled/hovered. type='submit' by design.",
  variants: [
    {
      name: "Disabled",
      backgrounds: ["dark", "light"],
      notes:
        'Default grey state — white bg, login-placeholder arrow. data-shot="circle-submit-button"',
      render: () => (
        <div data-shot="circle-submit-button">
          <CircleSubmitButtonDisabledDemo />
        </div>
      ),
    },
    {
      name: "Enabled (hover for red)",
      backgrounds: ["dark", "light"],
      notes: "Enabled state — hover to see riot-red background with white arrow.",
      render: () => <CircleSubmitButtonEnabledDemo />,
    },
  ],
};
