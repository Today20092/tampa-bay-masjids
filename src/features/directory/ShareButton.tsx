import { CheckIcon, Share2Icon } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/data/site";
import { cn } from "@/lib/utils";

/** The link's preview card comes from the Open Graph tags in SeoHead. */
const PAGE = {
  title: SITE.name,
  text: SITE.description,
  url: SITE.url,
};

/** The phone's share sheet where there is one, otherwise a copied link. */
export function ShareButton({
  shared = PAGE,
  className,
  children = "Share this page",
}: {
  shared?: typeof PAGE | { title: string; text: string; url: string };
  className?: string;
  children?: ReactNode;
}) {
  const [status, setStatus] = useState<"copied" | "failed" | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  async function share() {
    clearTimeout(timer.current);
    setStatus(null);
    if (typeof navigator.share === "function") {
      try {
        return await navigator.share(shared);
      } catch (error) {
        // Closing the share sheet is a choice, not a failure.
        if ((error as Error).name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(shared.url);
      setStatus("copied");
      timer.current = setTimeout(() => setStatus(null), 4_000);
    } catch {
      // Stays on screen so the link can be copied by hand.
      setStatus("failed");
    }
  }

  return (
    <div className="flex flex-col items-start">
      <Button
        variant="outline"
        size="touch"
        className={cn("font-semibold", className)}
        onClick={() => void share()}
      >
        {status === "copied" ? (
          <CheckIcon aria-hidden="true" />
        ) : (
          <Share2Icon aria-hidden="true" />
        )}
        {children}
      </Button>
      <p role="status" className="text-sm break-all not-empty:pt-2">
        {status === "copied" && "Link copied"}
        {status === "failed" && `Could not copy. The link is ${shared.url}`}
      </p>
    </div>
  );
}
