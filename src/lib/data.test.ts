import { describe, expect, it } from "vitest";
import { directionsUrl, reportUrl } from "./links";
import { masjidSchema, type Masjid } from "./masjid-schema";
import { llmsText, publicData } from "./public-data";

const good = { order: 1, name: "Sample", address: "1 Sample Road" };
const source = { label: "Masjid website" };
const iqama = {
  fajr: "06:10",
  dhuhr: "13:30",
  asr: "16:15",
  maghrib: "17:45",
  isha: "19:30",
  source,
  checked: "2026-11-24",
};
const jumuah = { times: ["13:15"], source, checked: "2026-11-24" };
const period = (from: string, to: string, extra: object = {}) => ({
  ...iqama,
  from,
  to,
  checked: "2026-11-27",
  ...extra,
});
const jumuahPeriod = (from: string, to: string) => ({
  ...jumuah,
  from,
  to,
  checked: "2026-11-27",
});
const accepts = (extra: object) =>
  masjidSchema.safeParse({ ...good, ...extra }).success;
const without = (set: object, key: string) =>
  Object.fromEntries(Object.entries(set).filter(([k]) => k !== key));

describe("masjid schema", () => {
  it("accepts a masjid with and without confirmed times", () => {
    expect(accepts({})).toBe(true);
    expect(accepts({ iqama, jumuah })).toBe(true);
  });

  it.each([
    ["no source", { iqama: without(iqama, "source") }],
    ["no checked date", { jumuah: without(jumuah, "checked") }],
    ["impossible date", { jumuah: { ...jumuah, checked: "2026-02-30" } }],
    ["future date", { jumuah: { ...jumuah, checked: "2099-01-01" } }],
    ["12-hour typo", { iqama: { ...iqama, dhuhr: "01:30" } }],
    ["loose format", { iqama: { ...iqama, fajr: "6:10" } }],
    ["Jumu‘ah at night", { jumuah: { ...jumuah, times: ["01:15"] } }],
    ["empty Jumu‘ah", { jumuah: { ...jumuah, times: [] } }],
    ["misspelled key", { iqamah: iqama }],
    ["Arabic name with no source", { arabicName: "مسجد" }],
    ["WhatsApp without approval", { whatsapp: { url: "https://wa.me/1" } }],
    [
      "WhatsApp on another host",
      { whatsapp: { url: "https://example.com/x", approvedOn: "2026-11-01" } },
    ],
    ["script URL", { website: "javascript:alert(1)" }],
    ["daily times on Jumu‘ah only", { jumuahOnly: true, iqama }],
    [
      "a period that ends before it starts",
      { iqamaPeriods: [period("2026-12-14", "2026-12-07")] },
    ],
    [
      "a period longer than 62 days",
      { iqamaPeriods: [period("2026-11-27", "2027-01-29")] },
    ],
    [
      "a period across the clock change",
      { iqamaPeriods: [period("2026-10-25", "2026-11-07")] },
    ],
    [
      "overlapping iqama periods",
      {
        iqamaPeriods: [
          period("2026-12-07", "2026-12-13"),
          period("2026-12-13", "2026-12-31"),
        ],
      },
    ],
    [
      "overlapping Jumu‘ah periods",
      {
        jumuahPeriods: [
          jumuahPeriod("2026-12-01", "2026-12-15"),
          jumuahPeriod("2026-12-10", "2026-12-20"),
        ],
      },
    ],
    [
      "iqama periods on a Jumu‘ah-only masjid",
      { jumuahOnly: true, iqamaPeriods: [period("2026-12-07", "2026-12-13")] },
    ],
    [
      "periods on a coming-soon masjid",
      {
        comingSoon: true,
        jumuahPeriods: [jumuahPeriod("2026-12-07", "2026-12-13")],
      },
    ],
    ["an empty period list", { iqamaPeriods: [] }],
  ])("rejects %s", (_, extra) => {
    expect(accepts(extra)).toBe(false);
  });

  it("accepts adjacent periods that end on the 62nd day", () => {
    expect(
      accepts({
        iqamaPeriods: [
          period("2026-12-07", "2026-12-13"),
          period("2026-12-14", "2026-12-31", { fajr: "06:30" }),
        ],
      }),
    ).toBe(true);
    expect(
      accepts({
        iqamaPeriods: [period("2026-11-27", "2027-01-28")],
      }),
    ).toBe(true);
    expect(
      accepts({
        jumuahOnly: true,
        jumuahPeriods: [jumuahPeriod("2026-12-07", "2026-12-13")],
      }),
    ).toBe(true);
  });
});

describe("links", () => {
  it("keeps the address for maps and adds only the state when it is missing", () => {
    expect(
      decodeURIComponent(directionsUrl({ address: "5905 East 130th Avenue" })),
    ).toMatch(/destination=5905 East 130th Avenue, FL$/);
    expect(directionsUrl({ address: "1 A St, Tampa, FL 33617" })).not.toContain(
      "FL%2033617%2C%20FL",
    );
  });

  it("previews the route to the confirmed maps place, without starting navigation", () => {
    const url = new URL(
      directionsUrl({ address: "1 A St", mapsPlaceId: "ChIJabc" }),
    );
    expect(url.searchParams.get("destination_place_id")).toBe("ChIJabc");
    expect(url.searchParams.has("dir_action")).toBe(false);
  });

  it("names the masjid in the report subject", () => {
    const url = new URL(reportUrl({ name: "Al-Qassam" }));
    expect(url.searchParams.get("subject")).toBe("Wrong time: Al-Qassam");
    expect(url.searchParams.get("body")).toContain("Al-Qassam");
  });
});

describe("public files", () => {
  const masjid: Masjid = {
    id: "sample",
    ...masjidSchema.parse({ ...good, iqama }),
  };

  it("carry source, checked date and expiry with every time", () => {
    const [entry] = publicData([masjid]).masjids;
    expect(entry.iqama).toMatchObject({
      checked: "2026-11-24",
      validThrough: "2026-12-07",
      source,
    });
    expect(entry.jumuah).toBeNull();
    const text = llmsText([masjid]);
    expect(text).toContain("checked 2026-11-24; valid through 2026-12-07");
    expect(text).toContain("Jumu‘ah: check with the masjid");
    expect(text).toContain("Never present a time after its validThrough date");
  });

  it("lists every dated period through its last day", () => {
    const dated: Masjid = {
      id: "sample",
      ...masjidSchema.parse({
        ...good,
        iqama,
        iqamaPeriods: [
          period("2026-12-07", "2026-12-13", { fajr: "06:20" }),
          period("2026-12-14", "2026-12-31", { fajr: "06:30" }),
        ],
      }),
    };
    const [entry] = publicData([dated]).masjids;
    expect(entry.iqamaPeriods).toMatchObject([
      {
        from: "2026-12-07",
        to: "2026-12-13",
        validThrough: "2026-12-13",
        fajr: "06:20",
      },
      {
        from: "2026-12-14",
        to: "2026-12-31",
        validThrough: "2026-12-31",
        fajr: "06:30",
      },
    ]);
    expect(entry.iqama).toMatchObject({ checked: "2026-11-24" });
    const text = llmsText([dated]);
    expect(text).toContain("Iqama periods (use the one covering today)");
    expect(text).toContain(
      "2026-12-07 to 2026-12-13: Fajr 06:20, Dhuhr 13:30, Asr 16:15, Maghrib 17:45, Isha 19:30",
    );
    expect(text).toContain("valid through 2026-12-31");
    expect(text).toContain("pick the period whose from and to cover today");
  });
});
