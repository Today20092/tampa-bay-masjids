import { useRef, useState } from "react";
import type { Point } from "@/lib/distance";

const BLOCKED =
  "Location is blocked. Allow it for this site in your browser, then tap Nearest again.";
const NOT_FOUND = "Your location could not be found. Tap Nearest to try again.";

type State =
  | { step: "off" }
  | { step: "finding" }
  | { step: "failed"; message: string }
  | { step: "on"; here: Point };

/** The visitor's location, asked for only on a tap and kept only on this page. */
export function useNearest() {
  const [state, setState] = useState<State>({ step: "off" });
  // A newer tap makes an older answer irrelevant.
  const request = useRef(0);

  function toggle() {
    const current = ++request.current;
    // Tapping while finding cancels: a dismissed prompt may never answer.
    if (state.step === "on" || state.step === "finding")
      return setState({ step: "off" });
    if (!("geolocation" in navigator))
      return setState({ step: "failed", message: NOT_FOUND });
    setState({ step: "finding" });
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        if (current !== request.current) return;
        setState({
          step: "on",
          here: { lat: coords.latitude, lng: coords.longitude },
        });
      },
      (error) => {
        if (current !== request.current) return;
        const denied = error.code === error.PERMISSION_DENIED;
        setState({ step: "failed", message: denied ? BLOCKED : NOT_FOUND });
      },
      { timeout: 10_000, maximumAge: 60_000 },
    );
  }

  const message = {
    off: "",
    finding: "Finding your location… Tap Nearest to cancel.",
    failed: state.step === "failed" ? state.message : "",
    on: "Nearest first, in straight-line miles. Your location is not saved or sent.",
  }[state.step];

  return {
    toggle,
    message,
    on: state.step === "on",
    here: state.step === "on" ? state.here : null,
  };
}
