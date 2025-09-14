import { NextRequest } from "next/server";

import { env } from "@/env.mjs";

import { geminiResponse } from "@/lib/gemini";
import { GURU_SYSTEM_PROMPT, menuToGuruFormat } from "@/lib/guru";
import { getMenuForDate } from "@/lib/db-integration/get-for-date";
import { dateToString } from "@/lib/utils";

const corsHeaders = [
  "https://xn--ulmiversitt-u8a.de",
  "https://www.xn--ulmiversitt-u8a.de",
  "https://dev.xn--ulmiversitt-u8a.de",
  "https://ulmiversitaet.de",
  "https://www.ulmiversitaet.de",
  "https://dev.ulmiversitaet.de",
  "http://localhost:3000",
];

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");

    if (authHeader !== `Bearer ${env.GURU_SECRET}`)
      return new Response("Unauthorized", { status: 401 });

    const menuToday = await getMenuForDate(dateToString(new Date()));
    const guruContent = menuToGuruFormat(menuToday);

    const guruAnswer = await geminiResponse(guruContent, GURU_SYSTEM_PROMPT);

    if (!guruAnswer) return new Response("Unknown Guru error", { status: 500 });

    return Response.json(
      { message: guruAnswer },
      {
        headers: {
          "Access-Control-Allow-Origin": corsHeaders.join(", "),
          "Content-Type": "application/json",
        },
      },
    );
  } catch (err) {
    console.error("[CRON/WEEKLY - GET]", "Unexpected server error", err);
    return new Response("Unexpected server error", { status: 500 });
  }
}
