"use client";

import { useState } from "react";
import { StoreSubNavBar } from "./store-sub-nav-bar";
import type { StoreTab } from "./store-sub-nav-bar";
import { rpIconUrl } from "@low/fixtures";

export function StoreSubNavBarDefaultDemo() {
  const [activeTab, setActiveTab] = useState<StoreTab>("featured");
  return (
    <div className="bg-blue-7">
      <StoreSubNavBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onPurchaseRP={() => console.log("purchase RP")}
        rpIconSrc={rpIconUrl()}
      />
    </div>
  );
}

export function StoreSubNavBarChampionsActiveDemo() {
  const [activeTab, setActiveTab] = useState<StoreTab>("champions");
  return (
    <div className="bg-blue-7">
      <StoreSubNavBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onPurchaseRP={() => console.log("purchase RP")}
        rpIconSrc={rpIconUrl()}
      />
    </div>
  );
}
