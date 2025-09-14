import { NextRequest } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

import { env } from "@/env.mjs";

import { saveMealsToDb } from "@/lib/db-integration/save-to-db";
import { parseMensaHTML } from "@/lib/scraper/studienwerk-parser";
import { getMensaHTML } from "@/lib/scraper/studienwerk-scarper";
import { generateSlug, getStartOfWeek } from "@/lib/utils";

/**
 * Runs every Monday at 5:00 AM (CRON: 0 5 * * 1)
 *
 * Fetches the weekly meal plan from the mensa website FOR THE NEXT WEEK and saves it to the database.
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    // calculate the date of monday one week ahead
    const today = new Date();
    today.setDate(today.getDate() + 7);
    const nextMonday = getStartOfWeek(today);

    try {
      for (let i = 0; i < 5; i++) {
        const mealDate = new Date(nextMonday);
        mealDate.setDate(nextMonday.getDate() + i);
        const mensaHTML = await getMensaHTML({ date: mealDate, lang: "de" });
        const mealPlan = parseMensaHTML(mensaHTML);

        mealPlan.forEach((meal) =>
          revalidatePath(`/meal/${generateSlug(meal.name)}`),
        );

        await saveMealsToDb(mealPlan, mealDate);
      }
      revalidateTag("mensa-menu");

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
