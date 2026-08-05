import type { ShowcaseEntry } from "../showcase";
import {
  LoginAuthTabsSignInDemo,
  LoginAuthTabsQrDemo,
  LoginAuthTabsClassicSignInDemo,
  LoginAuthTabsDemo,
  LoginAuthTabsClassicDemo,
} from "./login-auth-tabs.demo";

export const loginAuthTabsShowcase: ShowcaseEntry = {
  slug: "login-auth-tabs",
  name: "LoginAuthTabs",
  area: "login",
  description:
    "Segmented Sign-in | QR Code tab strip for the Classic login panel. Themes via login tokens so it works in both current (white) and classic (gold) contexts.",
  variants: [
    {
      name: "Sign-in active (current theme)",
      backgrounds: ["dark", "light"],
      notes:
        'Current-theme styling — white bg, riot-red underline. data-shot="login-auth-tabs"',
      render: () => (
        <div data-shot="login-auth-tabs">
          <LoginAuthTabsSignInDemo />
        </div>
      ),
    },
    {
      name: "QR Code active (current theme)",
      backgrounds: ["dark", "light"],
      notes: "QR tab selected in current theme.",
      render: () => <LoginAuthTabsQrDemo />,
    },
    {
      name: "Sign-in active (classic theme)",
      backgrounds: ["dark", "light"],
      notes: "Inside .login-classic scope — bg and accent remap to gold.",
      render: () => <LoginAuthTabsClassicSignInDemo />,
    },
    {
      name: "Interactive demo",
      backgrounds: ["dark", "light"],
      notes: "Click tabs to toggle; active state is shown below.",
      render: () => <LoginAuthTabsDemo />,
    },
    {
      name: "Interactive demo (classic)",
      backgrounds: ["dark", "light"],
      notes: "Same interactive demo inside .login-classic scope.",
      render: () => <LoginAuthTabsClassicDemo />,
    },
  ],
};
