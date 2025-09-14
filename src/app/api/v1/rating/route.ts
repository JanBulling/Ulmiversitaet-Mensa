import { eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import z from "zod";

import { db } from "@/lib/db/db";
import { mealsTable, ratingsTable } from "@/lib/db/schema";
import { getTotalRating } from "@/lib/utils";

const schema = z.object({
  id: z.string(),
  rating_price: z.number().min(1).max(5),
  rating_taste: z.number().min(1).max(5),
  rating_look: z.number().min(1).max(5),
  comment: z.string().max(1000).optional().nullable(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const body = schema.safeParse(json);
    if (!body.success)
      return new Response("Rating data is wrongly formatted", { status: 400 });

    const ratingData = body.data;
    const totalRating = getTotalRating(
      ratingData.rating_taste,
      ratingData.rating_look,
      ratingData.rating_price,
    );

    const correspondingMeal = await db
      .select({
        slug: mealsTable.slug,
        numRatings: mealsTable.num_ratings,
        ratingTaste: mealsTable.rating_taste,
        ratingLook: mealsTable.rating_look,
        ratingPrice: mealsTable.rating_price,
        ratingTotal: mealsTable.rating_total,
      })
      .from(mealsTable)
      .where(eq(mealsTable.id, ratingData.id));

    if (correspondingMeal.length !== 1)
      return new Response("Unknown meal-id", { status: 400 });

    const meal = correspondingMeal[0];
    const N = meal.numRatings ?? 0;

    await db.insert(ratingsTable).values({
      text: ratingData.comment ?? null,
      meal_id: ratingData.id,
      rating_taste: ratingData.rating_taste,
      rating_price: ratingData.rating_price,
      rating_look: ratingData.rating_look,
      rating_total: totalRating,
    });

    await db
      .update(mealsTable)
      .set({
        num_ratings: N + 1,
        rating_taste:
          ((meal.ratingTaste ?? 0) * N + ratingData.rating_taste) / (N + 1),
        rating_look:
          ((meal.ratingLook ?? 0) * N + ratingData.rating_look) / (N + 1),
        rating_price:
          ((meal.ratingPrice ?? 0) * N + ratingData.rating_price) / (N + 1),
        rating_total: ((meal.ratingTotal ?? 0) * N + totalRating) / (N + 1),
      })
      .where(eq(mealsTable.id, ratingData.id));

    revalidateTag("mensa-menu");
    revalidatePath(`/meal/${meal.slug}`);

    return new Response("Success", { status: 200 });
  } catch (err) {
    console.error("[V1/RATING - POST]", "Unexpected server error", err);
    return new Response("Unexpected server error", { status: 500 });
  }
}
