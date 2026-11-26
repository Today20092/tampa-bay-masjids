import type { APIRoute } from "astro";
import { getMasjids } from "@/lib/masjids";
import { publicData } from "@/lib/public-data";

export const GET: APIRoute = async () =>
  Response.json(publicData(await getMasjids()));
