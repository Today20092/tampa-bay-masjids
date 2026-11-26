import { ChevronDownIcon, Clock3Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { needsDateMarker } from "@/lib/freshness";
import type { Masjid } from "@/lib/masjid-schema";
import type { Schedule } from "@/lib/schedule";
import { formatDate, type Now } from "@/lib/time";
import {
  ArabicName,
  Directions,
  JumuahLine,
  SourceAndActions,
} from "./MasjidDetail";
import { MasjidMark } from "./MasjidMark";
import { Check, DailyGrid } from "./Times";
import { nextLine, type View } from "./text";

export function PinnedCard({
  masjid,
  schedule,
  now,
  view,
  onPin,
}: {
  masjid: Masjid;
  schedule: Schedule;
  now: Now;
  view: View;
  onPin: () => void;
}) {
  const { iqama, jumuah } = schedule;
  const isFridayView = view === "jumuah" || masjid.jumuahOnly;
  const checked = (isFridayView ? jumuah : iqama)?.checked;
  const line = isFridayView ? null : nextLine(schedule);
  const headingId = `pinned-${masjid.id}`;

  return (
    <section aria-labelledby={headingId}>
      <Collapsible>
        <div className="border-t pt-4">
          <div className="flex items-center gap-3">
            <MasjidMark masjid={masjid} />
            <div className="flex flex-col items-start font-bold">
              <h3 id={headingId} className="text-lg">
                {masjid.name}
              </h3>
              {masjid.area && (
                <span className="text-xs font-normal text-muted-foreground">
                  {masjid.area}
                </span>
              )}
              <ArabicName masjid={masjid} />
            </div>
          </div>
          <div className="flex flex-col gap-2.5 pt-3">
            {checked && needsDateMarker(checked, now.date) && (
              <p className="text-xs text-attention">
                Checked {formatDate(checked)}
              </p>
            )}
            {line && (
              <p className="flex items-center gap-2 font-bold text-primary">
                <Clock3Icon aria-hidden="true" className="size-4 shrink-0" />
                {line}
              </p>
            )}
            {isFridayView ? (
              jumuah ? (
                <JumuahLine masjid={masjid} schedule={schedule} />
              ) : (
                <p>
                  <Check />
                </p>
              )
            ) : iqama ? (
              <DailyGrid daily={schedule.daily} flat />
            ) : (
              <p>
                <Check />
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              <Directions masjid={masjid} prominent />
              <CollapsibleTrigger
                render={<Button variant="ghost" size="touch" />}
                className="group/details rounded-full text-muted-foreground font-semibold"
                data-key={`card-${masjid.id}`}
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
            <CollapsibleContent className="flex flex-col gap-2 border-t pt-2">
              <p className="text-xs text-muted-foreground">{masjid.address}</p>
              <SourceAndActions
                masjid={masjid}
                schedule={schedule}
                pinned
                onPin={onPin}
              />
            </CollapsibleContent>
          </div>
        </div>
      </Collapsible>
    </section>
  );
}
