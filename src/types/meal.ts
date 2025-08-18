import { Allergy } from "./allergy";
import { MealCategory } from "./category";
import { MealType } from "./meal-types";

export type Meal = {
  name: string;
  category: MealCategory;
  prices: {
    student?: string;
    employee?: string;
    others?: string;
    note?: string;
  };
  types: MealType[];
  allergies: Allergy[];
  nutrition: MealNutrition;
  rating?: number | null;
  numberRatings?: number | null;
};

export type MealNutrition = {
  calories?: string;
  protein?: string;
  carbohydrates?: string;
  sugar?: string;
  fat?: string;
  saturatedFat?: string;
  salt?: string;
};
