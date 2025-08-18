import {
  MealCategory,
  mealCategoryColorMap,
  MealCategoryDefaultIcon,
  mealCategoryIconMap,
} from "@/types/category";

interface CategoryIconProps {
  category: MealCategory;
  size?: number;
  className?: string;
}

export function CategoryIcon({
  category,
  size = 14,
  className,
}: CategoryIconProps) {
  const Icon = mealCategoryIconMap[category] ?? MealCategoryDefaultIcon;
  return (
    <Icon
      size={size}
      style={{ color: mealCategoryColorMap[category] }}
      className={className}
    />
  );
}
