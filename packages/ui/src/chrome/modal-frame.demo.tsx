"use client";

import { useState } from "react";
import { ModalFrame } from "./modal-frame";
import { HextechButton } from "./hextech-button";

/** Interactive demo — owns open state; shows trigger button + modal with footer actions. */
export function ModalFrameDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-center p-8">
      <HextechButton onClick={() => setOpen(true)}>Open modal</HextechButton>

      <ModalFrame
        open={open}
        onClose={() => setOpen(false)}
        title="Confirm Action"
        footer={
          <>
            <HextechButton variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </HextechButton>
            <HextechButton onClick={() => setOpen(false)}>
              Confirm
            </HextechButton>
          </>
        }
      >
        <p>
          Are you sure you want to proceed? This action cannot be undone.
        </p>
        <p className="mt-3 text-grey-1">
          All associated data will be permanently removed from your account.
        </p>
      </ModalFrame>
    </div>
  );
}

/** Static demo showing a modal always-open with a footer containing action buttons. */
export function ModalFrameWithFooterDemo() {
  return (
    <div className="relative h-64 w-full">
      <ModalFrame
        open={true}
        onClose={() => {}}
        title="Settings"
        footer={
          <>
            <HextechButton variant="secondary" onClick={() => {}}>
              Cancel
            </HextechButton>
            <HextechButton onClick={() => {}}>
              Save
            </HextechButton>
          </>
        }
      >
        <p>Configure your preferences below.</p>
      </ModalFrame>
    </div>
  );
}

/** Static demo showing a modal always-open with no footer. */
export function ModalFrameWithoutFooterDemo() {
  return (
    <div className="relative h-56 w-full">
      <ModalFrame
        open={true}
        onClose={() => {}}
        title="Information"
      >
        <p>This modal has no footer — informational content only.</p>
      </ModalFrame>
    </div>
  );
}

/** Static demo with enough content to trigger the overflow-y-auto scroll. */
export function ModalFrameLongContentDemo() {
  return (
    <div className="relative h-96 w-full">
      <ModalFrame
        open={true}
        onClose={() => {}}
        title="Terms of Service"
      >
        {Array.from({ length: 20 }, (_, i) => (
          <p key={i} className="mb-3">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Line {i + 1}.
          </p>
        ))}
      </ModalFrame>
    </div>
  );
}
