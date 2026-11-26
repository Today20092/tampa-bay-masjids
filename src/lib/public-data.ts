import { SITE } from "@/data/site";
import { MARK_AFTER_DAYS, STALE_AFTER_DAYS, validThrough } from "./freshness";
import { directionsUrl } from "./links";
import type { Masjid } from "./masjid-schema";
import { TIME_ZONE } from "./time";

const FRESHNESS_RULE =
  `Times are ${TIME_ZONE} wall-clock times in 24-hour HH:MM. Never present a time after its ` +
  `validThrough date: the last day that is under ${STALE_AFTER_DAYS} days after it was checked and before the next ` +
  `US clock change. Show the checked date when it is more than ${MARK_AFTER_DAYS} days old. ` +
  `Where there is no usable time, say "Check with the masjid", except a masjid with comingSoon true, which has not started formal prayers yet and should be described as "Prayers coming soon". ` +
  `Maghrib may be "sunset" (shortly after the sunset adhan) or "sunset+N" (N minutes after it).`;

const dated = <T extends { checked: string }>(set: T | undefined) =>
  set ? { ...set, validThrough: validThrough(set.checked) } : null;

export function publicData(masjids: Masjid[]) {
  return {
    name: SITE.name,
    url: SITE.url,
    timeZone: TIME_ZONE,
    rule: FRESHNESS_RULE,
    masjids: masjids.map((m) => ({
      id: m.id,
      name: m.name,
      arabicName: m.arabicName ?? null,
      area: m.area ?? null,
      address: m.address,
      directions: directionsUrl(m),
      website: m.website ?? null,
      whatsapp: m.whatsapp?.url ?? null,
      jumuahOnly: m.jumuahOnly,
      comingSoon: m.comingSoon ?? false,
      iqama: dated(m.iqama),
      jumuah: dated(m.jumuah),
    })),
  };
}

type Dated = {
  source: { label: string; url?: string };
  checked: string;
  validThrough: string;
};

const from = ({ source, checked, validThrough }: Dated) =>
  `source: ${[source.label, source.url].filter(Boolean).join(" ")}; checked ${checked}; valid through ${validThrough}`;

export function llmsText(masjids: Masjid[]): string {
  const entries = publicData(masjids).masjids.map((m) => {
    const lines = [
      `## ${m.name}${m.arabicName ? ` (${m.arabicName})` : ""}`,
      "",
      `- Address: ${m.address}`,
      `- Directions: ${m.directions}`,
    ];
    if (m.website) lines.push(`- Website: ${m.website}`);
    if (m.whatsapp) lines.push(`- WhatsApp: ${m.whatsapp}`);
    if (m.comingSoon) lines.push("- Prayers coming soon");
    else if (m.jumuahOnly) lines.push("- Jumu‘ah only");
    else if (m.iqama) {
      const { fajr, dhuhr, asr, maghrib, isha } = m.iqama;
      lines.push(
        `- Iqama: Fajr ${fajr}, Dhuhr ${dhuhr}, Asr ${asr}, Maghrib ${maghrib}, Isha ${isha} (${from(m.iqama)})`,
      );
    } else lines.push("- Iqama: check with the masjid");
    if (!m.comingSoon)
      lines.push(
        m.jumuah
          ? `- Jumu‘ah: ${m.jumuah.times.join(", ")}${m.jumuah.venue ? ` at ${m.jumuah.venue.name}, ${m.jumuah.venue.address}` : ""} (${from(m.jumuah)})`
          : "- Jumu‘ah: check with the masjid",
      );
    return lines.join("\n");
  });
  return [
    `# ${SITE.name}`,
    "",
    `> ${SITE.description}`,
    "",
    FRESHNESS_RULE,
    "",
    `- Machine-readable data: ${SITE.url}/masjids.json`,
    `- Facebook group: ${SITE.facebookGroup}`,
    `- Report a wrong time: ${SITE.reportEmail}`,
    "",
    entries.join("\n\n"),
    "",
  ].join("\n");
}
