import { z } from "astro/zod";
import { nowInTampa, toMinutes } from "./time";

const text = z.string().trim().min(1);
const httpsUrl = z.url({ protocol: /^https$/ });
const date = z.iso.date();
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

// shortcut: all five iqama times or none; allow gaps when a masjid needs it.
const iqama = z
  .strictObject({
    fajr: clock,
    dhuhr: clock,
    asr: clock,
    maghrib,
    isha: clock,
    ...confirmed,
  })
  .refine((t) => {
    const [f, d, a, i] = [t.fajr, t.dhuhr, t.asr, t.isha].map(toMinutes);
    // A sunset-based Maghrib moves daily, so only a fixed one is order-checked.
    const m = t.maghrib.startsWith("sunset") ? null : toMinutes(t.maghrib);
    const evening = m === null ? a < i : a < m && m <= i;
    return f < 720 && d >= 720 && d < a && evening;
  }, "Iqama times must run in order: Fajr before noon, then Dhuhr, Asr, Maghrib, Isha");

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
  venue: z.strictObject({ name: text, address: text }).optional(),
  ...confirmed,
});

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
    mapsUrl: z
      .url({ protocol: /^https$/, hostname: /^maps\.app\.goo\.gl$/ })
      .optional(),
    website: httpsUrl.optional(),
    whatsapp: whatsapp.optional(),
    jumuahOnly: z.boolean().default(false),
    /** The masjid has opened but has not started holding formal prayers; the site says so instead of "Check with the masjid" */
    comingSoon: z.boolean().optional(),
    iqama: iqama.optional(),
    jumuah: jumuah.optional(),
  })
  .refine((m) => !m.arabicName || m.nameSource, {
    message: "arabicName needs nameSource, the masjid's own page that shows it",
    path: ["nameSource"],
  })
  .refine((m) => !(m.comingSoon && (m.iqama || m.jumuah || m.jumuahOnly)), {
    message: "A coming-soon masjid has no prayer times yet",
    path: ["comingSoon"],
  })
  .refine((m) => !(m.jumuahOnly && m.iqama), {
    message: "A Jumu‘ah-only masjid has no daily iqama times",
    path: ["iqama"],
  })
  .refine((m) => !m.location || m.location.address === m.address, {
    message:
      "location was geocoded from a different address; geocode the new address",
    path: ["location", "address"],
  });

export type Masjid = z.infer<typeof masjidSchema> & { id: string };
