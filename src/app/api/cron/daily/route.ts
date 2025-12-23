import { NextRequest } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

import { env } from "@/env.mjs";

import { saveMealsToDb } from "@/lib/db-integration/save-to-db";
import { parseMensa } from "@/lib/scraper/studienwerk-parser";
import { getMensaHTML } from "@/lib/scraper/studienwerk-scarper";
import { generateSlug } from "@/lib/utils";

/**
 * Runs every Day at 6:00 AM (CRON: 0 6 * * 1)
 *
 * Fetches the current meal plan from the mensa website FOR THE CURRENT DAY and saves it to the database.
 * This is done, because the mensa often just changes the meals randomly
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    const today = new Date();

    try {
      const mensaHTML = await getMensaHTML({ date: today, lang: "de" });
      const mensaHTMLEn = await getMensaHTML({ date: today, lang: "en" });

      const mealPlan = parseMensa(mensaHTML, { en: mensaHTMLEn });

      mealPlan.forEach((meal) =>
        revalidatePath(`/meal/${generateSlug(meal.name)}`),
      );

      await saveMealsToDb(mealPlan, today);

      console.info("[CRON/DAILY - GET]", "Revalidating data");
      revalidateTag("mensa-menu", "max");

      return new Response("Success", { status: 200 });
    } catch (err) {
      console.error(
        "[CRON/DAILY - GET]",
        "Error while fetching or saving daily meal plan",
        err,
      );
      return new Response("Failed to fetch daily meal plan", { status: 500 });
    }
  } catch (err) {
    console.error("[CRON/DAILY - GET]", "Unexpected server error", err);
    return new Response("Unexpected server error", { status: 500 });
  }
}
