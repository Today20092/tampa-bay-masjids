import {
  GlobeIcon,
  NavigationIcon,
  MessageCircleIcon,
  PinIcon,
  PinOffIcon,
} from "lucide-react";
import { Fragment } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { SITE } from "@/data/site";
import { formatMiles } from "@/lib/distance";
import { directionsUrl, masjidUrl, reportUrl } from "@/lib/links";
import type { Masjid } from "@/lib/masjid-schema";
import type { Schedule } from "@/lib/schedule";
import { shownFor, type View } from "@/lib/shown";
import { formatDate } from "@/lib/time";
import { cn } from "@/lib/utils";
import { ShareButton } from "./ShareButton";
import { Check, DailyGrid, JumuahTimes } from "./Times";

const KIND = { khutbah: "khutbah", start: "starts", iqama: "iqama" };

/** A card's square action: the icon shows, the label stays for screen readers. */
const ICON_ONLY = "size-11 px-0";

/** Goes where the shown times are prayed: the Jumu‘ah venue when its times are the ones shown. */
export function Directions({
  masjid,
  schedule,
  view,
  prominent = false,
  iconOnly = false,
}: {
  masjid: Masjid;
  schedule: Schedule;
  view: View;
  prominent?: boolean;
  iconOnly?: boolean;
}) {
  const venue =
    shownFor(masjid, schedule, view).times === "jumuah"
      ? schedule.jumuah?.venue
      : undefined;
  return (
    <a
      className={cn(
        buttonVariants({
          variant: prominent ? "default" : iconOnly ? "outline" : "ghost",
          size: "touch",
        }),
        iconOnly
          ? [ICON_ONLY, !prominent && "text-primary"]
          : [
              "w-fit rounded-full",
              !prominent && "font-normal text-muted-foreground",
            ],
      )}
      href={directionsUrl(venue ?? masjid)}
      target="_blank"
      rel="noopener"
    >
      <NavigationIcon aria-hidden="true" className={cn(iconOnly && "size-5")} />
      <span className={cn(iconOnly && "sr-only")}>
        Directions
        <span className="sr-only"> to {venue?.name ?? masjid.name}</span>
      </span>
    </a>
  );
}

/**
 * The line under a masjid's name: its area, and its distance when sorted by it.
 * It stays one line, so sorting does not change a row's height: the area is cut
 * short (until `areaClassName` lets it wrap), never the distance.
 */
export function PlaceLine({
  masjid,
  schedule,
  miles,
  view,
  className,
  areaClassName,
}: {
  masjid: Masjid;
  schedule: Schedule;
  miles?: number;
  view: View;
  className?: string;
  areaClassName?: string;
}) {
  if (!masjid.area && miles === undefined) return null;
  // Distance is to the masjid's map point, which is not where an off-site Jumu‘ah meets.
  const to = view === "jumuah" && schedule.jumuah?.venue ? " to masjid" : "";
  return (
    <span
      className={cn(
        "flex max-w-full text-xs font-normal text-muted-foreground",
        className,
      )}
    >
      {masjid.area && (
        <span className={cn("truncate", areaClassName)}>{masjid.area}</span>
      )}
      {miles !== undefined && (
        <span className="shrink-0 whitespace-pre">
          {masjid.area && " · "}
          {formatMiles(miles) + to}
        </span>
      )}
    </span>
  );
}

export function ArabicName({ masjid }: { masjid: Masjid }) {
  return masjid.arabicName ? (
    <span lang="ar" dir="rtl" className="text-base text-primary">
      {masjid.arabicName}
    </span>
  ) : null;
}

/** Jumu‘ah times, or the notice that they exist but are no longer confirmed. */
export function JumuahLine({
  masjid,
  schedule,
}: {
  masjid: Masjid;
  schedule: Schedule;
}) {
  if (!schedule.jumuah && !masjid.jumuah) return null;
  const timeIs = schedule.jumuah?.timeIs;
  return (
    <p className="text-sm">
      {masjid.jumuahOnly
        ? "Jumu‘ah only · "
        : `Jumu‘ah ${timeIs ? `${KIND[timeIs]} ` : ""}`}
      {schedule.jumuah ? (
        <JumuahTimes
          {...schedule.jumuah}
          states={schedule.jumuahStates}
          // The label above already says what the times are.
          caption={masjid.jumuahOnly}
        />
      ) : (
        <Check masjid={masjid} />
      )}
    </p>
  );
}

/** The other schedule a row or card shows beside its times, in the view it is not showing. */
export function OtherSchedule({
  masjid,
  schedule,
  view,
  pinned = false,
}: {
  masjid: Masjid;
  schedule: Schedule;
  view: View;
  pinned?: boolean;
}) {
  if (view === "jumuah" && schedule.iqama)
    return <DailyGrid daily={schedule.daily} pinned={pinned} />;
  if (view === "daily" && !masjid.jumuahOnly)
    return <JumuahLine masjid={masjid} schedule={schedule} />;
  return null;
}

