import { MealCategory } from "@/types/meal";

export function parseCategoryDiv(div: Element): MealCategory {
  if (!div.classList.contains("gruppenkopf")) {
    throw new Error("Invalid category div: Missing 'gruppenkopf' class");
  }

  const categoryText = div.textContent?.trim() ?? "";
  const formattedCategory = formatMealCategory(categoryText);

  return formattedCategory;
}

const mealCategoryMap: Record<MealCategory, string[]> = {
  "TOPF UND PFANNE": ["TOPF", "PFANNE", "TOPF + PFANNE"],
  SATTMACHER: ["SATTMACHER"],
  "PRIMA KLIMA": ["PRIMA", "KLIMA", "PRIMA KLIMA"],
  "FLEISCH UND FISCH": ["FLEISCH", "FISCH", "FLEISCH + FISCH"],
  BEILAGE: ["BEILAGE", "BEILAGEN"],
  SALATBUFFET: ["SALATBUFFET"],
  SALAT: ["SALAT"],
  DESSERT: ["DESSERT", "DESSERTS"],
  PIZZA: ["PIZZA", "PIZZA I", "PIZZA II", "PIZZA III"],
  PASTA: ["PASTA"],
  SNACKS: ["CURRYWURST", "POMMES"],
  UNKNOWN: ["UNKNOWN"],
};

function formatMealCategory(category: string): MealCategory {
  for (const [key, values] of Object.entries(mealCategoryMap)) {
    for (const v of values) {
      if (category.toUpperCase().includes(v)) {
        return key as MealCategory;
      }
    }
  }

  return "UNKNOWN";
  throw new Error(`Unknown meal category: ${category}`);
}
