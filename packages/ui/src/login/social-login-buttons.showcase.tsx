import type { ShowcaseEntry } from "../showcase";
import { SocialLoginButtons } from "./social-login-buttons";
import { SocialLoginButtonsDemo } from "./social-login-buttons.demo";

export const socialLoginButtonsShowcase: ShowcaseEntry = {
  slug: "social-login-buttons",
  name: "SocialLoginButtons",
  area: "login",
  description:
    "Row of three equal-width brand sign-in buttons (Facebook, Google, Apple) shown on Riot's light-theme login page.",
  variants: [
    {
      name: "Default row",
      notes: "Static row on the white login canvas — no callback wired.",
      render: () => (
        <div
          data-shot="social-login-buttons"
          className="flex w-64 items-center justify-center bg-login-bg p-4"
        >
          <SocialLoginButtons />
        </div>
      ),
    },
    {
      name: "Interactive demo",
      notes:
        "Clicking a button logs the provider key below the row.",
      render: () => (
        <div className="flex w-64 items-center justify-center bg-login-bg p-4">
          <SocialLoginButtonsDemo />
        </div>
      ),
    },
  ],
};
