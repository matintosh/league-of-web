import type { ShowcaseEntry } from "../showcase";
import {
  LoginTextInputDefaultDemo,
  LoginTextInputFilledDemo,
  LoginTextInputPasswordDemo,
  LoginTextInputDisabledDemo,
} from "./login-text-input.demo";

export const loginTextInputShowcase: ShowcaseEntry = {
  slug: "login-text-input",
  name: "Login Text Input",
  area: "login",
  description:
    "Filled text input with floating label used on Riot's login page. Light-theme, login-surface background, riot-red focus underline.",
  variants: [
    {
      name: "Default (empty)",
      backgrounds: ["dark", "light"],
      notes:
        'Label sits as uppercase placeholder in the centre of the box. data-shot="login-text-input"',
      render: () => (
        <div data-shot="login-text-input">
          <LoginTextInputDefaultDemo />
        </div>
      ),
    },
    {
      name: "Filled",
      backgrounds: ["dark", "light"],
      notes: "Label floats to the top-left when the field has a value.",
      render: () => <LoginTextInputFilledDemo />,
    },
    {
      name: "Password",
      backgrounds: ["dark", "light"],
      notes: "type='password' masks the text; label floats when filled.",
      render: () => <LoginTextInputPasswordDemo />,
    },
    {
      name: "Disabled",
      backgrounds: ["dark", "light"],
      notes: "Non-interactive, visually dimmed.",
      render: () => <LoginTextInputDisabledDemo />,
    },
  ],
};
