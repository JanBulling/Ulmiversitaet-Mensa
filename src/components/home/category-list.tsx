import { Category, mealCategoryColorMap } from "@/types/category";
import { CategoryIcon } from "../icons/category-icon";
import Link from "next/link";
import { cn, generateSlug } from "@/lib/utils";
import { Rating } from "@/ui/rating";
import { useSettings } from "@/hooks/use-settings";
import { MealTypeIcon } from "../icons/meal-type-icon";
import { checkIfMealTyeIsAllowed } from "@/types/meal-types";

interface MensaCategoryListProps {
  category: Category;
}

export default function MensaCategoryList({
  category,
}: MensaCategoryListProps) {
  const { priceType, hideBadMeals, preferences } = useSettings();

  return (
    <div className="col-span-full">
      <div className="flex items-center gap-2">
        <CategoryIcon size={20} category={category.category} />
        <h3
          className="text-xl font-semibold"
          style={{
            color: mealCategoryColorMap[category.category] ?? "#3f3f3f",
          }}
        >
          {category.category}
        </h3>
      </div>
      <ul className="flex flex-col gap-2">
        {category.meals.map((meal) => {
          const priceString = `${meal.prices.note ?? ""} ${priceType === "EMPLOYEE" ? meal.prices.employee : priceType === "OTHER" ? meal.prices.others : meal.prices.student}€`;

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

          return (
            <Link key={meal.name} href={`/meal/${generateSlug(meal.name)}`}>
              <li
                className={cn(
                  "cursor-pointer rounded-md px-4 py-2 shadow-md",
                  isDisabled ? "bg-muted" : "bg-card hover:bg-muted",
                )}
              >
                <div
                  className={cn(
                    "flex flex-col justify-between md:flex-row",
                    isDisabled && "text-neutral-400",
                  )}
                >
                  <div className="flex items-center justify-between md:justify-start md:gap-2">
                    <h4 className="text-lg font-semibold">{meal.name}</h4>
                    <div className="flex items-center gap-2">
                      {meal.types.map((type) => (
                        <MealTypeIcon
                          key={type}
                          mealType={type}
                          disabled={isDisabled}
                        />
                      ))}
                    </div>
                  </div>
                  <Rating
                    value={meal.rating ?? 0}
                    maxRating={5}
                    numberRatings={meal.numberRatings ?? 0}
                  />
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
              </li>
            </Link>
          );
        })}
      </ul>
    </div>
  );
}
