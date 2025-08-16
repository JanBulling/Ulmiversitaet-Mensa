import { NextRequest } from "next/server";

import { env } from "@/env.mjs";

import { saveMealsToDb } from "@/lib/db-integration/save-to-db";
import { parseMensaHTML } from "@/lib/scraper/studienwerk-parser";
import { getMensaHTML } from "@/lib/scraper/studienwerk-scarper";

/**
 * Runs every Monday at 5:00 AM (CRON: 0 5 * * 1)
 *
 * Fetches the weekly meal plan from the mensa website FOR THE NEXT WEEK and saves it to the database.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const today = new Date();
  const nextMonday = new Date(today);
  nextMonday.setDate(today.getDate() + ((1 + 7 - today.getDay()) % 7));
  nextMonday.setHours(8, 0, 0, 0);

  // DEVELOPER ONLY: INSERT THIS WEEK AS WELL
  // nextMonday.setDate(nextMonday.getDate() - 7);

  // Fetch the HTML for the next week's meal plan
  try {
    for (let i = 0; i < 5; i++) {
      const mealDate = new Date(nextMonday);
      mealDate.setDate(nextMonday.getDate() + i);

      const mensaHTML = await getMensaHTML({ date: mealDate });
      const mealPlan = parseMensaHTML(mensaHTML);

      // Save the meals to the database
      await saveMealsToDb(mealPlan, mealDate);
    }

    return Response.json({
      success: true,
      message: "Weekly meal plan saved successfully.",
    });
  } catch (error) {
    console.error("Error fetching or saving weekly meal plan:", error);
    return Response.json(
      {
        success: false,
        message: "Failed to save weekly meal plan. See console for details.",
      },
      { status: 500 },
    );
  }
}
