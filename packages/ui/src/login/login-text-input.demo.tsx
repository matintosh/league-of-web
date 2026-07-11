"use client";

import { useState } from "react";
import { LoginTextInput } from "./login-text-input";

/** Interactive demo — default empty state. */
export function LoginTextInputDefaultDemo() {
  const [value, setValue] = useState("");
  return (
    <div className="bg-login-bg p-6 w-72">
      <LoginTextInput value={value} onChange={setValue} label="Username" />
    </div>
  );
}

/** Interactive demo — pre-filled value (label floats). */
export function LoginTextInputFilledDemo() {
  const [value, setValue] = useState("Summoner123");
  return (
    <div className="bg-login-bg p-6 w-72">
      <LoginTextInput value={value} onChange={setValue} label="Username" />
    </div>
  );
}

/** Interactive demo — password type (masks text). */
export function LoginTextInputPasswordDemo() {
  const [value, setValue] = useState("secret");
  return (
    <div className="bg-login-bg p-6 w-72">
      <LoginTextInput value={value} onChange={setValue} label="Password" type="password" />
    </div>
  );
}

/** Static — disabled state. */
export function LoginTextInputDisabledDemo() {
  return (
    <div className="bg-login-bg p-6 w-72">
      <LoginTextInput value="" onChange={() => {}} label="Username" disabled />
    </div>
  );
}
