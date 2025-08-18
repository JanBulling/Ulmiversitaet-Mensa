import { generateSlug } from "@/lib/utils";
import { Category, mealCategoryColorMap } from "@/types/category";
import { CategoryIcon } from "../icons/category-icon";
import Link from "next/link";
import { Rating } from "@/ui/rating";
import { useSettings } from "@/hooks/use-settings";
import { MealTypeIcon } from "../icons/meal-type-icon";

export default function MensaCategoryCard({
  category,
}: {
  category: Category;
}) {
  const meal = category.meals[0];

  const { priceType, hideBadMeals } = useSettings();

  if (
    hideBadMeals &&
    meal.numberRatings &&
    meal.numberRatings > 0 &&
    meal.rating &&
    meal.rating <= 2.5
  ) {
    return null;
  }

  const priceString = `${meal.prices.note ?? ""} ${priceType === "EMPLOYEE" ? meal.prices.employee : priceType === "OTHER" ? meal.prices.others : meal.prices.student}€`;

  return (
    <Link key={meal.name} href={`/meal/${generateSlug(meal.name)}`}>
      <div className="bg-card hover:bg-muted h-full cursor-pointer rounded-md px-4 py-2 shadow-sm">
        <div
          className="flex flex-col justify-between md:flex-row"
          style={{
            color: mealCategoryColorMap[category.category] ?? "#3f3f3f",
          }}
        >
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{category.category}</h3>
            <CategoryIcon category={category.category} size={20} />
          </div>

          <Rating
            value={meal.rating ?? 0}
            maxRating={5}
            showNumber
            numberRatings={meal.numberRatings ?? 0}
          />
        </div>

        <div className="mt-2 flex items-center justify-between md:justify-start md:gap-2">
          <h4 className="text-lg font-semibold">{meal.name}</h4>
          <div className="flex items-center gap-2">
            {meal.types.map((type) => (
              <MealTypeIcon key={type} mealType={type} />
            ))}
          </div>
        </div>
        <p className="text-normal font-semibold">{priceString.trim()}</p>

        <div className="mt-1 flex h-3 items-center gap-2">
          {meal.nutrition.calories && (
            <p className="text-muted-foreground text-xs">
              <span className="font-semibold">Calories:</span>{" "}
              {meal.nutrition.calories}kcal
            </p>
          )}

          {meal.nutrition.protein && (
            <p className="text-muted-foreground text-xs">
              <span className="font-semibold">Protein:</span>{" "}
              {meal.nutrition.protein}g
            </p>
          )}
        </div>
        {/* {allergies && (
              <div className="mt-1 flex flex-wrap gap-2 text-xs">
                {meal.allergies.map((a) => (
                  <AllergyIcon allergy={a} key={a} />
                ))}
              </div>
            )} */}
      </div>
    </Link>
  );
}
