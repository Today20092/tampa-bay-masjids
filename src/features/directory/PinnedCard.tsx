import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { needsDateMarker } from "@/lib/freshness";
import type { Masjid } from "@/lib/masjid-schema";
import type { Schedule } from "@/lib/schedule";
import { formatDate, type Now } from "@/lib/time";
import { ArabicName, JumuahLine, SourceAndActions } from "./MasjidDetail";
import { Check, DailyGrid } from "./Times";
import { nextLine } from "./text";

export function PinnedCard({
  masjid,
  schedule,
  now,
  onPin,
}: {
  masjid: Masjid;
  schedule: Schedule;
  now: Now;
  onPin: () => void;
}) {
  const { iqama, jumuah } = schedule;
  const oldest = [iqama?.checked, jumuah?.checked]
    .filter((d): d is string => Boolean(d))
    .sort()[0];
  const line = nextLine(schedule);
  const nothing = !iqama && !jumuah;
  const headingId = `pinned-${masjid.id}`;

  return (
    <section aria-labelledby={headingId}>
      <Collapsible>
        <Card size="sm" className="gap-2 border-2 border-primary ring-0">
          {/* Wraps rather than the component's two columns, so large text never clips the toggle. */}
          <CardHeader className="flex flex-wrap items-start justify-between gap-2">
            <CardTitle className="flex flex-col items-start font-bold">
              <h2 id={headingId} className="text-[1.0625rem]">
                {masjid.name}
              </h2>
              <ArabicName masjid={masjid} />
            </CardTitle>
            <CollapsibleTrigger
              render={<Button variant="outline" size="touch" />}
              className="group/details border-input bg-card font-semibold"
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
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {oldest && needsDateMarker(oldest, now.date) && (
              <p className="text-xs text-attention">
                Checked {formatDate(oldest)}
              </p>
            )}
            {line && <p className="font-bold">{line}</p>}
            {iqama && <DailyGrid daily={schedule.daily} />}
            {nothing ? (
              <p>
                {masjid.jumuahOnly && "Jumu‘ah only: "}
                <Check />
              </p>
            ) : (
              <>
                {!iqama && !masjid.jumuahOnly && (
                  <p>
                    Daily times: <Check />
                  </p>
                )}
                <JumuahLine masjid={masjid} schedule={schedule} />
              </>
            )}
            <CollapsibleContent className="flex flex-col gap-2 border-t pt-2">
              <p className="text-xs text-muted-foreground">
                Pinned{masjid.area && ` · ${masjid.area}`}
              </p>
              <SourceAndActions
                masjid={masjid}
                schedule={schedule}
                pinned
                onPin={onPin}
              />
            </CollapsibleContent>
          </CardContent>
        </Card>
      </Collapsible>
    </section>
  );
}
