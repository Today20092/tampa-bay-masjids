// SAMPLE DATA for `astro dev` with ?demo. Not real. Imported only by the dev-only controls.
import type { Masjid } from "@/lib/masjid-schema";
import { addDays, type Now } from "@/lib/time";

export interface Demo {
  now: Now;
  masjids: Masjid[];
}

type Iqama = [string, string, string, string, string];
interface Sample {
  daily?: Iqama;
  jumuah?: string[];
  /** Days before the pretend date that the sample was "checked" */
  age: number;
  whatsapp?: boolean;
}

const SAMPLES: Record<string, Sample> = {
  "al-qassam": {
    daily: ["06:10", "13:30", "16:15", "17:45", "19:30"],
    jumuah: ["13:15", "14:30"],
    age: 2,
    whatsapp: true,
  },
  istaba: {
    daily: ["06:15", "13:00", "16:00", "17:44", "19:15"],
    jumuah: ["13:30"],
    age: 1,
    whatsapp: true,
  },
  tmc: {
    daily: ["06:20", "13:15", "16:30", "17:45", "19:45"],
    jumuah: ["12:35", "13:35"],
    age: 3,
  },
  // 20 days old: must read "Check with the masjid"
  omar: {
    daily: ["06:30", "13:30", "16:30", "17:45", "20:00"],
    jumuah: ["13:30"],
    age: 20,
  },
  // 11 days old: shown with a date marker
  daarusalam: {
    daily: ["06:15", "13:00", "16:20", "17:40", "20:00"],
    jumuah: ["13:15", "14:25"],
    age: 11,
  },
  "wesley-chapel": {
    daily: ["05:55", "12:30", "15:25", "17:44", "19:05"],
    jumuah: ["12:15"],
    age: 2,
  },
  "usf-jumuah": { jumuah: ["13:30"], age: 6 },
};

export function sampleMasjids(masjids: Masjid[], today: string): Masjid[] {
  return masjids.map((masjid) => {
    const sample = SAMPLES[masjid.id];
    if (!sample) return masjid;
    const confirmed = {
      source: { label: "Sample source" },
      checked: addDays(today, -sample.age),
    };
    const [fajr, dhuhr, asr, maghrib, isha] = sample.daily ?? [];
    return {
      ...masjid,
      whatsapp: sample.whatsapp
        ? { url: "https://wa.me/0", approvedOn: confirmed.checked }
        : undefined,
      iqama: sample.daily && {
        fajr: fajr!,
        dhuhr: dhuhr!,
        asr: asr!,
        maghrib: maghrib!,
        isha: isha!,
        ...confirmed,
      },
      jumuah: sample.jumuah && { times: sample.jumuah, ...confirmed },
    };
  });
}
