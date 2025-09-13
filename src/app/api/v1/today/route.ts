import { getMenuForDate } from "@/lib/db-integration/get-for-date";

export const revalidate = 86400;

export async function GET() {
  const today = new Date();

  const categories = await getMenuForDate(today);

  return Response.json({
    date: today.toISOString().split("T")[0],
    meal_plan: categories,
  });
}
