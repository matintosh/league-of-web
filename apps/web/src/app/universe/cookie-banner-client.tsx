"use client";

/**
 * UniverseCookieBannerClient — thin client wrapper that owns dismiss state for
 * the UniverseCookieBanner presentational component.
 *
 * Pattern mirrors UniverseTopNavWrapper: the layout stays a server component;
 * all useState lives here. Rendered fixed-bottom on every /universe page via
 * the universe layout.tsx.
 */

import { useState } from "react";
import { UniverseCookieBanner } from "@low/ui";

export function UniverseCookieBannerClient() {
  const [visible, setVisible] = useState(true);

  return (
    <UniverseCookieBanner
      privacyHref="https://www.riotgames.com/en/privacy-notice"
      visible={visible}
      onManage={() => setVisible(false)}
      onAccept={() => setVisible(false)}
    />
  );
}
