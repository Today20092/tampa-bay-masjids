// Fails when a published time is about to disappear, so someone rechecks it first.
// A dated period stays up through its `to` date. Warn when fewer than three days
// remain and neither the next period nor a fresh fallback continues that run.
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

const addDays = (date, days) => {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
};

const covers = (period, date) => period.from <= date && date <= period.to;

/** The period covering the date, otherwise the standing block while it is still in range. */
function active(set, periods, date) {
  return (
    periods.find((period) => covers(period, date)) ??
    (set && date <= set.validThrough ? set : null)
  );
}

/** Last day of the uninterrupted run that includes today, or the latest day already past. */
function coverageEnd(set, periods, today) {
  const ends = [
    set?.validThrough,
    ...periods.map((period) => period.to),
  ].filter((date) => typeof date === "string");
  if (!ends.length) return null;
  const horizon = ends.reduce((a, b) => (a > b ? a : b));
  if (!active(set, periods, today)) {
    const past = ends.filter((date) => date < today);
    return past.length ? past.reduce((a, b) => (a > b ? a : b)) : null;
  }
  let end = today;
  let cursor = today;
  while (cursor < horizon) {
    const next = addDays(cursor, 1);
    if (!active(set, periods, next)) break;
    end = next;
    cursor = next;
  }
  return end;
}

const { masjids } = JSON.parse(await read());
const due = masjids.flatMap((masjid) =>
  ["iqama", "jumuah"].flatMap((kind) => {
    const set = masjid[kind];
    const periods = masjid[`${kind}Periods`] ?? [];
    if (!set && !periods.length) return [];
    const end = coverageEnd(set, periods, today);
    if (!end) return [];
    const daysLeft = (Date.parse(end) - Date.parse(today)) / 86_400_000;
    if (Number.isNaN(daysLeft))
      throw new Error(`${masjid.id} ${kind}: bad date`);
    if (daysLeft >= WARN_DAYS) return [];
    const shown = active(set, periods, end);
    const when = daysLeft < 0 ? "expired after" : "disappears after";
    const where = shown?.source?.url ?? shown?.source?.label ?? "the masjid";
    return `${masjid.name} ${kind}: ${when} ${end}. Recheck ${where}, then update src/data/masjids/${masjid.id}.json.`;
  }),
);

if (due.length) {
  console.error(due.join("\n"));
  process.exit(1);
}
console.log(`No times expire within ${WARN_DAYS} days of ${today}.`);
