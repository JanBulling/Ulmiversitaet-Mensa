import { cn, generateSlug } from "@/lib/utils";
import { Category, mealCategoryColorMap } from "@/types/category";
import { CategoryIcon } from "../icons/category-icon";
import Link from "next/link";
import { Rating } from "@/ui/rating";
import { useSettings } from "@/hooks/use-settings";
import { MealTypeIcon } from "../icons/meal-type-icon";
import { checkIfMealTyeIsAllowed } from "@/types/meal-types";

export default function MensaCategoryCard({
  category,
}: {
  category: Category;
}) {
  const meal = category.meals[0];

  const { priceType, hideBadMeals, preferences } = useSettings();

  if (
    hideBadMeals &&
    meal.numberRatings &&
    meal.numberRatings > 0 &&
    meal.rating &&
    meal.rating <= 2.5
  ) {
    return null;
  }

  const isDisabled = !checkIfMealTyeIsAllowed(meal.types, preferences);

  const priceString = `${meal.prices.note ?? ""} ${priceType === "EMPLOYEE" ? meal.prices.employee : priceType === "OTHER" ? meal.prices.others : meal.prices.student}€`;

  return (
    <Link key={meal.name} href={`/meal/${generateSlug(meal.name)}`}>
      <div
        className={cn(
          "h-full cursor-pointer rounded-md px-4 py-2 shadow-sm",
          isDisabled ? "bg-muted" : "bg-card hover:bg-muted",
        )}
      >
        <div
          className="flex flex-col justify-between md:flex-row"
          style={{
            color: isDisabled
              ? "#a3a3a3"
              : (mealCategoryColorMap[category.category] ?? "#525252"),
          }}
        >
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{category.category}</h3>
            <CategoryIcon
              category={category.category}
              size={20}
              disabled={isDisabled}
            />
          </div>

          <Rating
            value={meal.rating ?? 0}
            maxRating={5}
            numberRatings={meal.numberRatings ?? 0}
          />
        </div>

        <div
          className={cn(
            "mt-2 flex items-center justify-between md:justify-start md:gap-2",
            isDisabled && "text-neutral-400",
          )}
        >
          <h4 className="text-lg font-semibold">{meal.name}</h4>
          <div className="flex items-center gap-2">
            {meal.types.map((type) => (
              <MealTypeIcon key={type} mealType={type} disabled={isDisabled} />
            ))}
          </div>
        </div>
        <p
          className={cn(
            "text-normal font-semibold",
            isDisabled && "text-neutral-400",
          )}
        >
          {priceString.trim()}
        </p>

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
