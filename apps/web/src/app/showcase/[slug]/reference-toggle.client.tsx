"use client";

import { useState } from "react";

interface ReferenceToggleProps {
  referenceImage: string;
  referenceNote?: string;
}

/**
 * Client island for the reference image toggle.
 * The parent page stays a server component — only this small piece needs state.
 */
export function ReferenceToggle({ referenceImage, referenceNote }: ReferenceToggleProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="mb-10">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setVisible((v) => !v)}
          className="border border-gold-4 px-4 py-1.5 text-xs uppercase tracking-widest text-gold-3 transition-colors hover:border-gold-2 hover:text-gold-1"
        >
          {visible ? "Hide reference" : "Show reference"}
        </button>
        <span className="text-xs text-grey-3">
          Reference: <code className="font-mono text-grey-2">{referenceImage}</code>
        </span>
      </div>

      {visible && (
        <div className="mt-4">
          {referenceNote && (
            <p className="mb-2 text-xs text-grey-2">{referenceNote}</p>
          )}
          <div className="overflow-hidden rounded-sm border border-grey-4">
            <img
              src={`/docs-ref/${referenceImage}`}
              alt={`Reference screenshot: ${referenceImage}`}
              className="max-w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}
