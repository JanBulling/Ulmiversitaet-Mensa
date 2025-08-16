import { generateSlug } from "@/lib/utils";
import { Category } from "@/types/category";
import { categoryColorMap, CategoryIcon } from "./category-icon";
import Link from "next/link";
import { Rating } from "@/ui/rating";

export default function MensaCategoryCard({
  category,
  // allergies,
}: {
  category: Category;
  // allergies: boolean;
}) {
  const meal = category.meals[0];

  return (
    <Link key={meal.name} href={`/meal/${generateSlug(meal.name)}`}>
      <div className="bg-card hover:bg-muted h-full cursor-pointer rounded-md px-4 py-2 shadow-sm">
        <div
          className="flex flex-col justify-between md:flex-row"
          style={{ color: categoryColorMap[category.category] ?? "#3f3f3f" }}
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

        <h4 className="mt-2 text-lg font-semibold">{meal.name}</h4>
        <p className="text-sm text-gray-500">
          {meal.prices.note} {meal.prices.student}€ | {meal.prices.employee}€ |{" "}
          {meal.prices.others}€
        </p>

        <div className="mt-1 flex h-3 items-center gap-2">
          {meal.nutrition.calories && (
            <p className="text-xs text-gray-500">
              <span className="font-semibold">Calories:</span>{" "}
              {meal.nutrition.calories}kcal
            </p>
          )}

          {meal.nutrition.protein && (
            <p className="text-xs text-gray-500">
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
