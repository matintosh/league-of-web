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
      notes: "Label floats to the top-left when the field has a value.",
      render: () => <LoginTextInputFilledDemo />,
    },
    {
      name: "Password",
      notes: "type='password' masks the text; label floats when filled.",
      render: () => <LoginTextInputPasswordDemo />,
    },
    {
      name: "Disabled",
      notes: "Non-interactive, visually dimmed.",
      render: () => <LoginTextInputDisabledDemo />,
    },
  ],
};
