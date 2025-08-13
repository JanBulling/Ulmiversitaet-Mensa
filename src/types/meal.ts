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
};

export const mealCategories = [
  "TOPF UND PFANNE",
  "SATTMACHER",
  "PRIMA KLIMA",
  "FLEISCH UND FISCH",
  "BEILAGE",
  "SALATBUFFET",
  "SALAT",
  "DESSERT",
  "PIZZA",
  "PASTA",
  "SNACKS",
  "UNKNOWN",
] as const;
export type MealCategory = (typeof mealCategories)[number];

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

export const allergies = [
  "FARBSTOFF",
  "KONSERVIERUNGSSTOFF",
  "ANTIOXIDATIONSMITTEL",
  "GESCHMACKSVERSTÄRKER",
  "GESCHWEFELT",
  "GESCHWÄRZT",
  "GEWACHST",
  "PHOSPHAT",
  "SÜSSUNGSMITTEL",
  "PHENYLALIN",
  "KREBSTIERE",
  "EIER",
  "GELATINE (SCHWEIN)",
  "GELATINE (RIND)",
  "ERDNÜSSE",
  "SOJA",
  "MILCH",
  "HASELNUSS",
  "WALLNUSS",
  "PISTAZIE",
  "MANDEL",
  "CASHEW",
  "MACADEMIA",
  "PEKANUS",
  "SELLERIE",
  "SENF",
  "GLUTEN",
  "SESAM",
  "SCHWEFELDIOXID",
  "SULFITE",
  "LUPINE",
  "WEICHTIERE",
  "WEIZEN",
  "HAFER",
  "ROGGEN",
  "DINKEL",
  "FISCH",
] as const;
export type Allergy = (typeof allergies)[number];

export type MealNutrition = {
  calories?: string;
  protein?: string;
  carbohydrates?: string;
  sugar?: string;
  fat?: string;
  saturatedFat?: string;
  salt?: string;
};
