import { NextRequest } from "next/server";
import { getPlanForDate } from "@/lib/db-integration/get-for-date";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const dateQuery = searchParams.get("date");

  const date = dateQuery ? new Date(dateQuery) : new Date();

  const categories = await getPlanForDate(date);

  return Response.json({
    date: date.toISOString().split("T")[0],
    meal_plan: categories,
  });
}
