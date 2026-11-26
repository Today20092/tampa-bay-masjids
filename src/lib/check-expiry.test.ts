import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const file = join(mkdtempSync(join(tmpdir(), "expiry-")), "masjids.json");
writeFileSync(
  file,
  JSON.stringify({
    masjids: [
      {
        id: "a",
        name: "A",
        iqama: null,
        jumuah: { validThrough: "2026-12-09", source: { label: "Website" } },
      },
    ],
  }),
);

const run = (today: string) =>
  spawnSync("node", ["scripts/check-expiry.mjs", file, today], {
    encoding: "utf8",
  });

describe("expiry warning", () => {
  it("passes while at least three days remain", () => {
    expect(run("2026-12-06").status).toBe(0);
  });

  it.each([
    ["2026-12-07", "disappears after 2026-12-09"],
    ["2026-12-09", "disappears after 2026-12-09"],
    ["2026-12-10", "expired after 2026-12-09"],
  ])("fails on %s and names the masjid", (today, wording) => {
    const result = run(today);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain(`A jumuah: ${wording}`);
  });
});
