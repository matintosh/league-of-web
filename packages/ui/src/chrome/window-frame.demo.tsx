"use client";

import { WindowFrame } from "./window-frame";

const PlaceholderContent = () => (
  <div className="flex h-full min-h-40 items-center justify-center font-body text-sm text-grey-1">
    App content
  </div>
);

export function WindowFrameDefaultDemo() {
  return (
    <div className="h-48 w-96">
      <WindowFrame onMinimize={() => {}} onClose={() => {}}>
        <PlaceholderContent />
      </WindowFrame>
    </div>
  );
}

export function WindowFrameWithTitleDemo() {
  return (
    <div className="h-48 w-96">
      <WindowFrame
        title="League of Legends"
        onMinimize={() => {}}
        onClose={() => {}}
      >
        <PlaceholderContent />
      </WindowFrame>
    </div>
  );
}

export function WindowFrameCloseOnlyDemo() {
  return (
    <div className="h-48 w-96">
      <WindowFrame showMinimize={false} onClose={() => {}}>
        <PlaceholderContent />
      </WindowFrame>
    </div>
  );
}

export function WindowFrameNoControlsDemo() {
  return (
    <div className="h-48 w-96">
      <WindowFrame showMinimize={false} showClose={false}>
        <PlaceholderContent />
      </WindowFrame>
    </div>
  );
}

export function WindowFrameIntegratedDemo() {
  return (
    <div className="h-48 w-96">
      <WindowFrame
        chrome="integrated"
        onHelp={() => {}}
        onMinimize={() => {}}
        onClose={() => {}}
      >
        <PlaceholderContent />
      </WindowFrame>
    </div>
  );
}

export function WindowFrameIntegratedWithGearDemo() {
  return (
    <div className="h-48 w-96">
      <WindowFrame
        chrome="integrated"
        onHelp={() => {}}
        onMinimize={() => {}}
        onSettings={() => {}}
        onClose={() => {}}
      >
        <PlaceholderContent />
      </WindowFrame>
    </div>
  );
}

export function WindowFrameStatusDotDemo() {
  return (
    <div className="h-48 w-96">
      <WindowFrame
        chrome="integrated"
        showStatusDot
        onHelp={() => {}}
        onMinimize={() => {}}
        onSettings={() => {}}
        onClose={() => {}}
      >
        <PlaceholderContent />
      </WindowFrame>
    </div>
  );
}
