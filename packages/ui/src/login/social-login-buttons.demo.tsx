"use client";

import { useState } from "react";
import { SocialLoginButtons } from "./social-login-buttons";

export function SocialLoginButtonsDemo() {
  const [last, setLast] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center gap-4">
      <SocialLoginButtons onProvider={(p) => setLast(p)} />
      <p className="font-body text-xs text-login-ink">
        {last ? `Last clicked: ${last}` : "Click a button above"}
      </p>
    </div>
  );
}
