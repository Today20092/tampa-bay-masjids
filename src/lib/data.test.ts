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
  ])("rejects %s", (_, extra) => {
    expect(accepts(extra)).toBe(false);
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

  it("prefers the confirmed maps place over the address", () => {
    const mapsUrl = "https://maps.app.goo.gl/abc";
    expect(directionsUrl({ address: "1 A St", mapsUrl })).toBe(mapsUrl);
  });

  it("names the masjid in the report subject", () => {
    expect(reportUrl({ name: "Al-Qassam" })).toBe(
      "mailto:clean.barn3748@fastmail.com?subject=Wrong%20time%3A%20Al-Qassam",
    );
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
});
