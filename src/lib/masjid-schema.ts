import { z } from "astro/zod";
import { spansClockChange } from "./freshness";
import { addDays, nowInTampa, toMinutes } from "./time";

const text = z.string().trim().min(1);
const httpsUrl = z.url({ protocol: /^https$/ });
const date = z.iso.date();
/** An owner-confirmed Google Maps place ID */
const placeId = z
  .string()
  .regex(/^[A-Za-z0-9_-]+$/)
  .optional();
const clock = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use 24-hour HH:MM, for example 13:15");

// A confirmed time always carries where it came from and when it was checked.
const confirmed = {
  source: z.strictObject({ label: text, url: httpsUrl.optional() }),
  checked: date.refine(
    (d) => d <= nowInTampa().date,
    "checked date is in the future",
  ),
};

const maghrib = z.union([
  clock,
  z.string().regex(/^sunset(\+([1-9]|[1-5]\d))?$/),
]);

const IQAMA_ORDER =
  "Iqama times must run in order: Fajr before noon, then Dhuhr, Asr, Maghrib, Isha";

// shortcut: all five iqama times or none; allow gaps when a masjid needs it.
function iqamaInOrder(t: {
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}) {
  const [f, d, a, i] = [t.fajr, t.dhuhr, t.asr, t.isha].map(toMinutes);
  // A sunset-based Maghrib moves daily, so only a fixed one is order-checked.
  const m = t.maghrib.startsWith("sunset") ? null : toMinutes(t.maghrib);
  const evening = m === null ? a < i : a < m && m <= i;
  return f < 720 && d >= 720 && d < a && evening;
}

const iqamaObject = z.strictObject({
  fajr: clock,
  dhuhr: clock,
  asr: clock,
  maghrib,
  isha: clock,
  ...confirmed,
});

const iqama = iqamaObject.refine(iqamaInOrder, IQAMA_ORDER);

/** Last day of a period is at most this many days after it was checked. */
const PERIOD_DAYS = 62;

const periodShape = {
  /** First day these times apply, inclusive (America/New_York). */
  from: date,
  /** Last day these times apply, inclusive. */
  to: date,
};

function periodLimits<T extends { from: string; to: string; checked: string }>(
  schema: z.ZodType<T>,
) {
  return schema
    .refine((p) => p.from <= p.to, "Period from is after to")
    .refine(
      (p) => p.to <= addDays(p.checked, PERIOD_DAYS),
      `Period ends more than ${PERIOD_DAYS} days after it was checked`,
    )
    .refine(
      (p) => !spansClockChange(p.from, p.to),
      "A period cannot include a US clock change",
    );
}

function periodsOverlap(periods: { from: string; to: string }[] | undefined) {
  if (!periods) return false;
  const sorted = [...periods].sort((a, b) => a.from.localeCompare(b.from));
  return sorted.some((period, i) => i > 0 && period.from <= sorted[i - 1].to);
}

const jumuah = z.strictObject({
  times: z
    .array(clock)
    .min(1)
    .refine(
      (times) =>
        times.every((t, k) => {
          const at = toMinutes(t);
          return (
            at >= 660 && at <= 1020 && (k === 0 || at > toMinutes(times[k - 1]))
          );
        }),
      "Jumu‘ah times must be in order, between 11:00 and 17:00",
    ),
  /** What the source says `times` are; leave out when it does not say */
  timeIs: z.enum(["khutbah", "start", "iqama"]).optional(),
  /** Where Jumu‘ah is held, when that is not the masjid's own address */
  venue: z
    .strictObject({ name: text, address: text, mapsPlaceId: placeId })
    .optional(),
  ...confirmed,
});

const iqamaPeriod = periodLimits(
  iqamaObject.extend(periodShape).refine(iqamaInOrder, IQAMA_ORDER),
);
const jumuahPeriod = periodLimits(jumuah.extend(periodShape));

const whatsapp = z.strictObject({
  url: z.url({
    protocol: /^https$/,
    hostname: /^(chat\.whatsapp\.com|wa\.me|(www\.)?whatsapp\.com)$/,
  }),
  /** When the masjid publicly approved listing this link */
  approvedOn: date,
});

// US Census Geocoder match of `address`; interpolation is approximate.
const location = z.strictObject({
  address: text,
  lng: z.number().min(-180).max(180),
  lat: z.number().min(-90).max(90),
});

export const masjidSchema = z
  .strictObject({
    order: z.int().positive(),
    name: text,
    arabicName: text.optional(),
    /** The masjid's own page that confirms its name (and Arabic name) */
    nameSource: httpsUrl.optional(),
    aliases: z.array(text).default([]),
    area: text.optional(),
    address: text,
    /** Map point; shown on the map only when present */
    location: location.optional(),
    /** File name in public/masjid-logos/ without .png */
    logo: z
      .string()
      .regex(/^[a-z0-9-]+$/)
      .optional(),
    /** The owner-confirmed Google Maps place, used for Directions instead of the address */
    mapsPlaceId: placeId,
    website: httpsUrl.optional(),
    whatsapp: whatsapp.optional(),
    jumuahOnly: z.boolean().default(false),
    /** The masjid has opened but has not started holding formal prayers; the site says so instead of "Check with the masjid" */
    comingSoon: z.boolean().optional(),
    iqama: iqama.optional(),
    jumuah: jumuah.optional(),
    /** Dated iqama schedules. The period covering today replaces `iqama`. */
    iqamaPeriods: z.array(iqamaPeriod).min(1).optional(),
    /** Dated Jumu‘ah schedules. The period covering today replaces `jumuah`. */
    jumuahPeriods: z.array(jumuahPeriod).min(1).optional(),
  })
  .refine((m) => !m.arabicName || m.nameSource, {
    message: "arabicName needs nameSource, the masjid's own page that shows it",
    path: ["nameSource"],
  })
  .refine((m) => !(m.comingSoon && (m.iqama || m.jumuah || m.jumuahOnly)), {
    message: "A coming-soon masjid has no prayer times yet",
    path: ["comingSoon"],
  })
  .refine((m) => !(m.comingSoon && (m.iqamaPeriods || m.jumuahPeriods)), {
    message: "A coming-soon masjid has no prayer times yet",
    path: ["comingSoon"],
  })
  .refine((m) => !(m.jumuahOnly && m.iqama), {
    message: "A Jumu‘ah-only masjid has no daily iqama times",
    path: ["iqama"],
  })
  .refine((m) => !(m.jumuahOnly && m.iqamaPeriods), {
    message: "A Jumu‘ah-only masjid has no daily iqama times",
    path: ["iqamaPeriods"],
  })
  .refine((m) => !periodsOverlap(m.iqamaPeriods), {
    message: "Iqama periods overlap",
    path: ["iqamaPeriods"],
  })
  .refine((m) => !periodsOverlap(m.jumuahPeriods), {
    message: "Jumu‘ah periods overlap",
    path: ["jumuahPeriods"],
  })
  .refine((m) => !m.location || m.location.address === m.address, {
    message:
      "location was geocoded from a different address; geocode the new address",
    path: ["location", "address"],
  });

export type Masjid = z.infer<typeof masjidSchema> & { id: string };
