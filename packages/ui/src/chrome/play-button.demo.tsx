"use client";

import { useState } from "react";
import { PlayButton } from "./play-button";

/**
 * Interactive demo — click to toggle between PLAY and STOP states.
 * Demonstrates the 500ms ease-in-out slide animation from the XAML spec.
 */
export function PlayButtonQueueingToggleDemo() {
  const [queueing, setQueueing] = useState(false);

  return (
    <div className="flex flex-col items-start gap-6 p-6">
      <PlayButton
        queueing={queueing}
        onClick={() => setQueueing((q) => !q)}
      />
      <p className="font-body text-sm text-grey-2">
        State: <span className="text-gold-1">{queueing ? "queueing (STOP)" : "ready (PLAY)"}</span>
        {" — "}click the button to toggle
      </p>
    </div>
  );
}
