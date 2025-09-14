import { notFound } from "next/navigation";

import { and, eq, isNotNull, ne, desc, lte, gte, sql } from "drizzle-orm";

import { db } from "@/lib/db/db";
import { mealsTable, mensaPlanTable, ratingsTable } from "@/lib/db/schema";
import SiteLayout from "@/components/general/site-layout";
import { CategoryIcon } from "@/components/icons/category-icon";
import { mealCategoryColorMap } from "@/types/category";
import { MealTypeIcon } from "@/components/icons/meal-type-icon";
import { mealTypeColorMap } from "@/types/meal-types";
import { capitalize, cn } from "@/lib/utils";
import RatingDisplay from "@/components/meal/rating-display";
import NutritionDisplay from "@/components/meal/nutrition-display";
import AllergiesDisplay from "@/components/meal/allergies-display";
import { Rating } from "@/ui/rating";
import RatingForm from "@/components/meal/rating-form";
import PriceDisplay from "@/components/meal/price-display";

export const revalidate = 86400;
export const dynamic = "force-static";

const dateFormatter = Intl.DateTimeFormat("de-DE", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Europe/Berlin",
});

export default async function MealPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const mealData = await db
    .select()
    .from(mealsTable)
    .where(eq(mealsTable.slug, slug));

  if (mealData.length !== 1) return notFound();
  const meal = mealData[0];

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const mealFromPastData = await db
    .select({ count: sql<number>`count(*)` })
    .from(mensaPlanTable)
    .where(
      and(
        eq(mensaPlanTable.meal_id, meal.id),
        lte(mensaPlanTable.date, new Date()),
        gte(mensaPlanTable.date, oneWeekAgo),
      ),
    );
  const isFromPast =
    mealFromPastData.length === 1 && mealFromPastData[0].count >= 1;

  const comments = await db
    .select()
    .from(ratingsTable)
    .where(
      and(
        eq(ratingsTable.meal_id, meal.id),
        isNotNull(ratingsTable.text),
        ne(ratingsTable.text, ""),
      ),
    )
    .orderBy(desc(ratingsTable.created_at))
    .limit(50);

  return (
    <SiteLayout>
      <div className="mt-4 mb-1 flex items-center gap-2 md:mt-8">
        <CategoryIcon category={meal.category} />
        <p
          style={{ color: mealCategoryColorMap[meal.category] }}
          className="text-sm font-semibold md:text-base"
        >
          {meal.category}
        </p>
      </div>
      <h1 className="text-2xl font-bold md:text-4xl">{meal.name}</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <div className="my-2 flex flex-wrap gap-2">
            {meal.types.map((type) => (
              <div className="flex items-center gap-2" key={type}>
                <MealTypeIcon mealType={type} />
                <p
                  className="text-sm font-semibold capitalize md:text-base"
                  style={{ color: mealTypeColorMap[type] }}
                >
                  {capitalize(type)}
                </p>
              </div>
            ))}
          </div>

          <div className="my-2">
            <PriceDisplay
              student={meal.price_student ?? "-"}
              employee={meal.price_employee ?? "-"}
              other={meal.price_others ?? "-"}
              note={meal.price_note ?? undefined}
            />
          </div>

          <RatingDisplay
            numberRatings={meal.num_ratings ?? 0}
            totalRating={meal.rating_total ?? 0}
            tasteRating={meal.rating_taste ?? 0}
            lookRating={meal.rating_look ?? 0}
            priceRating={meal.rating_price ?? 0}
          />

          <div className="my-4 grid grid-cols-2 items-start gap-2">
            <NutritionDisplay
              calories={meal.nutrition_calories ?? "-"}
              protein={meal.nutrition_protein ?? "-"}
              fat={meal.nutrition_fat ?? "-"}
              saturatedFat={meal.nutrition_saturated_fat ?? "-"}
              carbohydrates={meal.nutrition_carbohydrates ?? "-"}
              sugar={meal.nutrition_sugar ?? "-"}
              salt={meal.nutrition_salt ?? "-"}
            />
            <AllergiesDisplay allergies={meal.allergies} />
          </div>
        </div>
        <div className="mt-4">
          <div className="bg-muted text-muted-foreground flex aspect-video items-center justify-center rounded border p-4 text-center">
            Bilder können aktuell noch nicht hochgeladen werden 🥹
          </div>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold">Hinterlasse eine Bewertung</h2>
          {isFromPast ? (
            <RatingForm className="mt-1" slug={meal.slug} mealId={meal.id} />
          ) : (
            <div className="bg-card rounded border px-4 py-8 shadow">
              <p className="text-muted-foreground text-center text-sm">
                Zukünftige Gerichte können noch nicht bewertet werden!
              </p>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold">Kommentare</h2>
          <div className="bg-card mt-1 rounded border px-4 shadow">
            {comments.length === 0 && (
              <p className="text-muted-foreground my-4 text-center text-sm">
                Noch keine Kommentare abgegeben!
              </p>
            )}
            <div className="divide-y">
              {comments.map((comment) => (
                <div key={comment.id} className="py-4">
                  <div className="flex items-center justify-between">
                    <Rating value={comment.rating_total} size={16} />
                    <p className="text-muted-foreground text-sm">
                      {dateFormatter.format(comment.created_at)}
                    </p>
                  </div>
                  <p>{comment.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
