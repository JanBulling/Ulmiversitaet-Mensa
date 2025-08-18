import { eq } from "drizzle-orm";
import { db } from "../db/db";
import { mealsTable, mensaPlanTable } from "../db/schema";
import { Category, mealCategories } from "@/types/category";

export async function getMenuForDate(date: Date): Promise<Category[]> {
  date.setHours(8, 0, 0, 0);

  const mealsResponse = await db
    .select()
    .from(mealsTable)
    .innerJoin(mensaPlanTable, eq(mensaPlanTable.meal_id, mealsTable.id))
    .where(eq(mensaPlanTable.date, date));

  const categories: Category[] = [];

  mealsResponse.forEach((response) => {
    const meal = response.meals;

    const category = categories.find((cat) => cat.category === meal.category);

    if (category) {
      category.meals.push({
        name: meal.name,
        types: meal.types,
        prices: {
          student: meal.price_student ?? undefined,
          employee: meal.price_employee ?? undefined,
          others: meal.price_others ?? undefined,
          note: meal.price_note ?? undefined,
        },
        nutrition: {
          calories: meal.nutrition_calories ?? undefined,
          protein: meal.nutrition_protein ?? undefined,
          carbohydrates: meal.nutrition_carbohydrates ?? undefined,
          sugar: meal.nutrition_sugar ?? undefined,
          fat: meal.nutrition_fat ?? undefined,
          saturatedFat: meal.nutrition_saturated_fat ?? undefined,
          salt: meal.nutrition_salt ?? undefined,
        },
        allergies: meal.allergies,
        rating: meal.rating_total,
        numberRatings: meal.num_ratings,
      });
    } else {
      categories.push({
        category: meal.category,
        meals: [
          {
            name: meal.name,
            types: meal.types,
            prices: {
              student: meal.price_student ?? undefined,
              employee: meal.price_employee ?? undefined,
              others: meal.price_others ?? undefined,
              note: meal.price_note ?? undefined,
            },
            nutrition: {
              calories: meal.nutrition_calories ?? undefined,
              protein: meal.nutrition_protein ?? undefined,
              carbohydrates: meal.nutrition_carbohydrates ?? undefined,
              sugar: meal.nutrition_sugar ?? undefined,
              fat: meal.nutrition_fat ?? undefined,
              saturatedFat: meal.nutrition_saturated_fat ?? undefined,
              salt: meal.nutrition_salt ?? undefined,
            },
            allergies: meal.allergies,
            rating: meal.rating_total,
            numberRatings: meal.num_ratings,
          },
        ],
      });
    }
  });

  categories.sort((a, b) => {
    return (
      mealCategories.indexOf(a.category) - mealCategories.indexOf(b.category)
    );
  });

  return categories;
}
