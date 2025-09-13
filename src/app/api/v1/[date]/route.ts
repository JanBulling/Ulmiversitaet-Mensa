import { NextRequest } from "next/server";
import { getMenuForDate } from "@/lib/db-integration/get-for-date";

export const revalidate = 86400;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ date: string }> },
) {
  const { date } = await params;

  const selectedDate = new Date(date);

  if (isNaN(selectedDate.getTime())) {
    console.error("[V1 - GET]", `${date} is not a valid date`);
    return Response.json({ status: 400, message: "Invalid date given" });
  }

  console.info("[V1 - GET]", "Fetching data for", date);

  const categories = await getMenuForDate(selectedDate);

  return Response.json({
    date: selectedDate.toISOString().split("T")[0],
    meal_plan: categories,
  });
}
