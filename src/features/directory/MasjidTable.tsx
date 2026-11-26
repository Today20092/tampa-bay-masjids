import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { Fragment } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { needsDateMarker } from "@/lib/freshness";
import type { Masjid } from "@/lib/masjid-schema";
import { PRAYERS, type Schedule } from "@/lib/schedule";
import { formatDate, formatTime, type Now } from "@/lib/time";
import { cn } from "@/lib/utils";
import { ArabicName, JumuahLine, SourceAndActions } from "./MasjidDetail";
import { Check, DailyGrid, JumuahTimes, Replaced } from "./Times";
import type { View } from "./text";

export interface Row {
  masjid: Masjid;
  schedule: Schedule;
}

/** The confirmed set whose times a row is showing, if any. */
export function shownSet({ masjid, schedule }: Row, view: View) {
  if (view === "jumuah") return schedule.jumuah;
  return schedule.iqama ?? (masjid.jumuahOnly ? schedule.jumuah : undefined);
}

function Cells({ masjid, schedule, view }: Row & { view: View }) {
  const wide = "h-12 px-1 text-center whitespace-normal";
  const jumuah = schedule.jumuah && (
    <JumuahTimes times={schedule.jumuah.times} states={schedule.jumuahStates} />
  );
  if (view === "jumuah")
    return <TableCell className={wide}>{jumuah ?? <Check />}</TableCell>;
  if (schedule.iqama)
    return schedule.daily.map(({ time, state }, k) => (
      <TableCell
        key={PRAYERS[k]}
        className={cn(
          "h-12 px-px text-center text-xs tabular-nums",
          state === "next" && "bg-primary font-bold text-primary-foreground",
          state === "past" && "text-past",
        )}
      >
        {time ? formatTime(time) : <Replaced />}
        {state === "next" && <span className="sr-only"> next</span>}
      </TableCell>
    ));
  return (
    <TableCell colSpan={PRAYERS.length} className={wide}>
      {masjid.jumuahOnly && "Jumu‘ah only: "}
      {(masjid.jumuahOnly && jumuah) || <Check />}
    </TableCell>
  );
}

export function MasjidTable({
  rows,
  view,
  now,
  openId,
  pins,
  onToggle,
  onPin,
}: {
  rows: Row[];
  view: View;
  now: Now | null;
  openId: string | null;
  pins: string[];
  onToggle: (id: string) => void;
  onPin: (id: string) => void;
}) {
  const columns = view === "daily" ? [...PRAYERS] : ["Jumu‘ah"];
  const caption = view === "daily" ? "Daily iqama times" : "Jumu‘ah times";
  const sticky = "sticky left-0 z-10";

  return (
    <Table
      className="text-xs"
      containerProps={{
        role: "region",
        "aria-label": `${caption} table`,
        tabIndex: 0,
        className: "rounded-lg border bg-card [container-type:inline-size]",
      }}
    >
      <TableCaption className="sr-only">{caption}</TableCaption>
      <TableHeader className="bg-muted">
        <TableRow className="border-row hover:bg-muted">
          <TableHead
            scope="col"
            className={cn(sticky, "h-9 bg-muted pr-1 pl-2 font-bold")}
          >
            Masjid
          </TableHead>
          {columns.map((name) => (
            <TableHead
              key={name}
              scope="col"
              className={cn(
                "h-9 px-px text-center font-bold",
                view === "daily" && "w-12",
              )}
            >
              {name}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => {
          const { masjid, schedule } = row;
          const open = openId === masjid.id;
          const set = shownSet(row, view);
          const Chevron = open ? ChevronDownIcon : ChevronRightIcon;
          const pinned = pins.includes(masjid.id);
          return (
            <Fragment key={masjid.id}>
              <TableRow className="border-row hover:bg-transparent has-aria-expanded:bg-transparent">
                <TableHead
                  scope="row"
                  className={cn(sticky, "bg-card p-0 whitespace-normal")}
                >
                  <button
                    type="button"
                    className="flex min-h-12 w-full min-w-22 cursor-pointer items-center gap-0.5 py-1 pr-1 pl-1.5 text-left text-xs font-bold -outline-offset-3!"
                    aria-expanded={open}
                    aria-controls={open ? `detail-${masjid.id}` : undefined}
                    onClick={() => onToggle(masjid.id)}
                    data-key={`row-${masjid.id}`}
                  >
                    <Chevron aria-hidden="true" className="size-4 shrink-0" />
                    <span>
                      {masjid.name}
                      {now && set && needsDateMarker(set.checked, now.date) && (
                        <span className="block font-normal text-attention">
                          Checked {formatDate(set.checked)}
                        </span>
                      )}
                    </span>
                  </button>
                </TableHead>
                <Cells {...row} view={view} />
              </TableRow>
              {open && (
                <TableRow
                  id={`detail-${masjid.id}`}
                  className="border-row hover:bg-transparent"
                >
                  <TableCell
                    colSpan={columns.length + 1}
                    className="bg-detail p-0 whitespace-normal"
                  >
                    <div className="sticky left-0 flex w-[100cqw] flex-col gap-2 px-2.5 pt-2 pb-1 text-sm">
                      <div>
                        <p>
                          <ArabicName masjid={masjid} />
                        </p>
                        {masjid.area && (
                          <p className="text-xs text-muted-foreground">
                            {masjid.area}
                          </p>
                        )}
                      </div>
                      {view === "jumuah" && schedule.iqama && (
                        <DailyGrid daily={schedule.daily} />
                      )}
                      <JumuahLine masjid={masjid} schedule={schedule} />
                      {!schedule.iqama && !schedule.jumuah && (
                        <p>
                          <Check />
                        </p>
                      )}
                      <SourceAndActions
                        masjid={masjid}
                        schedule={schedule}
                        pinned={pinned}
                        onPin={() => onPin(masjid.id)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </Fragment>
          );
        })}
      </TableBody>
    </Table>
  );
}
