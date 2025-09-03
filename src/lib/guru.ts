import { GoogleGenAI } from "@google/genai";
import { getMenuForDate } from "./db-integration/get-for-date";
import { Category, MealCategory } from "@/types/category";

const ai = new GoogleGenAI({});

export async function getGuruResponse() {
  const mensaData = await getMenuForDate(new Date());

  const guruContent = planToGuruFormat(mensaData);

  console.log(guruContent);

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: guruContent,
    config: {
      systemInstruction:
        "Du bist der „Mensa-Guru“ der Ulmiversität - ein weiser, aber humorvoller Essens-Orakel-Assistent. Du bekommst die heutigen Mensa-Gerichte. Deine Aufgabe ist es, basierend darauf ein zufälliges Hauptgericht zu empfehlen. Wenn es passt, darfst du zusätzlich Beilagen, Salate oder Nachtisch als Bonus-Empfehlung hinzufügen - aber nur ergänzend, nicht als Hauptvorschlag. Lasse auch Bewertungen, Preis, Nährwerte einfließen, wobei vegane / vegetarische Gerichte leicht bevorzugt sind. Die Antworten MÜSSEN KURZ sein (MAXIMAL 2 Sätze oder 3 sehr kurze Sätze)! Verwende einen leicht spirituell-humorvollen Tonfall, der zu einem Guru passen würde. Antworte in deutsch. Verwende NUR Text. KEIN Markdown, Latex, HTML oder sonstiges. Du darfst sehr gerne Emojis verwenden, musst es aber nicht.",
      thinkingConfig: {
        thinkingBudget: 0, // Disables thinking
      },
    },
  });

  return response.text;
}

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

function planToGuruFormat(plan: Category[]): string {
  const mainDishes = plan.filter((cat) =>
    mainDishCategories.includes(cat.category),
  );
  const mainDishesString = mainDishes
    .map((category) =>
      category.meals
        .map(
          (meal) =>
            `${meal.name} (${meal.types.join(",")}), Preis: ${meal.prices.student}€ ${meal.prices.note ?? ""}, Bewertung: ${meal.rating}, Nährwerte: ${meal.nutrition.calories}kcal ${meal.nutrition.protein}g Protein ${meal.nutrition.carbohydrates}g Kohlenhydrate ${meal.nutrition.fat}g Fett`,
        )
        .join("\n"),
    )
    .join("\n");

  const saladDishes = plan.filter((cat) =>
    saladDishCategories.includes(cat.category),
  );
  const saladDishesString = saladDishes
    .map((category) =>
      category.meals
        .map(
          (meal) =>
            `${meal.name} (${meal.types.join(",")}), Preis: ${meal.prices.student}€ ${meal.prices.note}`,
        )
        .join("\n"),
    )
    .join("\n");

  const addonsDishes = plan.filter((cat) =>
    addonsDishCategories.includes(cat.category),
  );
  const addonsDishesString = addonsDishes
    .map((category) =>
      category.meals
        .map(
          (meal) =>
            `${meal.name} (${meal.types.join(",")}), Preis: ${meal.prices.student}€ ${meal.prices.note}`,
        )
        .join("\n"),
    )
    .join("\n");

  return `Hauptgerichte:\n${mainDishesString}\n-------------\nSalate:\n${saladDishesString}\n-------------\nSonstiges:\n${addonsDishesString}`;
}
