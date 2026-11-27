import {
  GlobeIcon,
  NavigationIcon,
  MessageCircleIcon,
  PinIcon,
  PinOffIcon,
} from "lucide-react";
import { Fragment } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { directionsUrl, reportUrl } from "@/lib/links";
import type { Masjid } from "@/lib/masjid-schema";
import type { Schedule } from "@/lib/schedule";
import type { View } from "@/lib/shown";
import { formatDate } from "@/lib/time";
import { cn } from "@/lib/utils";
import { Check, DailyGrid, JumuahTimes } from "./Times";

const KIND = { khutbah: "khutbah", start: "starts", iqama: "iqama" };

export function Directions({
  masjid,
  prominent = false,
  compact = false,
}: {
  masjid: Masjid;
  prominent?: boolean;
  compact?: boolean;
}) {
  return (
    <a
      className={cn(
        buttonVariants({
          variant: prominent ? "default" : "ghost",
          size: "touch",
        }),
        "w-fit rounded-full",
        !prominent && "text-primary",
        // Wider on the right so the Pin icon does not read as part of Directions.
        compact && "pr-2 pl-1",
      )}
      href={directionsUrl(masjid)}
      target="_blank"
      rel="noopener"
    >
      <NavigationIcon aria-hidden="true" />
      <span>
        Directions
        <span className="sr-only"> to {masjid.name}</span>
      </span>
    </a>
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
  focusKey = `pin-${masjid.id}`,
}: {
  masjid: Masjid;
  pinned: boolean;
  onPin: () => void;
  compact?: boolean;
  focusKey?: string;
}) {
  const label = pinned ? "Unpin" : "Pin";
  const Icon = pinned ? PinOffIcon : PinIcon;
  return (
    <Button
      type="button"
      variant="ghost"
      size="touch"
      className={cn("rounded-full text-primary", compact && "px-0")}
      onClick={onPin}
      data-key={focusKey}
    >
      <Icon aria-hidden="true" />
      <span>
        {label}
        <span className="sr-only"> {masjid.name}</span>
      </span>
    </Button>
  );
}

function ExternalLinks({ masjid }: { masjid: Masjid }) {
  const external = [
    { label: "WhatsApp", href: masjid.whatsapp?.url, Icon: MessageCircleIcon },
    { label: "Website", href: masjid.website, Icon: GlobeIcon },
  ].filter((link) => link.href);
  if (!external.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {external.map(({ label, href, Icon }) => (
        <a
          key={label}
          className={cn(
            buttonVariants({ variant: "outline", size: "touch" }),
            "border-input bg-card font-semibold",
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
