import type { ShowcaseEntry } from "../showcase";
import { LaunchSplashDemo } from "./launch-splash.demo";

export const launchSplashShowcase: ShowcaseEntry = {
  slug: "launch-splash",
  name: "Launch Splash",
  area: "chrome",
  description:
    "Full-viewport Riot Games ident video played on app launch, then faded out to reveal the client underneath. Presentational: the shell owns visibility. Video plays once (autoplay, muted, no loop) over a white field; clicking anywhere, pressing Escape, or the video ending all fade out over ~300ms and call onFinished. prefers-reduced-motion skips the splash entirely.",
  variants: [
    {
      name: "Interactive (replay)",
      notes:
        "Demo owns visibility. The ident plays over a placeholder client; click / Escape / video-end all fade to reveal it. Use Replay to remount and play again (key-remount, like a hard reload). With prefers-reduced-motion enabled the splash is skipped and the client shows immediately.",
      render: () => <LaunchSplashDemo />,
    },
  ],
};
