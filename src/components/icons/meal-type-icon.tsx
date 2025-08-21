import { cn } from "@/lib/utils";
import {
  MealType,
  mealTypeColorMap,
  MealTypeDefaultIcon,
  mealTypeIconMap,
} from "@/types/meal-types";

interface MealTypeIconProps {
  mealType: MealType;
  className?: string;
  disabled?: boolean;
}

export function MealTypeIcon({
  mealType,
  className,
  disabled = false,
}: MealTypeIconProps) {
  const Icon = mealTypeIconMap[mealType] ?? MealTypeDefaultIcon;

  return (
    <div
      className="flex h-5 w-5 items-center justify-center rounded-full"
      style={{
        backgroundColor: disabled ? "#a3a3a3" : mealTypeColorMap[mealType],
      }}
    >
      {Icon && <Icon size={13} className={cn("text-white", className)} />}
      <p className="sr-only">{mealType}</p>
    </div>
  );
}
