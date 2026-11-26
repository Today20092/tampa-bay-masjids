import { describe, expect, it } from "vitest";
import { isFresh, needsDateMarker, validThrough } from "./freshness";

describe("freshness", () => {
  it("expires on the 14th day", () => {
    expect(isFresh("2026-11-10", "2026-11-23")).toBe(true);
    expect(isFresh("2026-11-10", "2026-11-24")).toBe(false);
  });

  it("marks times older than 7 days", () => {
    expect(needsDateMarker("2026-11-10", "2026-11-17")).toBe(false);
    expect(needsDateMarker("2026-11-10", "2026-11-18")).toBe(true);
  });

  it("never trusts a check dated after today", () => {
    expect(isFresh("2026-11-27", "2026-11-26")).toBe(false);
  });

  it("expires at the autumn clock change", () => {
    expect(isFresh("2026-10-31", "2026-10-31")).toBe(true);
    expect(isFresh("2026-10-31", "2026-11-01")).toBe(false);
    // A check made on the day of the change counts as after it.
    expect(isFresh("2026-11-01", "2026-11-02")).toBe(true);
  });

  it("expires at the spring clock change", () => {
    expect(isFresh("2027-03-13", "2027-03-14")).toBe(false);
    expect(isFresh("2027-03-14", "2027-03-15")).toBe(true);
  });

  it("states the last day a time may be shown", () => {
    expect(validThrough("2026-11-10")).toBe("2026-11-23");
    expect(validThrough("2026-10-25")).toBe("2026-10-31");
  });
});
