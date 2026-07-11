'use client';
import { useState } from "react";
import { SkinCard } from "./skin-card";
import { loadingArtUrl } from "@low/fixtures";

const KAYLE = "Kayle";

export function SkinCardClickableDemo() {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div className="p-6 bg-hextech-black flex flex-col gap-4">
      <SkinCard
        name="Kayle Skin 1"
        imageSrc={loadingArtUrl(KAYLE, 1)}
        owned
        onSelect={() => setSelected("Kayle Skin 1")}
      />
      {selected && (
        <p className="font-body text-sm text-gold-1">Selected: {selected}</p>
      )}
    </div>
  );
}
