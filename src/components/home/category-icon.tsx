import { cn } from "@/lib/utils";
import { MealCategory } from "@/types/meal";
import {
  CookingPot,
  Ham,
  Hamburger,
  IceCream,
  Leaf,
  Pizza,
  Salad,
  Utensils,
  Wheat,
} from "lucide-react";

const categoryIconMap: Partial<Record<MealCategory, React.ComponentType>> = {
  SATTMACHER: Utensils,
  "FLEISCH UND FISCH": Ham,
  "PRIMA KLIMA": Leaf,
  "TOPF UND PFANNE": CookingPot,
  SALAT: Salad,
  SALATBUFFET: Salad,
  DESSERT: IceCream,
  PIZZA: Pizza,
  PASTA: Wheat,
  SNACKS: Hamburger,
};

export const categoryColorMap: Partial<Record<MealCategory, string>> = {
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

interface CategoryIconProps {
  category: MealCategory;
  size?: number;
}

const DefaultIcon = Utensils;

export function CategoryIcon({ category, size = 14 }: CategoryIconProps) {
  const Icon = categoryIconMap[category] ?? DefaultIcon;
  return (
    <Icon
      size={size}
      style={{ color: categoryColorMap[category] }}
      className={cn()}
    />
  );
}
