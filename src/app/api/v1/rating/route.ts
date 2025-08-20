import { db } from "@/lib/db/db";
import { mealsTable, ratingsTable } from "@/lib/db/schema";
import { getTotalRating } from "@/lib/utils";
import { eq } from "drizzle-orm";
import z from "zod";

const schema = z.object({
  id: z.string(),
  rating_price: z.number().min(1).max(5),
  rating_taste: z.number().min(1).max(5),
  rating_look: z.number().min(1).max(5),
  comment: z.string().max(1000).optional().nullable(),
});

export async function POST(request: Request) {
  const json = await request.json();
  const body = schema.safeParse(json);
  if (!body.success)
    return Response.json(
      { success: false, message: "Rating data incomplete" },
      { status: 503 },
    );

  const ratingData = body.data;

  const mealResponse = await db
    .select()
    .from(mealsTable)
    .where(eq(mealsTable.id, ratingData.id));

  if (mealResponse.length !== 1)
    return Response.json(
      { success: false, message: "Invalid meal-id" },
      { status: 503 },
    );

  const meal = mealResponse[0];

  const totalRating = getTotalRating(
    ratingData.rating_taste,
    ratingData.rating_look,
    ratingData.rating_price,
  );

  try {
    await db.insert(ratingsTable).values({
      text: ratingData.comment ?? null,
      meal_id: ratingData.id,
      rating_taste: ratingData.rating_taste,
      rating_price: ratingData.rating_price,
      rating_look: ratingData.rating_look,
      rating_total: totalRating,
    });

    const ratingCount = meal.num_ratings ?? 0;

    await db
      .update(mealsTable)
      .set({
        num_ratings: ratingCount + 1,
        rating_taste:
          ((meal.rating_taste ?? 0) * ratingCount + ratingData.rating_taste) /
          (ratingCount + 1),
        rating_look:
          ((meal.rating_look ?? 0) * ratingCount + ratingData.rating_look) /
          (ratingCount + 1),
        rating_price:
          ((meal.rating_price ?? 0) * ratingCount + ratingData.rating_price) /
          (ratingCount + 1),
        rating_total:
          ((meal.rating_total ?? 0) * ratingCount + totalRating) /
          (ratingCount + 1),
      })
      .where(eq(mealsTable.id, ratingData.id));
  } catch (err) {
    Response.json(
      {
        success: false,
        message: "Something went wrong while updating the rating",
      },
      { status: 500 },
    );
  }

  return Response.json({ success: true });
}
