import type { APIRoute } from "astro";
import { getMasjids } from "@/lib/masjids";
import { llmsText } from "@/lib/public-data";

export const GET: APIRoute = async () =>
  new Response(llmsText(await getMasjids()), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
