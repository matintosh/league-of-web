"use client";

import { useState } from "react";
import { LoginCheckbox } from "./login-checkbox";

/** Interactive demo — unchecked by default. */
export function LoginCheckboxUncheckedDemo() {
  const [checked, setChecked] = useState(false);
  return (
    <div className="bg-login-bg p-6">
      <LoginCheckbox checked={checked} onChange={setChecked} label="Stay signed in" />
    </div>
  );
}

/** Interactive demo — starts checked. */
export function LoginCheckboxCheckedDemo() {
  const [checked, setChecked] = useState(true);
  return (
    <div className="bg-login-bg p-6">
      <LoginCheckbox checked={checked} onChange={setChecked} label="Stay signed in" />
    </div>
  );
}

/** Static — disabled unchecked. */
export function LoginCheckboxDisabledDemo() {
  return (
    <div className="bg-login-bg p-6">
      <LoginCheckbox checked={false} onChange={() => {}} label="Stay signed in" disabled />
    </div>
  );
}
