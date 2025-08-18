import {
  Vegan,
  Ham,
  Beef,
  Bird,
  Fish,
  Shrimp,
  Carrot,
  LucideProps,
} from "lucide-react";

export const mealTypes = [
  "VEGETARIAN",
  "VEGAN",
  "SCHWEIN",
  "RIND",
  "LAMM",
  "WILDFLEISCH",
  "GEFLÜGEL",
  "FISCH",
  "TINTENFISCH",
] as const;

export type MealType = (typeof mealTypes)[number];

export const mealTypeIconMap: Partial<
  Record<
    MealType,
    React.ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >
  >
> = {
  VEGAN: Vegan,
  VEGETARIAN: Carrot,
  SCHWEIN: Ham,
  RIND: Beef,
  GEFLÜGEL: Bird,
  FISCH: Fish,
  TINTENFISCH: Shrimp,
};
export const MealTypeDefaultIcon = null;

export const mealTypeColorMap: Partial<Record<MealType, string>> = {
  VEGAN: "#65a30d",
  VEGETARIAN: "#16a34a",
  SCHWEIN: "#e11d48",
  RIND: "#854d0e",
  LAMM: "#a21caf",
  WILDFLEISCH: "#713f12",
  GEFLÜGEL: "#f97316",
  FISCH: "#0284c7",
  TINTENFISCH: "#3730a3",
};
