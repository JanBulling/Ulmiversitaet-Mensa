import { Meal, MealNutrition, MealType } from "@/types/meal";
import jsdom from "jsdom";

export function parseMensaHTML(htmlString: string): Meal[] {
  const meals: Meal[] = [];

  const dom = new jsdom.JSDOM(htmlString);
  const document = dom.window.document;

  if (document.querySelector(".nodata")) {
    return [];
  }

  const mainDiv = document.querySelector("div");
  if (!mainDiv) return [];

  const children = Array.from(mainDiv.children).filter(
    (el) => el.tagName === "DIV",
  );
  const categories = splitCategories(children);

  for (const cat of categories) {
    meals.push(...parseCategory(cat));
  }

  return meals;
}

type CategoryElements = {
  headerDiv: Element;
  mealDivs: Element[];
};

function splitCategories(divs: Element[]): CategoryElements[] {
  const result: CategoryElements[] = [];

  while (divs.length > 0) {
    const header = divs.shift();

    if (!header || !header.classList.contains("gruppenkopf")) {
      throw new Error("Invalid HTML structure");
    }

    const mealDivs: Element[] = [];
    while (divs.length > 0 && !divs[0].classList.contains("gruppenkopf")) {
      mealDivs.push(divs.shift()!);
    }

    result.push({ headerDiv: header, mealDivs });
  }

  return result;
}

