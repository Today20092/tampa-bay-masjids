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

  it("waits until the last period when a later period or a fresh fallback continues", () => {
    const continued = writeFixture([
      record("c", "C", {
        iqama: {
          fajr: "06:10",
          dhuhr: "13:30",
          asr: "16:15",
          maghrib: "17:45",
          isha: "19:30",
          source,
          checked: "2026-11-26",
        },
        iqamaPeriods: [
          {
            from: "2026-12-07",
            to: "2026-12-13",
            fajr: "06:20",
            dhuhr: "13:00",
            asr: "16:00",
            maghrib: "sunset+10",
            isha: "19:30",
            source: { label: "December sheet" },
            checked: "2026-11-27",
          },
          {
            from: "2026-12-14",
            to: "2026-12-31",
            fajr: "06:30",
            dhuhr: "13:00",
            asr: "16:00",
            maghrib: "sunset+10",
            isha: "19:30",
            source: { label: "December sheet" },
            checked: "2026-11-27",
          },
        ],
      }),
    ]);
    // The standing block would disappear after Dec 9, and the first period after Dec 13.
    expect(run(continued, "2026-12-07").status).toBe(0);
    expect(run(continued, "2026-12-11").status).toBe(0);
    const last = run(continued, "2026-12-29");
    expect(last.status).toBe(1);
    expect(last.stderr).toContain("C iqama: disappears after 2026-12-31");
    expect(last.stderr).toContain("December sheet");
  });

  it("warns when a period ends and nothing fresh follows it", () => {
    const ending = writeFixture([
      record("d", "D", {
        iqamaPeriods: [
          {
            from: "2026-12-01",
            to: "2026-12-10",
            fajr: "06:20",
            dhuhr: "13:00",
            asr: "16:00",
            maghrib: "sunset+10",
            isha: "19:30",
            source,
            checked: "2026-11-27",
          },
        ],
      }),
    ]);
    expect(run(ending, "2026-12-07").status).toBe(0);
    const due = run(ending, "2026-12-08");
    expect(due.status).toBe(1);
    expect(due.stderr).toContain("D iqama: disappears after 2026-12-10");
  });
});
