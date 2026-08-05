import type { ShowcaseEntry } from "../showcase";
import { LoginLegalFooter } from "./login-legal-footer";

export const loginLegalFooterShowcase: ShowcaseEntry = {
  slug: "login-legal-footer",
  name: "LoginLegalFooter",
  area: "login",
  description:
    "Version + hCaptcha legal line shown at the bottom of the Classic login panel. Muted placeholder text, uppercase, font-body.",
  variants: [
    {
      name: "Default version",
      backgrounds: ["dark", "light"],
      notes: 'Default version string. data-shot="login-legal-footer"',
      render: () => (
        <div
          data-shot="login-legal-footer"
          className="w-80 bg-login-bg"
        >
          <LoginLegalFooter />
        </div>
      ),
    },
    {
      name: "Custom version",
      backgrounds: ["dark", "light"],
      notes: "Accepts any version string.",
      render: () => (
        <div className="w-80 bg-login-bg">
          <LoginLegalFooter version="15.01.100.1234" />
        </div>
      ),
    },
    {
      name: "Classic theme",
      backgrounds: ["dark", "light"],
      notes: "Inside .login-classic scope — placeholder text remaps to gold-brown.",
      render: () => (
        <div className="login-classic w-80 bg-login-bg">
          <LoginLegalFooter />
        </div>
      ),
    },
  ],
};
