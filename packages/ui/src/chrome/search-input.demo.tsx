"use client";

import { useState } from "react";
import { SearchInput } from "./search-input";

/** Interactive demo — empty search field with live state. */
export function SearchInputDefaultDemo() {
  const [value, setValue] = useState("");

  return (
    <div className="flex flex-col gap-4 p-6 max-w-xs">
      <SearchInput value={value} onChange={setValue} />
    </div>
  );
}

/** Demo pre-filled with the value "Ahri". */
export function SearchInputWithValueDemo() {
  const [value, setValue] = useState("Ahri");

  return (
    <div className="flex flex-col gap-4 p-6 max-w-xs">
      <SearchInput value={value} onChange={setValue} />
    </div>
  );
}

/** Disabled demo — non-interactive, dimmed. */
export function SearchInputDisabledDemo() {
  return (
    <div className="flex flex-col gap-4 p-6 max-w-xs">
      <SearchInput value="" onChange={() => {}} disabled />
    </div>
  );
}
