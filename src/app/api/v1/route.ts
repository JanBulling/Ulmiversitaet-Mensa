import { NextRequest } from "next/server";
import { getMenuForDate } from "@/lib/db-integration/get-for-date";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const dateQuery = searchParams.get("date");

  const date = dateQuery ? new Date(dateQuery) : new Date();

  const categories = await getMenuForDate(date);

  return Response.json({
    date: date.toISOString().split("T")[0],
    meal_plan: categories,
  });
}
