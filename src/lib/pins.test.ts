import { describe, expect, it } from "vitest";
import { parsePins, readPins, togglePin, writePins } from "./pins";

const known = ["a", "b", "c"];

describe("pins", () => {
  it("starts empty", () => {
    expect(parsePins(null, known)).toEqual([]);
  });

  it("holds any number, in the order pinned", () => {
    const pins = ["c", "a", "b"].reduce<string[]>(togglePin, []);
    expect(pins).toEqual(["c", "a", "b"]);
    expect(togglePin(pins, "a")).toEqual(["c", "b"]);
  });

  it("round-trips through storage", () => {
    const data = new Map<string, string>();
    const store = () => ({
      getItem: (k: string) => data.get(k) ?? null,
      setItem: (k: string, v: string) => void data.set(k, v),
    });
    writePins(["b", "a"], store);
    expect(readPins(known, store)).toEqual(["b", "a"]);
  });

  it("drops junk, unknown ids and repeats", () => {
    expect(parsePins('["a","a","gone",3,null]', known)).toEqual(["a"]);
    expect(parsePins('{"a":1}', known)).toEqual([]);
    expect(parsePins("not json", known)).toEqual([]);
  });

  it("tolerates blocked storage", () => {
    const blocked = (): never => {
      throw new Error("SecurityError");
    };
    expect(readPins(known, blocked)).toEqual([]);
    expect(() => writePins(["a"], blocked)).not.toThrow();
  });
});
