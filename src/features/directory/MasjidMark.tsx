import { MosqueIcon } from "lucide-react";
import type { Masjid } from "@/lib/masjid-schema";

export function MasjidMark({ masjid }: { masjid: Masjid }) {
  if (!masjid.logo) {
    return (
      <span
        aria-hidden="true"
        className="grid size-11 shrink-0 place-items-center rounded-sm bg-muted text-muted-foreground"
      >
        <MosqueIcon className="size-6" />
      </span>
    );
  }

  return (
    <img
      src={`/masjid-logos/${masjid.logo}.png`}
      alt=""
      width={44}
      height={44}
      className="size-11 shrink-0 rounded-sm bg-logo-tile object-contain brightness-(--logo-brightness)"
    />
  );
}
