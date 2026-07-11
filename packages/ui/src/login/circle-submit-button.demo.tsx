"use client";

import { CircleSubmitButton } from "./circle-submit-button";

/** Static — disabled (default grey) state. */
export function CircleSubmitButtonDisabledDemo() {
  return (
    <div className="bg-login-bg p-6 flex items-center justify-center">
      <CircleSubmitButton disabled ariaLabel="Submit" />
    </div>
  );
}

/** Static — enabled (hover to see riot-red). */
export function CircleSubmitButtonEnabledDemo() {
  return (
    <div className="bg-login-bg p-6 flex items-center justify-center">
      <CircleSubmitButton disabled={false} ariaLabel="Submit" />
    </div>
  );
}
