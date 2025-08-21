import SiteLayout from "@/components/general/site-layout";
import { CategoryIcon } from "@/components/icons/category-icon";
import { MealTypeIcon } from "@/components/icons/meal-type-icon";
import { Allergies } from "@/components/meal/allergies";
import { NutritionalValues } from "@/components/meal/nutritional-values";
import Price from "@/components/meal/price";
import Ratings from "@/components/meal/ratings";
import { db } from "@/lib/db/db";
import { mealsTable } from "@/lib/db/schema";
import { capitalize } from "@/lib/utils";
import { mealCategoryColorMap } from "@/types/category";
import { mealTypeColorMap } from "@/types/meal-types";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

interface MealPageProps {
  params: Promise<{ slug: string }>;
}

export default async function MealPage({ params }: MealPageProps) {
  const { slug } = await params;

  const mealResponse = await db
    .select()
    .from(mealsTable)
    .where(eq(mealsTable.slug, slug));

  if (mealResponse.length !== 1) {
    return notFound();
  }
  const meal = mealResponse[0];

  return (
    <SiteLayout className="my-4">
      <h1 className="text-4xl font-bold">{meal.name}</h1>
      <div className="flex items-center gap-2">
        <CategoryIcon category={meal.category} />
        <p
          style={{ color: mealCategoryColorMap[meal.category] }}
          className="font-semibold"
        >
          {meal.category}
        </p>
      </div>

      <div className="my-8 space-y-2">
        {meal.types.map((type) => (
          <div key={type} className="flex items-center gap-2">
            <MealTypeIcon mealType={type} />
            <p
              className="font-semibold"
              style={{ color: mealTypeColorMap[type] }}
            >
              {capitalize(type)}
            </p>
          </div>
        ))}
      </div>

      <div className="md:grid md:grid-cols-2">
        <Price
          note={meal.price_note}
          student={meal.price_student}
          employee={meal.price_employee}
          other={meal.price_others}
        />

        <NutritionalValues
          calories={meal.nutrition_calories}
          protein={meal.nutrition_protein}
          fat={meal.nutrition_fat}
          saturatedFat={meal.nutrition_saturated_fat}
          carbohydrates={meal.nutrition_carbohydrates}
          sugar={meal.nutrition_sugar}
          salt={meal.nutrition_salt}
        />
      </div>

      <Allergies allergies={meal.allergies} />

      <Ratings
        mealId={meal.id}
        totalRating={meal.rating_total}
        numberRatings={meal.num_ratings}
        tasteRating={meal.rating_taste}
        lookRating={meal.rating_look}
        priceRating={meal.rating_price}
      />
    </SiteLayout>
  );
}
