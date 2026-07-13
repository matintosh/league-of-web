import type { ShowcaseEntry } from "../showcase";
import {
  LoginCheckboxUncheckedDemo,
  LoginCheckboxCheckedDemo,
  LoginCheckboxDisabledDemo,
} from "./login-checkbox.demo";

export const loginCheckboxShowcase: ShowcaseEntry = {
  slug: "login-checkbox",
  name: "Login Checkbox",
  area: "login",
  description:
    "Small square checkbox with riot-red fill and white check when checked. Used on Riot's login page (e.g. 'Stay signed in').",
  variants: [
    {
      name: "Unchecked",
      backgrounds: ["dark", "light"],
      notes:
        'Default unchecked state, toggleable. data-shot="login-checkbox"',
      render: () => (
        <div data-shot="login-checkbox">
          <LoginCheckboxUncheckedDemo />
        </div>
      ),
    },
    {
      name: "Checked",
      backgrounds: ["dark", "light"],
      notes: "Starts checked; riot-red fill with white checkmark.",
      render: () => <LoginCheckboxCheckedDemo />,
    },
    {
      name: "Disabled",
      backgrounds: ["dark", "light"],
      notes: "Non-interactive, visually dimmed.",
      render: () => <LoginCheckboxDisabledDemo />,
    },
  ],
};
