// Fails when a published time is about to disappear, so someone rechecks it first.
// Usage: node scripts/check-expiry.mjs [masjids.json URL or file] [today as YYYY-MM-DD]
import { readFile } from "node:fs/promises";

const WARN_DAYS = 3;
const tampaToday = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/New_York",
}).format(new Date());
const [
  source = "https://masjids.ayoubabed.xyz/masjids.json",
  today = tampaToday,
] = process.argv.slice(2);

async function read() {
  if (!source.startsWith("https://")) return readFile(source, "utf8");
  const response = await fetch(source, { signal: AbortSignal.timeout(30_000) });
  if (!response.ok) throw new Error(`${source} answered ${response.status}`);
  return response.text();
}

const { masjids } = JSON.parse(await read());
const due = masjids.flatMap((masjid) =>
  ["iqama", "jumuah"].flatMap((kind) => {
    const set = masjid[kind];
    if (!set) return [];
    // validThrough is the last day the site shows the time.
    const daysLeft =
      (Date.parse(set.validThrough) - Date.parse(today)) / 86_400_000;
    if (Number.isNaN(daysLeft))
      throw new Error(`${masjid.id} ${kind}: bad date`);
    if (daysLeft >= WARN_DAYS) return [];
    const when = daysLeft < 0 ? "expired after" : "disappears after";
    const where = set.source.url ?? set.source.label;
    return `${masjid.name} ${kind}: ${when} ${set.validThrough}. Recheck ${where}, then update src/data/masjids/${masjid.id}.json.`;
  }),
);

if (due.length) {
  console.error(due.join("\n"));
  process.exit(1);
}
console.log(`No times expire within ${WARN_DAYS} days of ${today}.`);
