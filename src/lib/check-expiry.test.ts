import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { masjidSchema, type Masjid } from "./masjid-schema";
import { publicData } from "./public-data";

const source = { label: "Website" };
const record = (id: string, name: string, extra: object): Masjid => ({
  id,
  ...masjidSchema.parse({
    order: 1,
    name,
    address: `1 ${name} Road`,
    ...extra,
  }),
});

// Fixtures come from the real producer, so renamed keys fail here.
const writeFixture = (masjids: Masjid[]) => {
  const file = join(mkdtempSync(join(tmpdir(), "expiry-")), "masjids.json");
  writeFileSync(file, JSON.stringify(publicData(masjids)));
  return file;
};

const file = writeFixture([
  record("a", "A", {
    jumuah: { times: ["13:15"], source, checked: "2026-11-26" },
  }),
]);
const iqamaFile = writeFixture([
  record("b", "B", {
    iqama: {
      fajr: "06:10",
      dhuhr: "13:30",
      asr: "16:15",
      maghrib: "17:45",
      isha: "19:30",
      source,
      checked: "2026-11-26",
    },
  }),
]);

const run = (fixture: string, today: string) =>
  spawnSync("node", ["scripts/check-expiry.mjs", fixture, today], {
    encoding: "utf8",
  });

describe("expiry warning", () => {
  it("passes while at least three days remain", () => {
    expect(run(file, "2026-12-06").status).toBe(0);
  });

  it.each([
    ["2026-12-07", "disappears after 2026-12-09"],
    ["2026-12-09", "disappears after 2026-12-09"],
    ["2026-12-10", "expired after 2026-12-09"],
  ])("fails on %s and names the masjid", (today, wording) => {
    const result = run(file, today);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain(`A jumuah: ${wording}`);
  });

  it("also reports an expiring iqama set", () => {
    const result = run(iqamaFile, "2026-12-07");
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("B iqama: disappears after 2026-12-09");
  });
});
