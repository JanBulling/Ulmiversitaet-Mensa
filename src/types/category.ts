import {
  CookingPot,
  Ham,
  Hamburger,
  IceCream,
  Leaf,
  LucideProps,
  Pizza,
  Salad,
  Utensils,
  Wheat,
} from "lucide-react";
import { Meal } from "./meal";

export type Category = {
  category: MealCategory;
  meals: Omit<Meal, "category">[];
};

export const mealCategories = [
  "SATTMACHER",
  "TOPF UND PFANNE",
  "PRIMA KLIMA",
  "FLEISCH UND FISCH",
  "PIZZA",
  "PASTA",
  "SNACKS",
  "DESSERT",
  "SALAT",
  "SALATBUFFET",
  "BEILAGE",
  "UNKNOWN",
] as const;

export type MealCategory = (typeof mealCategories)[number];

export const mealCategoryIconMap: Partial<
  Record<
    MealCategory,
    React.ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >
  >
> = {
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
export const MealCategoryDefaultIcon = Utensils;

export const mealCategoryColorMap: Partial<Record<MealCategory, string>> = {
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