/** Where the shown times came from, when they were checked, and how to dispute them. */
function TimesFootnote({
  masjid,
  schedule,
}: {
  masjid: Masjid;
  schedule: Schedule;
}) {
  const { iqama, jumuah } = schedule;
  const sets = [
    ...(iqama ? [{ name: "daily", ...iqama }] : []),
    ...(jumuah ? [{ name: "Jumu‘ah", ...jumuah }] : []),
  ];
  if (!sets.length) return null;
  const [first, second] = sets;
  const sameDate = !second || first.checked === second.checked;
  const single =
    !second ||
    (sameDate &&
      first.source.label === second.source.label &&
      first.source.url === second.source.url);
  // Inline padding widens the tap area without breaking the line apart.
  const link = (url: string, children: React.ReactNode) => (
    <a
      className="py-1.5 font-semibold text-primary underline"
      href={url}
      target="_blank"
      rel="noopener"
    >
      {children}
    </a>
  );
  return (
    <div className="text-xs text-muted-foreground">
      <p>
        {sameDate && `Checked ${formatDate(first.checked)} · `}
        {single ? "Source: " : "Sources: "}
        {single
          ? first.source.url
            ? link(first.source.url, first.source.label)
            : first.source.label
          : sets.map(({ name, source, checked }, k) => (
              <Fragment key={name}>
                {k > 0 && ", "}
                {source.url
                  ? link(
                      source.url,
                      <>
                        {name}
                        <span className="sr-only">: {source.label}</span>
                      </>,
                    )
                  : `${name} from ${source.label}`}
                {!sameDate && ` checked ${formatDate(checked)}`}
              </Fragment>
            ))}
      </p>
      <a
        className="inline-flex min-h-11 items-center text-sm font-semibold text-primary underline"
        href={reportUrl(masjid)}
      >
        Report a wrong time
        <span className="sr-only"> for {masjid.name}</span>
      </a>
    </div>
  );
}

export function PinButton({
  masjid,
  pinned,
  onPin,
  compact = false,
  iconOnly = false,
  focusKey = `pin-${masjid.id}`,
}: {
  masjid: Masjid;
  pinned: boolean;
  onPin: () => void;
  compact?: boolean;
  iconOnly?: boolean;
  focusKey?: string;
}) {
  const label = pinned ? "Unpin" : "Pin";
  const Icon = pinned ? PinOffIcon : PinIcon;
  return (
    <Button
      type="button"
      variant={iconOnly ? "outline" : "ghost"}
      size="touch"
      className={cn(
        iconOnly
          ? [ICON_ONLY, "text-primary"]
          : "rounded-full font-normal text-muted-foreground",
        compact && "px-0",
      )}
      onClick={onPin}
      data-key={focusKey}
    >
      <Icon aria-hidden="true" className={cn(iconOnly && "size-5")} />
      <span className={cn(iconOnly && "sr-only")}>
        {label}
        <span className="sr-only"> {masjid.name}</span>
      </span>
    </Button>
  );
}

/** The masjid's own links, then a link to share it. */
function ExternalLinks({ masjid }: { masjid: Masjid }) {
  const external = [
    { label: "WhatsApp", href: masjid.whatsapp?.url, Icon: MessageCircleIcon },
    { label: "Website", href: masjid.website, Icon: GlobeIcon },
  ].filter((link) => link.href);
  return (
    <div className="flex flex-wrap items-start gap-1.5">
      {external.map(({ label, href, Icon }) => (
        <a
          key={label}
          className={cn(
            buttonVariants({ variant: "outline", size: "touch" }),
            "font-semibold",
          )}
          href={href}
          target="_blank"
          rel="noopener"
        >
          <Icon aria-hidden="true" />
          <span>
            {label}
            <span className="sr-only"> for {masjid.name}</span>
          </span>
        </a>
      ))}
      <ShareButton
        shared={{
          title: `${masjid.name} · ${SITE.name}`,
          text: `${masjid.name} prayer times and directions`,
          url: masjidUrl(masjid),
        }}
      >
        <span>
          Share<span className="sr-only"> {masjid.name}</span>
        </span>
      </ShareButton>
    </div>
  );
}

/** What follows a masjid's times and address: its own links, then the footnote. */
export function SourceAndActions({
  schedule,
  masjid,
}: {
  masjid: Masjid;
  schedule: Schedule;
}) {
  return (
    <>
      <ExternalLinks masjid={masjid} />
      <TimesFootnote masjid={masjid} schedule={schedule} />
    </>
  );
}
