import { ChevronDownIcon, Clock3Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { Masjid } from "@/lib/masjid-schema";
import type { Schedule } from "@/lib/schedule";
import { dateToMark, shownFor, type View } from "@/lib/shown";
import { formatDate, type Now } from "@/lib/time";
import {
  ArabicName,
  Directions,
  JumuahLine,
  OtherSchedule,
  PinButton,
  placeLine,
  SourceAndActions,
} from "./MasjidDetail";
import { MasjidMark } from "./MasjidMark";
import { Check, DailyGrid } from "./Times";

export function PinnedCard({
  masjid,
  schedule,
  miles,
  now,
  view,
  onPin,
}: {
  masjid: Masjid;
  schedule: Schedule;
  miles?: number;
  now: Now;
  view: View;
  onPin: () => void;
}) {
  const shown = shownFor(masjid, schedule, view);
  const marked = dateToMark(now.date, shown.checked, shown.next?.checked);
  const headingId = `pinned-${masjid.id}`;
  const place = placeLine({ masjid, schedule, miles }, view);

  return (
    <Collapsible
      render={<section aria-labelledby={headingId} />}
      className="grid gap-3 rounded-xl border bg-card px-3 py-4 shadow-lift md:row-span-3 md:grid-rows-subgrid"
    >
      <div className="flex flex-wrap items-start justify-between gap-x-2">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <MasjidMark masjid={masjid} />
          <div className="flex flex-col items-start font-bold">
            <h3 id={headingId} className="text-lg">
              {masjid.name}
            </h3>
            {place && (
              <span className="text-xs font-normal text-muted-foreground">
                {place}
              </span>
            )}
            <ArabicName masjid={masjid} />
          </div>
        </div>
        <PinButton masjid={masjid} pinned onPin={onPin} />
      </div>
      <div className="flex flex-col gap-2">
        {shown.next && (
          <p className="flex items-center gap-2 font-bold text-primary">
            <Clock3Icon aria-hidden="true" className="size-4 shrink-0" />
            {shown.next.line}
          </p>
        )}
        {shown.times === "jumuah" ? (
          <JumuahLine masjid={masjid} schedule={schedule} />
        ) : shown.times === "daily" ? (
          <DailyGrid daily={schedule.daily} pinned />
        ) : (
          <p>
            <Check masjid={masjid} />
          </p>
        )}
        {marked && (
          <p className="text-xs text-attention">Checked {formatDate(marked)}</p>
        )}
      </div>
      <div>
        <div className="flex flex-wrap gap-1">
          <Directions masjid={masjid} prominent />
          <CollapsibleTrigger
            data-key={`row-${masjid.id}`}
            render={<Button variant="ghost" size="touch" />}
            className="group/details rounded-full text-muted-foreground font-semibold"
          >
            <span>
              Details<span className="sr-only"> for {masjid.name}</span>
            </span>
            <ChevronDownIcon
              data-icon="inline-end"
              aria-hidden="true"
              className="group-aria-expanded/details:rotate-180"
            />
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="mt-2 flex flex-col gap-2 border-t pt-2">
          <OtherSchedule
            masjid={masjid}
            schedule={schedule}
            view={view}
            pinned
          />
          <p className="text-xs text-muted-foreground">{masjid.address}</p>
          <SourceAndActions masjid={masjid} schedule={schedule} />
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
