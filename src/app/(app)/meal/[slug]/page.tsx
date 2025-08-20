import SiteLayout from "@/components/general/site-layout";
import { CategoryIcon } from "@/components/icons/category-icon";
import Ratings from "@/components/meal/ratings";
import { db } from "@/lib/db/db";
import { mealsTable } from "@/lib/db/schema";
import { mealCategoryColorMap } from "@/types/category";
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
      <h1 className="text-2xl font-bold">{meal.name}</h1>
      <div className="flex items-center gap-2">
        <CategoryIcon category={meal.category} />
        <p
          style={{ color: mealCategoryColorMap[meal.category] }}
          className="font-semibold"
        >
          {meal.category}
        </p>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold">
          Preis <span className="text-sm font-normal">{meal.price_note}</span>
        </h3>
        <div className="text-muted-foreground flex items-center gap-4">
          <p>Studenten</p>
          <p>{meal.price_student}€</p>
        </div>
        <div className="text-muted-foreground flex items-center gap-4">
          <p>Mitarbeiter</p>
          <p>{meal.price_employee}€</p>
        </div>
        <div className="text-muted-foreground flex items-center gap-4">
          <p>Gäste</p>
          <p>{meal.price_others}€</p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold">Nährwerte</h3>
        <div className="text-muted-foreground flex items-center gap-4">
          <p>Kalorien:</p>
          <p>{meal.nutrition_calories}kcal</p>
        </div>
        <div className="text-muted-foreground flex items-center gap-4">
          <p>Fett:</p>
          <p>
            {meal.nutrition_fat}g (davon gesättigt:{" "}
            {meal.nutrition_saturated_fat}g)
          </p>
        </div>
        <div className="text-muted-foreground flex items-center gap-4">
          <p>Kohlenhydrate:</p>
          <p>
            {meal.nutrition_carbohydrates}g (davon Zucker:{" "}
            {meal.nutrition_sugar}g)
          </p>
        </div>
        <div className="text-muted-foreground flex items-center gap-4">
          <p>Proteine:</p>
          <p>{meal.nutrition_protein}g</p>
        </div>
        <div className="text-muted-foreground flex items-center gap-4">
          <p>Salz:</p>
          <p>{meal.nutrition_salt}g</p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold">Allergien</h3>
        <div className="flex flex-wrap gap-4">
          {meal.allergies.map((a) => (
            <p key={a}>{a}</p>
          ))}
        </div>
      </div>

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
