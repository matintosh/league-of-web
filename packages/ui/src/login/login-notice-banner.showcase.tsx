import type { ShowcaseEntry } from "../showcase";
import { LoginNoticeBanner } from "./login-notice-banner";

export const loginNoticeBannerShowcase: ShowcaseEntry = {
  slug: "login-notice-banner",
  name: "LoginNoticeBanner",
  area: "login",
  description:
    "Warning strip overlaid at the top of the Classic login splash area. Shows a notice (e.g. feature disabled) with a gold warning icon and semi-transparent dark gold-brown background.",
  variants: [
    {
      name: "Split End Transfers Disabled",
      backgrounds: ["dark", "light"],
      notes:
        'Default notice text matching the Classic login reference. data-shot="login-notice-banner"',
      render: () => (
        <div
          data-shot="login-notice-banner"
          className="w-full max-w-sm overflow-hidden"
          style={{ background: "linear-gradient(135deg, #2a1f0e 0%, #1a1208 100%)" }}
        >
          <LoginNoticeBanner text="Split End Transfers Disabled" />
        </div>
      ),
    },
    {
      name: "Custom text",
      backgrounds: ["dark", "light"],
      notes: "Accepts arbitrary notice text.",
      render: () => (
        <div
          className="w-full max-w-sm overflow-hidden"
          style={{ background: "linear-gradient(135deg, #2a1f0e 0%, #1a1208 100%)" }}
        >
          <LoginNoticeBanner text="Maintenance window scheduled for 04:00 UTC" />
        </div>
      ),
    },
    {
      name: "Alert role",
      backgrounds: ["dark", "light"],
      notes: "role='alert' for urgent notices requiring immediate attention.",
      render: () => (
        <div
          className="w-full max-w-sm overflow-hidden"
          style={{ background: "linear-gradient(135deg, #2a1f0e 0%, #1a1208 100%)" }}
        >
          <LoginNoticeBanner text="Service disruption in progress" role="alert" />
        </div>
      ),
    },
  ],
};
