import { Category } from "@/types/category";
import { categoryColorMap, CategoryIcon } from "./category-icon";
import Link from "next/link";
import { generateSlug } from "@/lib/utils";
import { Rating } from "@/ui/rating";

interface MensaCategoryListProps {
  category: Category;
}

export default function MensaCategoryList({
  category,
}: MensaCategoryListProps) {
  return (
    <div className="col-span-full">
      <div className="flex items-center gap-2">
        <CategoryIcon size={20} category={category.category} />
        <h3
          className="text-xl font-semibold"
          style={{ color: categoryColorMap[category.category] ?? "#3f3f3f" }}
        >
          {category.category}
        </h3>
      </div>
      <ul className="flex flex-col gap-2">
        {category.meals.map((meal) => (
          <Link key={meal.name} href={`/meal/${generateSlug(meal.name)}`}>
            <li className="bg-card hover:bg-muted cursor-pointer rounded-md px-4 py-2 shadow-md">
              <div className="flex flex-col justify-between md:flex-row">
                <h4 className="text-lg font-semibold">{meal.name}</h4>
                <Rating
                  value={meal.rating ?? 0}
                  maxRating={5}
                  showNumber
                  numberRatings={meal.numberRatings ?? 0}
                />
              </div>
              <p className="text-sm text-gray-500">
                {meal.prices.note} {meal.prices.student}€ |{" "}
                {meal.prices.employee}€ | {meal.prices.others}€
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
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}
