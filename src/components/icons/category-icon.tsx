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
  disabled?: boolean;
}

export function CategoryIcon({
  category,
  size = 14,
  className,
  disabled = false,
}: CategoryIconProps) {
  const Icon = mealCategoryIconMap[category] ?? MealCategoryDefaultIcon;
  return (
    <Icon
      size={size}
      style={{ color: disabled ? "#a3a3a3" : mealCategoryColorMap[category] }}
      className={className}
    />
  );
}