function parseCategory(category: CategoryElements): Meal[] {
  const meals: Meal[] = [];
  const mealCategory =
    category.headerDiv.querySelector(".gruppenname")?.textContent?.trim() || "";

  for (const mealDiv of category.mealDivs) {
    const allergyAttr = mealDiv.getAttribute("lang") || "";
    const allergiesSet = Array.from(
      new Set(allergyAttr.split(",").map((s) => s.trim())),
    );
    const allergies = allergiesSet
      .map((a) => formatAllergies(a))
      .filter((a) => a !== undefined);

    const mealBlock = mealDiv.querySelector(".visible-xs-block");
    const fltls = mealBlock?.querySelectorAll(".fltl") || [];

    const mealInfo = fltls[1];
    const nameParts: string[] = [];

    for (const node of Array.from(mealInfo?.childNodes || [])) {
      if (node.nodeType === 3) {
        // Text node
        nameParts.push(node.textContent!.trim());
      }
    }

    const name = formatMealName(nameParts);

    const types: MealType[] = [];
    const icons = mealDiv.querySelectorAll("img.icon");
    icons.forEach((icon) => {
      const src = icon.getAttribute("src") || "";
      const type = src.replace(/^assets\/icons\//, "").replace(/\.png$/, "");
      const mealType = formatType(type);
      if (mealType) {
        types.push(mealType);
      }
    });

    const priceSpan = mealBlock?.querySelector(".preisgramm")?.parentElement;
    const [pStud, pEmp, pOther, pNote] = parsePrices(
      priceSpan?.textContent || "",
    );

    let co2 = "";
    const nutriDiv = mealDiv.querySelector(".azn");
    let nutrition: MealNutrition = {};

    if (nutriDiv) {
      const texts = Array.from(nutriDiv.childNodes)
        .filter((n) => n.nodeType === 3) // Text node
        .map((n) => n.textContent!.trim());
      const co2Matches = texts.join(" ").match(/[\d.,]+\sg/);
      co2 = co2Matches?.[0] || "";

      const nutriRows = Array.from(nutriDiv.querySelectorAll("tr")).slice(1);
      nutrition = parseMealNutrition(nutriRows);
    }

    meals.push({
      name,
      category: formatCategoryName(mealCategory),
      allergies: Array.from(allergies),
      types,
      prices: {
        students: pStud,
        employees: pEmp,
        others: pOther,
      },
      co2,
      nutrition,
    });
  }

  return meals;
}

function formatAllergies(alergy: string): string | undefined {
  const map = new Map<string, string>([
    ["1", "Farbstoff"],
    ["2", "Konservierungsstoff"],
    ["3", "Antioxidationsmittel"],
    ["4", "Geschmacksverstärker"],
    ["5", "geschwefelt"],
    ["6", "geschwärzt"],
    ["7", "gewachst"],
    ["8", "Phosphat"],
    ["9", "Süßungsmittel"],
    ["10", "Phenylalin"],
    ["13", "Krebstiere"],
    ["14", "Eier"],
    ["18", "Gelatine (Schwein)"],
    ["18 R", "Gelatine (Rind)"],
    ["22", "Erdnüsse"],
    ["23", "Soja"],
    ["24", "Milch/Milchprodukte"],
    ["25H", "Haselnuss"],
    ["25W", "Walnuss"],
    ["25P", "Pistazie"],
    ["25MN", "Mandel"],
    ["25C", "Cashew"],
    ["25MA", "Macadamia"],
    ["25PK", "Pekanuss"],
    ["26", "Sellerie"],
    ["27", "Senf"],
    ["GL", "Glutenhaltiges Getreide"],
    ["28", "Sesamsamen"],
    ["29", "Schwefeldioxid Konz. > 10 mg"],
    ["30", "Sulfite Konz. > 10 mg"],
    ["31", "Lupine"],
    ["32", "Weichtiere"],
    ["34W", "Weizen"],
    ["34H", "Hafer"],
    ["34R", "Roggen"],
    ["34D", "Dinkel"],
    ["35", "Fisch"],
  ] as readonly [string, string][]);

  return map.get(alergy?.toUpperCase() ?? "");
}

function formatType(type: string | undefined): MealType | undefined {
  const map = new Map<string, MealType>([
    ["VEG", "VEGETARISCH"],
    ["VAN", "VEGAN"],
    ["S", "SCHWEIN"],
    ["R", "RIND"],
    ["L", "LAMM"],
    ["W", "WILDFLEISCH"],
    ["G", "GEFLÜGEL"],
    ["F", "FISCH"],
    // ["BIO", "BIO"],
    ["T", "TINTENFISCH"],
  ] as readonly [string, MealType][]);

  return map.get(type?.toUpperCase() ?? "");
}

function formatMealName(lines: string[]): string {
  let mealName = removeAllergens(lines.join(" "));

  mealName = mealName
    .replace(/\s+/g, " ")
    .replace(/- ([A-Z])/g, "-$1")
    .replace(/- ([a-z])/g, "$1")
    .replace(/ ,/g, ",")
    .replace(/(?<=,)(?=\S)/g, " ")
    .replace(/ , /g, " ")
    .trim();

  return mealName;
}

function removeAllergens(line: string): string {
  return line.replace(/\(.*?\)/g, "");
}

function formatCategoryName(mealCategory: string): string {
  return mealCategory
    .trim()
    .split(/\s+/)
    .map((word) => {
      if (word === "+") return "und";
      if (/^i+$/i.test(word)) return word.toUpperCase();
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

function parsePrices(priceText: string): [string, string, string, string] {
  let note = "";
  if (priceText.includes("(")) {
    const match = /\((.*?)\)/.exec(priceText);
    if (match) {
      note = match[1];
      priceText = priceText.replace(match[0], "");
    }
  }

  const cleaned = priceText
    .replace(/\xa0/g, " ")
    .replace(/ €|&nbsp/g, "")
    .trim();
  const parts = cleaned.split("|").map((p) => p.trim() + " €");
  if (parts.length !== 3) return ["n/a", "n/a", "n/a", note];
  return [parts[0], parts[1], parts[2], note];
}

function parseMealNutrition(rows: Element[]): MealNutrition {
  function parseWithParentheses(text: string): [string, string] {
    const main = text.substring(0, text.indexOf("g") + 1);
    const match = /\((.*?)\)/.exec(text);
    const extra = match ? match[1] : "";
    return [main, extra];
  }

  try {
    const nutrition: MealNutrition = {};
    const [energy, protein, fat, carbs, salt] = rows;

    nutrition.calories = energy.querySelectorAll("td")[1].textContent?.trim();
    nutrition.protein = protein.querySelectorAll("td")[1].textContent?.trim();

    const [fatVal, satFat] = parseWithParentheses(
      fat.querySelectorAll("td")[1].textContent?.trim() || "",
    );
    nutrition.fat = fatVal;
    nutrition.saturatedFat = satFat;

    const [carbVal, sugar] = parseWithParentheses(
      carbs.querySelectorAll("td")[1].textContent?.trim() || "",
    );
    nutrition.carbohydrates = carbVal;
    nutrition.sugar = sugar;

    nutrition.salt = salt.querySelectorAll("td")[1].textContent?.trim();

    return nutrition;
  } catch {
    return {};
  }
}
