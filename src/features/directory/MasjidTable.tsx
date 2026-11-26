import { ChevronDownIcon } from "lucide-react";
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
import {
  ArabicName,
  Directions,
  JumuahLine,
  PinButton,
  SourceAndActions,
} from "./MasjidDetail";
import { MasjidMark } from "./MasjidMark";
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
  const wide = "h-12 px-1 text-center whitespace-normal sm:h-14 sm:text-sm";
  const jumuah = schedule.jumuah && (
    <JumuahTimes times={schedule.jumuah.times} states={schedule.jumuahStates} />
  );
  if (view === "jumuah")
    return (
      <TableCell className={wide}>
        {jumuah ?? <Check masjid={masjid} />}
      </TableCell>
    );
  if (schedule.iqama)
    return schedule.daily.map(({ time, state }, k) => (
      <TableCell
        key={PRAYERS[k]}
        className={cn(
          "h-12 px-1 text-center text-xs tabular-nums sm:h-14 sm:text-sm",
          state === "past" && "text-past",
        )}
      >
        <span
          className={cn(
            "inline-block rounded-md px-1 py-0.5",
            state === "next" && "bg-primary font-bold text-primary-foreground",
          )}
        >
          {time ? formatTime(time) : <Replaced />}
          {state === "next" && <span className="sr-only"> next</span>}
        </span>
      </TableCell>
    ));
  return (
    <TableCell colSpan={PRAYERS.length} className={wide}>
      {masjid.jumuahOnly && "Jumu‘ah only: "}
      {(masjid.jumuahOnly && jumuah) || <Check masjid={masjid} />}
    </TableCell>
  );
}

function RowDetail({ masjid, schedule, view }: Row & { view: View }) {
  return (
    <div className="flex flex-col gap-2 text-sm">
      <div>
        {masjid.arabicName && (
          <p>
            <ArabicName masjid={masjid} />
          </p>
        )}
        <p className="text-muted-foreground">{masjid.address}</p>
      </div>
      {view === "jumuah" && schedule.iqama && (
        <DailyGrid daily={schedule.daily} />
      )}
      {view === "daily" && !masjid.jumuahOnly && (
        <JumuahLine masjid={masjid} schedule={schedule} />
      )}
      <SourceAndActions masjid={masjid} schedule={schedule} />
    </div>
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
    <div className="@container/directory">
      <ul
        aria-label={caption}
        className="divide-y rounded-xl border bg-card @min-[42rem]/directory:hidden"
      >
        {rows.map((row) => {
          const { masjid, schedule } = row;
          const open = openId === masjid.id;
          const set = shownSet(row, view);
          const pinned = pins.includes(masjid.id);
          return (
            <li key={masjid.id} className="space-y-2 p-3">
              <div className="flex flex-wrap items-center justify-between gap-x-2">
                <button
                  type="button"
                  className="group/row flex min-h-11 flex-1 items-center gap-2 text-left font-semibold"
                  aria-expanded={open}
                  aria-controls={
                    open ? `detail-mobile-${masjid.id}` : undefined
                  }
                  onClick={() => onToggle(masjid.id)}
                  data-key={`row-${masjid.id}`}
                >
                  <MasjidMark masjid={masjid} />
                  <span>
                    {masjid.name}
                    {masjid.area && (
                      <span className="block text-xs font-normal text-muted-foreground">
                        {masjid.area}
                      </span>
                    )}
                  </span>
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="size-4 shrink-0 group-aria-expanded/row:rotate-180"
                  />
                </button>
                <div className="flex items-center">
                  <Directions masjid={masjid} />
                  <PinButton
                    masjid={masjid}
                    pinned={pinned}
                    onPin={() => onPin(masjid.id)}
                    compact
                  />
                </div>
              </div>
              {view === "daily" && schedule.iqama ? (
                <DailyGrid daily={schedule.daily} />
              ) : (
                <p className="text-sm">
                  {view === "daily" && masjid.jumuahOnly && "Jumu‘ah only · "}
                  {(view === "jumuah" || masjid.jumuahOnly) &&
                  schedule.jumuah ? (
                    <JumuahTimes
                      times={schedule.jumuah.times}
                      states={schedule.jumuahStates}
                    />
                  ) : (
                    <Check masjid={masjid} />
                  )}
                </p>
              )}
              {now && set && needsDateMarker(set.checked, now.date) && (
                <p className="text-xs text-attention">
                  Checked {formatDate(set.checked)}
                </p>
              )}
              {open && (
                <div
                  id={`detail-mobile-${masjid.id}`}
                  className="rounded-lg bg-detail p-3"
                >
                  <RowDetail {...row} view={view} />
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <Table
        className="text-xs"
        containerProps={{
          role: "region",
          "aria-label": `${caption} table`,
          tabIndex: 0,
          className:
            "hidden rounded-xl border bg-card [container-type:inline-size] @min-[42rem]/directory:block",
        }}
      >
        <TableCaption className="sr-only">{caption}</TableCaption>
        <TableHeader className="bg-muted">
          <TableRow className="border-row hover:bg-muted">
            <TableHead
              scope="col"
              className={cn(
                sticky,
                "h-10 bg-muted pr-1 pl-3 font-semibold sm:h-11 sm:pl-5",
              )}
            >
              Masjid
            </TableHead>
            {columns.map((name) => (
              <TableHead
                key={name}
                scope="col"
                className={cn(
                  "h-10 px-1 text-center font-semibold sm:h-11",
                  view === "daily" && "w-12 sm:w-[12%]",
                )}
              >
                {name}
              </TableHead>
            ))}
            <TableHead scope="col" className="pr-3 text-right">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => {
            const { masjid } = row;
            const open = openId === masjid.id;
            const set = shownSet(row, view);
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
                      className="group/row flex min-h-12 w-full min-w-22 cursor-pointer items-center gap-1 py-1.5 pr-2 pl-2 text-left text-xs font-semibold hover:bg-muted aria-expanded:bg-muted sm:min-h-14 sm:gap-2 sm:pl-4 sm:text-sm -outline-offset-3!"
                      aria-expanded={open}
                      aria-controls={open ? `detail-${masjid.id}` : undefined}
                      onClick={() => onToggle(masjid.id)}
                      data-key={`row-${masjid.id}`}
                    >
                      <ChevronDownIcon
                        aria-hidden="true"
                        className="size-4 shrink-0 group-aria-expanded/row:rotate-180"
                      />
                      <MasjidMark masjid={masjid} />
                      <span>
                        {masjid.name}
                        {masjid.area && (
                          <span className="block font-normal text-muted-foreground">
                            {masjid.area}
                          </span>
                        )}
                        {now &&
                          set &&
                          needsDateMarker(set.checked, now.date) && (
                            <span className="block font-normal text-attention">
                              Checked {formatDate(set.checked)}
                            </span>
                          )}
                      </span>
                    </button>
                  </TableHead>
                  <Cells {...row} view={view} />
                  <TableCell className="pr-3 text-right">
                    <div className="flex justify-end">
                      <Directions masjid={masjid} />
                      <PinButton
                        masjid={masjid}
                        pinned={pinned}
                        onPin={() => onPin(masjid.id)}
                        compact
                      />
                    </div>
                  </TableCell>
                </TableRow>
                {open && (
                  <TableRow
                    id={`detail-${masjid.id}`}
                    className="border-row hover:bg-transparent"
                  >
                    <TableCell
                      colSpan={columns.length + 2}
                      className="bg-detail p-0 whitespace-normal"
                    >
                      <div className="sticky left-0 w-[100cqw] p-5">
                        <RowDetail {...row} view={view} />
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
