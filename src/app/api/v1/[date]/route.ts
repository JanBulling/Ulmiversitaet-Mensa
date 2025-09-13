import { NextRequest } from "next/server";

import { getMenuForDate } from "@/lib/db-integration/get-for-date";
import { dateToString, parseDateFromString } from "@/lib/utils";

export const revalidate = 86400;
export const dynamic = "force-static";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ date: string }> },
) {
  try {
    const { date } = await params;
    const selectedDate = parseDateFromString(date);
    if (!selectedDate) {
      console.error("[V1/[date] - GET]", `${date} is not a valid date`);
      return new Response("Invalid date", { status: 500 });
    }

    const dateString = dateToString(selectedDate);
    const categories = await getMenuForDate(selectedDate);

    return Response.json({
      date: dateString,
      mensaMenu: categories,
    });
  } catch (err) {
    console.error("[V1/[date] - GET]", "Unexpected server error", err);
    return new Response("Unexpected server error", { status: 500 });
  }
}
