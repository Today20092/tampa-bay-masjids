import { describe, expect, it } from "vitest";
import type { Masjid } from "./masjid-schema";
import {
  closeSearch,
  FIRST_VISIT,
  listing,
  openSearch,
  pin,
  search,
  searchStatus,
  toggleOpen,
  type Visit,
} from "./visit";

const masjid = (id: string, name: string) =>
  ({
    id,
    name,
    address: "1 Main St, Tampa, FL",
    aliases: [] as string[],
  }) as Masjid;
const alpha = masjid("a", "Alpha Masjid");
const beta = masjid("b", "Beta Masjid");
const gamma = masjid("c", "Gamma Center");
const masjids = [alpha, beta, gamma];
const rows = masjids.map((m) => ({ masjid: m }));
const ids = (list: { masjid: Masjid }[]) => list.map((r) => r.masjid.id);

const visit = (changes: Partial<Visit>): Visit => ({
  ...FIRST_VISIT,
  ...changes,
});

describe("visit", () => {
  it("first visit shows every masjid and the search box", () => {
    const view = listing(FIRST_VISIT, rows);
    expect(view.searching).toBe(false);
    expect(view.showSearch).toBe(true);
    expect(view.pinned).toEqual([]);
    expect(ids(view.rows)).toEqual(["a", "b", "c"]);
  });

  it("pinning from the table moves focus, announces, and resets search", () => {
    const before = visit({ query: "beta", searchOpen: true, openId: "a" });
    const next = pin(before, beta, false);
    expect(next.visit.pins).toEqual(["b"]);
    expect(next.focus).toBe("pin-b");
    expect(next.status).toBe("Pinned Beta Masjid");
    expect(next.visit.query).toBe("");
    expect(next.visit.searchOpen).toBe(false);
    expect(next.visit.openId).toBe(null);
  });

  it("unpinning keeps the search text", () => {
    const before = visit({ query: "alpha", searchOpen: true, pins: ["b"] });
    const next = pin(before, beta, false);
    expect(next.visit.pins).toEqual([]);
    expect(next.visit.query).toBe("alpha");
    expect(next.status).toBe("Unpinned Beta Masjid");
    expect(next.focus).toBe("pin-b");
  });

  it("pinning on the map while searching keeps search open and focus put", () => {
    const before = visit({ query: "alpha" });
    const next = pin(before, alpha, true);
    expect(next.visit.searchOpen).toBe(true);
    expect(next.visit.query).toBe("alpha");
    expect(next.visit.pins).toEqual(["a"]);
    expect(next.focus).toBe(null);
    expect(next.status).toBe("Pinned Alpha Masjid");
  });

  it("pinned masjids are hidden while searching", () => {
    const view = listing(visit({ query: "beta", pins: ["a"] }), rows);
    expect(view.searching).toBe(true);
    expect(view.pinned).toEqual([]);
    expect(ids(view.rows)).toEqual(["b"]);
  });

  it("unsearched view lists pins in pin order, then the rest", () => {
    const view = listing(visit({ pins: ["c", "a"] }), rows);
    expect(view.showSearch).toBe(false);
    expect(view.pinned.map((r) => r.masjid.id)).toEqual(["c", "a"]);
    expect(ids(view.rows)).toEqual(["b"]);
  });

  it("opening and closing search", () => {
    const opened = openSearch(FIRST_VISIT);
    expect(opened.visit.searchOpen).toBe(true);
    expect(opened.focus).toBe("directory-search-input");

    const closed = closeSearch(
      visit({ query: "x", searchOpen: true, openId: "a", pins: ["b"] }),
    );
    expect(closed.visit).toEqual(visit({ pins: ["b"] }));
    expect(closed.focus).toBe("open-search");
  });

  it("toggling an open row", () => {
    const open = toggleOpen(FIRST_VISIT, "a");
    expect(open.openId).toBe("a");
    expect(toggleOpen(open, "b").openId).toBe("b");
    expect(toggleOpen(open, "a").openId).toBe(null);
  });

  it("typing a search closes the open row", () => {
    expect(search(visit({ openId: "a" }), "gam").openId).toBe(null);
  });

  it("announces the result count", () => {
    expect(searchStatus(masjids, "  ")).toBe("");
    expect(searchStatus(masjids, "alpha")).toBe("1 masjid found");
    expect(searchStatus(masjids, "masjid")).toBe("2 masjids found");
    expect(searchStatus(masjids, "orlando")).toBe(
      "No masjid matches your search",
    );
  });
});
