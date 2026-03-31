import { and, desc, isNotNull, gte, inArray, asc } from "drizzle-orm";
import { db } from "./db/db";
import { mealsTable } from "./db/schema";
import { mainDishCategories } from "@/types/category";

export async function getTop10Meals() {
  const topMeals = await db
    .select()
    .from(mealsTable)
    .where(
      and(
        isNotNull(mealsTable.rating_total),
        gte(mealsTable.num_ratings, 2),
        inArray(mealsTable.category, mainDishCategories),
      ),
    )
    .orderBy(desc(mealsTable.rating_total))
    .limit(20);

  // Bayesian averaging
  const C = 3.0;
  const m = 2; // Minimum votes required
  topMeals.forEach((meal) => {
    const R = meal.rating_total!;
    const v = meal.num_ratings!;
    const bayesianRating = (v / (v + m)) * R + (m / (v + m)) * C;
    (meal as any).bayesianRating = bayesianRating;
  });

  topMeals.sort(
    (a, b) => (b as any).bayesianRating - (a as any).bayesianRating,
  );
  return topMeals.slice(0, 10);
}

export async function getWorse10Meals() {
  const worseMeals = await db
    .select()
    .from(mealsTable)
    .where(
      and(
        isNotNull(mealsTable.rating_total),
        gte(mealsTable.num_ratings, 2),
        inArray(mealsTable.category, mainDishCategories),
      ),
    )
    .orderBy(asc(mealsTable.rating_total))
    .limit(20);

  // Bayesian averaging
  const C = 3.0; // Prior mean
  const m = 2; // Minimum votes required
  worseMeals.forEach((meal) => {
    const R = meal.rating_total!;
    const v = meal.num_ratings!;
    const bayesianRating = (v / (v + m)) * R + (m / (v + m)) * C;
    (meal as any).bayesianRating = bayesianRating;
  });

  worseMeals.sort(
    (a, b) => (a as any).bayesianRating - (b as any).bayesianRating,
  );
  return worseMeals.slice(0, 10);
}
