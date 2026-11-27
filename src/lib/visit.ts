import type { Masjid } from "./masjid-schema";
import { togglePin } from "./pins";
import { matches, normalize } from "./search";

/** What one visitor has done on the directory page. */
export interface Visit {
  query: string;
  searchOpen: boolean;
  openId: string | null;
  pins: string[];
}

export const FIRST_VISIT: Visit = {
  query: "",
  searchOpen: false,
  openId: null,
  pins: [],
};

interface Focus {
  visit: Visit;
  focus: string | null;
}

const isSearching = (query: string) => normalize(query) !== "";

/** Typing a search closes the open row. */
export function search(visit: Visit, query: string): Visit {
  return { ...visit, query, openId: null };
}

export function toggleOpen(visit: Visit, id: string): Visit {
  return { ...visit, openId: visit.openId === id ? null : id };
}

export function pin(
  visit: Visit,
  masjid: { id: string; name: string },
  fromMap: boolean,
): Focus & { status: string } {
  const wasPinned = visit.pins.includes(masjid.id);
  const status = `${wasPinned ? "Unpinned" : "Pinned"} ${masjid.name}`;
  const next: Visit = {
    ...visit,
    pins: togglePin(visit.pins, masjid.id),
    openId: null,
  };
  // Pinning on the map keeps the visitor there: no focus move, no search reset.
  if (fromMap) {
    // The first pin would otherwise hide a search that is still filtering.
    const searchOpen = visit.searchOpen || isSearching(visit.query);
    return { visit: { ...next, searchOpen }, focus: null, status };
  }
  const after = wasPinned ? next : { ...next, query: "", searchOpen: false };
  return { visit: after, focus: `pin-${masjid.id}`, status };
}

export function openSearch(visit: Visit): Focus {
  return {
    visit: { ...visit, searchOpen: true },
    focus: "directory-search-input",
  };
}

export function closeSearch(visit: Visit): Focus {
  return {
    visit: { ...visit, query: "", openId: null, searchOpen: false },
    focus: "open-search",
  };
}

/** Pinned cards and table rows for the current visit. */
export function listing<T extends { masjid: Masjid }>(visit: Visit, all: T[]) {
  const searching = isSearching(visit.query);
  const { pins } = visit;
  return {
    searching,
    showSearch: pins.length === 0 || visit.searchOpen,
    pinned: searching
      ? []
      : pins.flatMap((id) => all.filter((row) => row.masjid.id === id)),
    rows: all.filter((row) =>
      searching
        ? matches(row.masjid, visit.query)
        : !pins.includes(row.masjid.id),
    ),
  };
}

/** The screen-reader announcement for a search, or "" when it is empty. */
export function searchStatus(masjids: Masjid[], query: string): string {
  if (!isSearching(query)) return "";
  const count = masjids.filter((m) => matches(m, query)).length;
  if (!count) return "No masjid matches your search";
  return `${count} ${count === 1 ? "masjid" : "masjids"} found`;
}
