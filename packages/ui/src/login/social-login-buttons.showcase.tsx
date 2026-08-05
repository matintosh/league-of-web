import type { ShowcaseEntry } from "../showcase";
import { SocialLoginButtons } from "./social-login-buttons";
import { SocialLoginButtonsDemo } from "./social-login-buttons.demo";

const CLASSIC_PROVIDERS = ["facebook", "google", "apple", "xbox", "playstation"] as const;

export const socialLoginButtonsShowcase: ShowcaseEntry = {
  slug: "social-login-buttons",
  name: "SocialLoginButtons",
  area: "login",
  description:
    "Row of equal-width brand sign-in buttons (Facebook, Google, Apple — classic adds Xbox + PlayStation) shown on the login page.",
  variants: [
    {
      name: "Default row (3 providers)",
      backgrounds: ["dark", "light"],
      notes: "Static row on the white login canvas — default facebook/google/apple.",
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
      name: "Classic row (5 providers)",
      backgrounds: ["dark", "light"],
      notes: "Classic theme passes all 5 providers — xbox + playstation added.",
      render: () => (
        <div className="login-classic flex w-80 items-center justify-center bg-login-bg p-4">
          <SocialLoginButtons providers={[...CLASSIC_PROVIDERS]} />
        </div>
      ),
    },
    {
      name: "Interactive demo",
      backgrounds: ["dark", "light"],
      notes: "Clicking a button logs the provider key below the row.",
      render: () => (
        <div className="flex w-64 items-center justify-center bg-login-bg p-4">
          <SocialLoginButtonsDemo />
        </div>
      ),
    },
  ],
};
