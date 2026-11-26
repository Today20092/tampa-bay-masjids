const KEY = "pins";

/** Stored text is untrusted: keep known ids, once each, in the order pinned. */
export function parsePins(
  raw: string | null,
  known: readonly string[],
): string[] {
  try {
    const value: unknown = JSON.parse(raw ?? "[]");
    if (!Array.isArray(value)) return [];
    return [...new Set(value)].filter((id): id is string => known.includes(id));
  } catch {
    return [];
  }
}

export const togglePin = (pins: readonly string[], id: string) =>
  pins.includes(id) ? pins.filter((p) => p !== id) : [...pins, id];

type Store = Pick<Storage, "getItem" | "setItem">;
const browserStore = (): Store => localStorage;

// Storage may be blocked or full; pins then last until the page closes.
export function readPins(
  known: readonly string[],
  store = browserStore,
): string[] {
  try {
    return parsePins(store().getItem(KEY), known);
  } catch {
    return [];
  }
}

export function writePins(pins: readonly string[], store = browserStore): void {
  try {
    store().setItem(KEY, JSON.stringify(pins));
  } catch {
    // Ignored on purpose, see readPins.
  }
}
