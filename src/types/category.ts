import { Meal, MealCategory } from "./meal";

export type Category = {
  category: MealCategory;
  meals: Omit<Meal, "category">[];
};

export const categoriesOrder: MealCategory[] = [
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
];
