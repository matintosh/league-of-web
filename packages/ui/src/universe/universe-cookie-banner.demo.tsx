"use client";

import { useState } from "react";
import { UniverseCookieBanner } from "./universe-cookie-banner";

/** Interactive demo — manages dismiss state. For use in showcase variants only. */
export function UniverseCookieBannerInteractiveDemo() {
  const [visible, setVisible] = useState(true);

  return (
    <div
      className="relative"
      style={{ height: "120px", backgroundColor: "var(--color-universe-bg)" }}
    >
      <div
        className="absolute inset-x-0 bottom-0 flex items-end"
        style={{ pointerEvents: "none" }}
      >
        <div style={{ pointerEvents: "auto", width: "100%" }}>
          <UniverseCookieBanner
            privacyHref="#"
            onManage={() => alert("Manage Preferences clicked")}
            onAccept={() => setVisible(false)}
            visible={visible}
          />
          {!visible && (
            <div
              className="flex items-center justify-center py-4 text-[11px]"
              style={{ color: "var(--color-gold-4)" }}
            >
              Banner dismissed.{" "}
              <button
                type="button"
                className="ml-2 underline"
                style={{ color: "var(--color-gold-2)", background: "none", border: "none", cursor: "pointer", fontSize: "11px" }}
                onClick={() => setVisible(true)}
              >
                Reset
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
