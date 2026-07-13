/**
 * Shared helpers for forge-slot state management.
 * Used by StoreScreen and loot-tab showcase demos.
 */
import type { ForgeSlot } from "@low/fixtures";

/**
 * Returns a new forge-slot tuple with slot `idx` set to null.
 * Pure function — safe to call directly inside a setState updater.
 */
export function clearForgeSlot(
  prev: [ForgeSlot, ForgeSlot, ForgeSlot],
  idx: number,
): [ForgeSlot, ForgeSlot, ForgeSlot] {
  const next = [...prev] as [ForgeSlot, ForgeSlot, ForgeSlot];
  next[idx] = null;
  return next;
}
