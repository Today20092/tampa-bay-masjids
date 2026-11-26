import type { Masjid } from "@/lib/masjid-schema";

const logos: Record<string, string> = {
  "al-qassam": "al-qassam",
  "an-noor": "an-noor",
  daarusalam: "daarusalam",
  istaba: "istaba",
  tmc: "tmc",
  "usf-jumuah": "tmc",
  "wesley-chapel": "wesley-chapel",
};

export function MasjidMark({ masjid }: { masjid: Masjid }) {
  const logo = logos[masjid.id];
  if (!logo) return null;

  return (
    <img
      src={`/masjid-logos/${logo}.png`}
      alt=""
      width={44}
      height={44}
      className="size-11 shrink-0 rounded-sm bg-logo-tile object-contain"
    />
  );
}
