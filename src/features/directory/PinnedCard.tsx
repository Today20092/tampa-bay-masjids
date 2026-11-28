import { ChevronDownIcon, Clock3Icon } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { Masjid } from "@/lib/masjid-schema";
import type { Schedule } from "@/lib/schedule";
import { checkedMarker, shownFor, type View } from "@/lib/shown";
import type { Now } from "@/lib/time";
import {
  ArabicName,
  Directions,
  JumuahLine,
  OtherSchedule,
  PinButton,
  PlaceLine,
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
  const marker = checkedMarker(
    now.date,
    shown,
    shown.checked,
    shown.next?.checked,
  );
  const headingId = `pinned-${masjid.id}`;

  return (
    <Card
      render={<Collapsible render={<section aria-labelledby={headingId} />} />}
      className="group/card grid gap-3 px-3 py-4 md:row-span-2 md:grid-rows-subgrid"
    >
      {/* Laid out like a narrow list row, so each action keeps one spot. */}
      <div className="@container/head">
        <div className="relative">
          <h3 id={headingId} className="text-lg font-bold">
            <CollapsibleTrigger
              data-key={`row-${masjid.id}`}
              className="group/details flex min-h-11 w-full items-center gap-2 pr-26 text-left @max-[18rem]/head:flex-wrap @max-[18rem]/head:pr-0"
            >
              <ChevronDownIcon
                aria-hidden="true"
                className="size-4 shrink-0 group-aria-expanded/details:rotate-180"
              />
              <MasjidMark masjid={masjid} />
              <span className="min-w-0 flex-1 @max-[18rem]/head:min-w-24">
                {masjid.name}
              </span>
            </CollapsibleTrigger>
          </h3>
          <div className="mt-1 flex flex-col items-start font-bold">
            <PlaceLine
              masjid={masjid}
              schedule={schedule}
              miles={miles}
              view={view}
              areaClassName="group-has-aria-expanded/card:whitespace-normal"
            />
            <ArabicName masjid={masjid} />
          </div>
          {/* With enlarged text there is no room beside the name. */}
          <div className="absolute top-0 right-0 flex gap-1.5 @max-[18rem]/head:static @max-[18rem]/head:mt-2">
            <Directions
              masjid={masjid}
              schedule={schedule}
              view={view}
              prominent
              iconOnly
            />
            <PinButton masjid={masjid} pinned onPin={onPin} iconOnly />
          </div>
        </div>
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
        {marker && <p className="text-xs text-attention">{marker}</p>}
        <CollapsibleContent>
          <div className="mt-1 flex flex-col gap-2 border-t pt-2">
            <OtherSchedule
              masjid={masjid}
              schedule={schedule}
              view={view}
              pinned
            />
            <p className="text-xs text-muted-foreground">{masjid.address}</p>
            <SourceAndActions masjid={masjid} schedule={schedule} />
          </div>
        </CollapsibleContent>
      </div>
    </Card>
  );
}
