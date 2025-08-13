import { Meal } from "@/types/meal";
import { generateSlug } from "../utils";

import { db } from "../db/db";
import { mealsTable, mensaPlanTable } from "../db/schema";
import { eq } from "drizzle-orm";

export async function saveMealsToDb(meals: Meal[], date?: Date) {
  const mealsDate = date || new Date();

  for (const meal of meals) {
    const mealSlug = generateSlug(meal.name);

    // Check if the meal already exists in the database
    const existingMeal = await db
      .select({ id: mealsTable.id })
      .from(mealsTable)
      .where(eq(mealsTable.slug, mealSlug));

    let mealId = existingMeal.length === 1 ? existingMeal[0].id : null;

    // If the meal already exists, update it
    if (existingMeal.length === 1) {
      await db
        .update(mealsTable)
        .set({
          name: meal.name,
          category: meal.category,
          types: meal.types,
          allergies: meal.allergies,
          price_student: meal.prices.student,
          price_employee: meal.prices.employee,
          price_others: meal.prices.others,
          price_note: meal.prices.note,
          nutrition_calories: meal.nutrition.calories,
          nutrition_protein: meal.nutrition.protein,
          nutrition_carbohydrates: meal.nutrition.carbohydrates,
          nutrition_sugar: meal.nutrition.sugar,
          nutrition_fat: meal.nutrition.fat,
          nutrition_saturated_fat: meal.nutrition.saturatedFat,
          nutrition_salt: meal.nutrition.salt,
        })
        .where(eq(mealsTable.slug, mealSlug));
    } else {
      const response = await db
        .insert(mealsTable)
        .values({
          slug: mealSlug,

          name: meal.name,
          category: meal.category,

          types: meal.types,

          allergies: meal.allergies,

          price_student: meal.prices.student,
          price_employee: meal.prices.employee,
          price_others: meal.prices.others,
          price_note: meal.prices.note,

          nutrition_calories: meal.nutrition.calories,
          nutrition_protein: meal.nutrition.protein,
          nutrition_carbohydrates: meal.nutrition.carbohydrates,
          nutrition_sugar: meal.nutrition.sugar,
          nutrition_fat: meal.nutrition.fat,
          nutrition_saturated_fat: meal.nutrition.saturatedFat,
          nutrition_salt: meal.nutrition.salt,
        })
        .returning({ id: mealsTable.id });

      mealId = response[0].id;
    }

    // Insert or update the meal in the mensa plan table
    await db.insert(mensaPlanTable).values({
      meal_id: mealId!,
      date: mealsDate,
    });
  }
}
