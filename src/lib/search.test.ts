import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { masjidSchema, type Masjid } from "./masjid-schema";
import { matches } from "./search";

const dir = new URL("../data/masjids/", import.meta.url);
const masjids: Masjid[] = readdirSync(dir).map((file) => ({
  id: file.replace(".json", ""),
  ...masjidSchema.parse(JSON.parse(readFileSync(new URL(file, dir), "utf8"))),
}));
const find = (query: string) =>
  masjids
    .filter((m) => matches(m, query))
    .map((m) => m.id)
    .sort();

describe("search over the real masjid files", () => {
  it.each([
    ["al qassam", ["al-qassam"]],
    ["ALQASSAM", ["al-qassam"]],
    ["al-qassam", ["al-qassam"]],
    ["jumu'ah", ["usf-jumuah"]],
    ["jumu’ah", ["usf-jumuah"]],
    ["jumuʿah", ["usf-jumuah"]],
    ["darussalam", ["daarusalam"]],
    ["دار السلام", ["daarusalam"]],
    // Hamza forms: the file says القسام and المسجد الجامع.
    ["ألقسام", ["al-qassam"]],
    ["إلجامع", ["istaba"]],
    ["33617", ["al-qassam", "omar", "tmc"]],
    ["١٥٨٣٠", ["daarusalam"]],
    ["8080 north 56th", ["tmc"]],
    ["busch boulevard", ["omar"]],
    ["tampa 33610", ["istaba"]],
    ["wesley chapel", ["an-noor", "wesley-chapel"]],
    ["cedar cir", ["usf-jumuah"]],
    ["orlando", []],
  ])("%s", (query, ids) => {
    expect(find(query)).toEqual(ids);
  });

  it("matches everything for an empty or punctuation-only query", () => {
    expect(find("  - ")).toHaveLength(9);
  });
});
