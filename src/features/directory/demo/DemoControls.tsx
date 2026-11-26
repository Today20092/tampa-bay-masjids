import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import type { Masjid } from "@/lib/masjid-schema";
import { makeNow, nowInTampa, toMinutes } from "@/lib/time";
import { sampleMasjids, type Demo } from "./sample";

const pad = (n: number) => String(n).padStart(2, "0");

/** `?demo&at=2026-11-27T11:00` is a Tampa wall-clock time; without `at` it starts at the real one. */
function startAt(): string {
  const at = new URLSearchParams(location.search).get("at");
  if (at && /^\d{4}-\d\d-\d\dT\d\d:\d\d$/.test(at)) return at;
  const { date, minutes } = nowInTampa();
  return `${date}T${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;
}

export default function DemoControls({
  masjids,
  onChange,
}: {
  masjids: Masjid[];
  onChange: (demo: Demo) => void;
}) {
  const [at, setAt] = useState(startAt);

  useEffect(() => {
    const [date, time] = at.split("T");
    onChange({
      now: makeNow(date, toMinutes(time)),
      masjids: sampleMasjids(masjids, date),
    });
  }, [at, masjids, onChange]);

  return (
    <div className="flex flex-col gap-1 rounded-lg bg-sample p-2 text-center text-xs font-bold text-sample-foreground">
      <p>SAMPLE TIMES. Not real. Do not use.</p>
      <label className="flex flex-wrap items-center justify-center gap-2">
        Pretend it is (Tampa)
        <Input
          type="datetime-local"
          value={at}
          onChange={(event) => event.target.value && setAt(event.target.value)}
          className="min-h-11 w-auto bg-card font-normal text-foreground"
        />
      </label>
    </div>
  );
}
