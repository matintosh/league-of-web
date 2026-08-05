"use client";

import { useState } from "react";
import { LoginAuthTabs, type LoginAuthTab } from "./login-auth-tabs";

/** Static demo — sign-in active, current theme. */
export function LoginAuthTabsSignInDemo() {
  const [active, setActive] = useState<LoginAuthTab>("sign-in");
  return (
    <div className="w-80 bg-login-bg">
      <LoginAuthTabs active={active} onSelect={setActive} />
    </div>
  );
}

/** Static demo — QR active, current theme. */
export function LoginAuthTabsQrDemo() {
  const [active, setActive] = useState<LoginAuthTab>("qr");
  return (
    <div className="w-80 bg-login-bg">
      <LoginAuthTabs active={active} onSelect={setActive} />
    </div>
  );
}

/** Static demo — sign-in active, classic theme. */
export function LoginAuthTabsClassicSignInDemo() {
  const [active, setActive] = useState<LoginAuthTab>("sign-in");
  return (
    <div className="login-classic w-80 bg-login-bg">
      <LoginAuthTabs active={active} onSelect={setActive} />
    </div>
  );
}

/** Interactive demo — current theme, shows active tab below. */
export function LoginAuthTabsDemo() {
  const [active, setActive] = useState<LoginAuthTab>("sign-in");
  return (
    <div className="w-80 bg-login-bg">
      <LoginAuthTabs active={active} onSelect={setActive} />
      <p className="mt-2 px-4 font-body text-xs text-login-placeholder">
        Active: <strong>{active}</strong>
      </p>
    </div>
  );
}

/** Interactive demo — classic theme. */
export function LoginAuthTabsClassicDemo() {
  const [active, setActive] = useState<LoginAuthTab>("sign-in");
  return (
    <div className="login-classic w-80 bg-login-bg">
      <LoginAuthTabs active={active} onSelect={setActive} />
      <p className="mt-2 px-4 font-body text-xs text-login-placeholder">
        Active: <strong>{active}</strong>
      </p>
    </div>
  );
}
