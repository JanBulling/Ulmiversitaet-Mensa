import { MealCategory, MensaMenu } from "@/types/category";

export const GURU_SYSTEM_PROMPT =
  "Du bist der „Mensa-Guru“ der Ulmiversität - ein weiser, aber humorvoller Essens-Orakel-Assistent. Du bekommst die heutigen Mensa-Gerichte. Deine Aufgabe ist es, basierend darauf ein zufälliges Hauptgericht zu empfehlen. Wenn es passt, darfst du zusätzlich Beilagen, Salate oder Nachtisch als Bonus-Empfehlung hinzufügen - aber nur ergänzend, nicht als Hauptvorschlag. Lasse auch Bewertungen, Preis, Nährwerte einfließen, wobei vegane / vegetarische Gerichte leicht bevorzugt sind. Falls es keine gerichte gibt, antworte mit einer leicht ironischen Antwort, warum der Student den heute überhaupt an der Uni sei. Die Antworten MÜSSEN KURZ sein (MAXIMAL 2 Sätze oder 3 sehr kurze Sätze)! Verwende einen leicht spirituell-humorvollen Tonfall, der zu einem Guru passen würde. Antworte in deutsch. Verwende NUR Text. KEIN Markdown, Latex, HTML oder sonstiges. Verwende sehr gerne Emojis verwenden, musst es aber nicht.";

const mainDishCategories: MealCategory[] = [
  "SATTMACHER",
  "PRIMA KLIMA",
  "TOPF UND PFANNE",
  "FLEISCH UND FISCH",
  "PASTA",
  "PIZZA",
  "SNACKS",
];
const saladDishCategories: MealCategory[] = ["SALAT", "SALATBUFFET"];
const addonsDishCategories: MealCategory[] = ["BEILAGE", "DESSERT"];

export function menuToGuruFormat(menu: MensaMenu): string {
  const mainDishes = menu.filter((mealCategory) =>
    mainDishCategories.includes(mealCategory.category),
  );

  const mainDishesString = mainDishes
    .map((mealCategory) =>
      mealCategory.meals
        .map(
          (meal) =>
            `${meal.name} (${meal.types.join(",")}), Preis: ${meal.prices.student}€ ${meal.prices.note ?? ""}, Bewertung: ${meal.rating}, Nährwerte: ${meal.nutrition.calories}kcal ${meal.nutrition.protein}g Protein ${meal.nutrition.carbohydrates}g Kohlenhydrate ${meal.nutrition.fat}g Fett`,
        )
        .join("\n"),
    )
    .join("\n");

  const saladDishes = menu.filter((mealCategory) =>
    saladDishCategories.includes(mealCategory.category),
  );
  const saladDishesString = saladDishes
    .map((mealCategory) =>
      mealCategory.meals
        .map(
          (meal) =>
            `${meal.name} (${meal.types.join(",")}), Preis: ${meal.prices.student}€ ${meal.prices.note}`,
        )
        .join("\n"),
    )
    .join("\n");

  const addonsDishes = menu.filter((mealCategory) =>
    addonsDishCategories.includes(mealCategory.category),
  );
  const addonsDishesString = addonsDishes
    .map((mealCategory) =>
      mealCategory.meals
        .map(
          (meal) =>
            `${meal.name} (${meal.types.join(",")}), Preis: ${meal.prices.student}€ ${meal.prices.note}`,
        )
        .join("\n"),
    )
    .join("\n");

  return `Hauptgerichte:\n${mainDishesString}\n-------------\nSalate:\n${saladDishesString}\n-------------\nSonstiges:\n${addonsDishesString}`;
}
