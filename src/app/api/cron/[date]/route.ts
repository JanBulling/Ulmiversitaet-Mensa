import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";

import { env } from "@/env.mjs";

import { saveMealsToDb } from "@/lib/db-integration/save-to-db";
import { parseMensaHTML } from "@/lib/scraper/studienwerk-parser";
import { getMensaHTML } from "@/lib/scraper/studienwerk-scarper";
import { dateToString, generateSlug, parseDateFromString } from "@/lib/utils";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ date: string }> },
) {
  try {
    const authHeader = req.headers.get("authorization");

    // if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    //   return new Response("Unauthorized", {
    //     status: 401,
    //   });
    // }

    const { date } = await params;
    const selectedDate = parseDateFromString(date);
    if (!selectedDate) {
      console.error("[V1/[date] - GET]", `${date} is not a valid date`);
      return new Response("Invalid date", { status: 500 });
    }

    try {
      const mensaHTML = await getMensaHTML({ date: selectedDate, lang: "de" });
      const mealPlan = parseMensaHTML(mensaHTML);
      await saveMealsToDb(mealPlan, selectedDate);

      // revalidate cache for the selected day and for all meals for that day
      revalidatePath(`/api/v1/${dateToString(selectedDate)}`);
      mealPlan.forEach((meal) =>
        revalidatePath(`/meal/${generateSlug(meal.name)}`),
      );

      return new Response("Success", { status: 200 });
    } catch (err) {
      console.error(
        "[CRON/WEEKLY - GET]",
        "Error while fetching or saving weekly meal plan",
        err,
      );
      return new Response("Failed to fetch weekly meal plan", { status: 500 });
    }
  } catch (err) {
    console.error("[CRON/WEEKLY - GET]", "Unexpected server error", err);
    return new Response("Unexpected server error", { status: 500 });
  }
}
