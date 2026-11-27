import {
  GlobeIcon,
  NavigationIcon,
  MessageCircleIcon,
  PinIcon,
  PinOffIcon,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { directionsUrl, reportUrl } from "@/lib/links";
import type { Masjid } from "@/lib/masjid-schema";
import type { Schedule } from "@/lib/schedule";
import { formatDate } from "@/lib/time";
import { cn } from "@/lib/utils";
import { Check, JumuahTimes } from "./Times";

const textLink = "inline-flex min-h-11 items-center font-semibold text-primary";

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
        compact && "px-1",
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
  return (
    <p className="text-sm">
      Jumu‘ah{masjid.jumuahOnly && " only"}{" "}
      {schedule.jumuah ? (
        <JumuahTimes {...schedule.jumuah} states={schedule.jumuahStates} />
      ) : (
        <Check masjid={masjid} />
      )}
    </p>
  );
}

function Sources({ schedule }: { schedule: Schedule }) {
  const { iqama, jumuah } = schedule;
  const sets = [
    ...(iqama ? [{ label: "Daily source", ...iqama }] : []),
    ...(jumuah ? [{ label: "Jumu‘ah source", ...jumuah }] : []),
  ];
  if (!sets.length) return null;
  const same =
    sets.length === 2 &&
    sets[0].checked === sets[1].checked &&
    sets[0].source.label === sets[1].source.label &&
    sets[0].source.url === sets[1].source.url;
  const shown = same || sets.length === 1 ? [sets[0]] : sets;
  return (
    <div className="text-xs text-muted-foreground">
      {shown.map(({ label, source, checked }) => (
        <p key={label}>
          {shown.length > 1 ? label : "Source"}:{" "}
          {source.url ? (
            <a
              className={cn(textLink, "underline")}
              href={source.url}
              target="_blank"
              rel="noopener"
            >
              {source.label}
            </a>
          ) : (
            source.label
          )}{" "}
          · checked {formatDate(checked)}
        </p>
      ))}
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

function Actions({ masjid }: { masjid: Masjid }) {
  const external = [
    { label: "WhatsApp", href: masjid.whatsapp?.url, Icon: MessageCircleIcon },
    { label: "Website", href: masjid.website, Icon: GlobeIcon },
  ];
  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {external.map(
          ({ label, href, Icon }) =>
            href && (
              <a
                key={label}
                className={cn(
                  buttonVariants({ variant: "outline", size: "touch" }),
                  "min-w-fit flex-[1_1_3.5rem] border-input bg-card font-semibold",
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
            ),
        )}
      </div>
      <a className={cn(textLink, "underline")} href={reportUrl(masjid)}>
        Report a wrong time
        <span className="sr-only"> for {masjid.name}</span>
      </a>
    </div>
  );
}

/** What follows a masjid's times: source, checked date and actions. */
export function SourceAndActions({
  schedule,
  masjid,
}: {
  masjid: Masjid;
  schedule: Schedule;
}) {
  return (
    <>
      <Sources schedule={schedule} />
      <Actions masjid={masjid} />
    </>
  );
}
