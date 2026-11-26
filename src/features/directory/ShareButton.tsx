import { CheckIcon, Share2Icon } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/data/site";

/** The link's preview card comes from the Open Graph tags in SeoHead. */
const SHARED = {
  title: SITE.name,
  text: SITE.description,
  url: SITE.url,
};

/** The phone's share sheet where there is one, otherwise a copied link. */
export function ShareButton() {
  const [status, setStatus] = useState<"copied" | "failed" | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  async function share() {
    clearTimeout(timer.current);
    setStatus(null);
    if (typeof navigator.share === "function") {
      try {
        return await navigator.share(SHARED);
      } catch (error) {
        // Closing the share sheet is a choice, not a failure.
        if ((error as Error).name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(SHARED.url);
      setStatus("copied");
      timer.current = setTimeout(() => setStatus(null), 4_000);
    } catch {
      // Stays on screen so the link can be copied by hand.
      setStatus("failed");
    }
  }

  return (
    <div className="flex flex-col items-start gap-2 py-2">
      <Button
        variant="outline"
        size="touch"
        className="w-full border-input bg-card font-semibold sm:w-fit"
        onClick={() => void share()}
      >
        {status === "copied" ? (
          <CheckIcon aria-hidden="true" />
        ) : (
          <Share2Icon aria-hidden="true" />
        )}
        Share this page
      </Button>
      <p role="status" className="text-sm break-all">
        {status === "copied" && "Link copied"}
        {status === "failed" && `Could not copy. The link is ${SHARED.url}`}
      </p>
    </div>
  );
}
