import { existsSync, readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { masjidSchema } from "./masjid-schema";

const dir = new URL("../data/masjids/", import.meta.url);
const records = readdirSync(dir).map((file) => ({
  file,
  json: JSON.parse(readFileSync(new URL(file, dir), "utf8")),
}));

describe("masjid records", () => {
  it.each(records)("$file parses with the schema", ({ json }) => {
    expect(masjidSchema.safeParse(json).success).toBe(true);
  });

  it.each(records.filter((r) => r.json.logo))(
    "$file has a logo file",
    ({ json }) => {
      expect(
        existsSync(
          new URL(
            `../../public/masjid-logos/${json.logo}.png`,
            import.meta.url,
          ),
        ),
      ).toBe(true);
    },
  );

  it.each([
    "abu-bakr",
    "al-qassam",
    "an-noor",
    "daarusalam",
    "istaba",
    "omar",
    "tmc",
    "usf-jumuah",
    "wesley-chapel",
  ])("%s has a map location", (id) => {
    const record = records.find((r) => r.file === `${id}.json`);
    expect(record?.json.location).toBeDefined();
  });

  it("rejects a location geocoded from a different address", () => {
    const tmc = records.find((r) => r.file === "tmc.json")!.json;
    const moved = {
      ...tmc,
      location: { ...tmc.location, address: "1 Other Road, Tampa, FL 33601" },
    };
    expect(masjidSchema.safeParse(moved).success).toBe(false);
  });
});
