export type Meal = {
  name: string;
  category: string;
  prices: {
    students: string;
    employees: string;
    others: string;
  };
  types: (MealType | undefined)[];
  allergies: string[];
  co2: string;
  nutrition: MealNutrition;
};

export type MealType =
  | "VEGETARIAN"
  | "VEGAN"
  | "SCHWEIN"
  | "RIND"
  | "LAMM"
  | "WILDFLEISCH"
  | "GEFLÜGEL"
  | "FISCH"
  | "TINTENFISCH";

export type MealNutrition = {
  calories?: string;
  protein?: string;
  carbohydrates?: string;
  sugar?: string;
  fat?: string;
  saturatedFat?: string;
  salt?: string;
};
