import { cn } from "@/lib/utils";
import { Category } from "@/types/category";
import { MealCategory } from "@/types/meal";
import { Separator } from "@/ui/separator";
import { CookingPot, Ham, Leaf, Salad, Utensils } from "lucide-react";

const categoryIconMap: Record<MealCategory, React.ElementType | null> = {
  SATTMACHER: () => <Utensils />,
  "FLEISCH UND FISCH": () => <Ham />,
  "PRIMA KLIMA": () => <Leaf />,
  "TOPF UND PFANNE": () => <CookingPot />,
  SALAT: () => <Salad />,
  SALATBUFFET: null,
  BEILAGE: null,
  DESSERT: null,
  PIZZA: null,
  PASTA: null,
  SNACKS: null,
  UNKNOWN: null,
};

const categoryColorMap: Record<MealCategory, string> = {
  SATTMACHER: "#f97316",
  "FLEISCH UND FISCH": "#ef4444",
  "PRIMA KLIMA": "#22c55e",
  "TOPF UND PFANNE": "#3b82f6",
  SALAT: "#65a30d",
  SALATBUFFET: "#16a34a",
  BEILAGE: "#525252",
  DESSERT: "#ec4899",
  PIZZA: "#92400e",
  PASTA: "#92400e",
  SNACKS: "#92400e",
  UNKNOWN: "#525252",
};

export default function MensaCategoryCard({
  category,
}: {
  category: Category;
}) {
  return (
    <div className="bg-card rounded-md px-4 py-2 shadow-sm">
      <div
        className={cn("flex items-center gap-2 font-semibold")}
        style={{ color: categoryColorMap[category.category] ?? "#3f3f3f" }}
      >
        <h3>{category.category}</h3>
        {(() => {
          const Icon = categoryIconMap[category.category];
          return Icon ? <Icon /> : null;
        })()}
      </div>

      <ul className="space-y-4">
        {category.meals.map((meal) => (
          <li key={meal.name}>
            <h4 className="text-lg font-semibold">{meal.name}</h4>
            <p className="text-sm text-gray-500">
              {meal.prices.student}€ | {meal.prices.employee}€ |{" "}
              {meal.prices.others}€
            </p>

            <div className="flex h-3 items-center gap-2">
              {meal.nutrition.calories && (
                <p className="text-xs text-gray-500">
                  <span className="font-semibold">Calories:</span>{" "}
                  {meal.nutrition.calories}kcal
                </p>
              )}
              <Separator orientation="vertical" />
              {meal.nutrition.protein && (
                <p className="text-xs text-gray-500">
                  <span className="font-semibold">Protein:</span>{" "}
                  {meal.nutrition.protein}g
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
