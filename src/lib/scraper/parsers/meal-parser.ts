import { Allergy } from "@/types/allergy";
import { MealCategory } from "@/types/category";
import { Meal, MealNutrition } from "@/types/meal";
import { MealType } from "@/types/meal-types";

export function parseMealDiv(div: Element, category: MealCategory): Meal {
  if (!div.classList.contains("splMeal")) {
    throw new Error("Invalid meal div: Missing 'splMeal' class");
  }

  // --- ALLERGIES ---
  // Somehow the allergy informations are passed along in the "lang" attribute
  const langAttribute = div.getAttribute("lang") || "";
  const allergiesList = Array.from(
    new Set(
      langAttribute
        .split(",")
        .map((s) => formatAllergies(s.trim()))
        .filter((a) => a !== undefined),
    ),
  );

  const mealDataDiv = div.querySelector(".visible-xs-block");
  const fltls = mealDataDiv?.querySelectorAll(".fltl") || [];

  // --- NAME ---
  // Format name (clean up whitespace and trim)
  const nameParts: string[] = [];
  for (const node of Array.from(fltls[1].childNodes || [])) {
    if (node.nodeType === 3 /*Text node*/) {
      nameParts.push(node.textContent!.trim());
    }
  }
  const mealNameText =
    nameParts
      .join(" ")
      ?.replace(/\(.*?\)/g, "")
      .replace(/\s+/g, " ")
      .replace(/- ([A-Z])/g, "-$1")
      .replace(/- ([a-z])/g, "$1")
      .replace(/ ,/g, ",")
      .replace(/(?<=,)(?=\S)/g, " ")
      .replace(/ , /g, " ")
      .trim() || "";

  // --- TYPE (VEGAN/VEGIE/MEAT) ---
  // get meal type by looking for corresponding icons
  const icons = div.querySelectorAll("img.icon");
  const types: MealType[] = [];
  icons.forEach((icon) => {
    const src = icon.getAttribute("src") || "";
    const type = src.replace(/^assets\/icons\//, "").replace(/\.png$/, "");
    const mealType = formatMealType(type);
    if (mealType) {
      types.push(mealType);
    }
  });

  // --- PRICE ---
  // stored as a sibling (???) of the "preisgramm" element
  const priceText =
    mealDataDiv?.querySelector(".preisgramm")?.parentElement?.textContent || "";
  const prices = formatPrices(priceText);

  // --- NUTRITION ---
  const nutritionDiv = mealDataDiv?.querySelector(".azn");
  const nutrition = parseNutritionDiv(nutritionDiv);

  return {
    name: mealNameText,
    category: category,
    prices: prices,
    types: types,
    allergies: allergiesList,
    nutrition: nutrition,
  };
}

// -------- Format allergies --------
const allergyMap: Record<string, Allergy> = {
  "1": "FARBSTOFF",
  "2": "KONSERVIERUNGSSTOFF",
  "3": "ANTIOXIDATIONSMITTEL",
  "4": "GESCHMACKSVERSTÄRKER",
  "5": "GESCHWEFELT",
  "6": "GESCHWÄRZT",
  "7": "GEWACHST",
  "8": "PHOSPHAT",
  "9": "SÜSSUNGSMITTEL",
  "10": "PHENYLALIN",
  "13": "KREBSTIERE",
  "14": "EIER",
  "18": "GELATINE (SCHWEIN)",
  "18 R": "GELATINE (RIND)",
  "22": "ERDNÜSSE",
  "23": "SOJA",
  "24": "MILCH",
  "25H": "HASELNUSS",
  "25W": "WALLNUSS",
  "25P": "PISTAZIE",
  "25MN": "MANDEL",
  "25C": "CASHEW",
  "25MA": "MACADEMIA",
  "25PK": "PEKANUS",
  "26": "SELLERIE",
  "27": "SENF",
  GL: "GLUTEN",
  "28": "SESAM",
  "29": "SCHWEFELDIOXID",
  "30": "SULFITE",
  "31": "LUPINE",
  "32": "WEICHTIERE",
  "34W": "WEIZEN",
  "34H": "HAFER",
  "34R": "ROGGEN",
  "34D": "DINKEL",
  "35": "FISCH",
};

function formatAllergies(allergyCode: string): Allergy | undefined {
  if (allergyMap.hasOwnProperty(allergyCode.toUpperCase())) {
    return allergyMap[allergyCode.toUpperCase()];
  }
  return undefined;
}

// -------- Format meal type --------
const mealTypeMap: Record<string, MealType> = {
  VEG: "VEGETARIAN",
  VAN: "VEGAN",
  S: "SCHWEIN",
  R: "RIND",
  L: "LAMM",
  W: "WILDFLEISCH",
  G: "GEFLÜGEL",
  F: "FISCH",
  T: "TINTENFISCH",
};

function formatMealType(type: string): MealType | undefined {
  if (mealTypeMap.hasOwnProperty(type.toUpperCase())) {
    return mealTypeMap[type.toUpperCase()];
  }
  return undefined;
}

// -------- Format prices --------
function formatPrices(priceText: string): {
  student: string;
  employee: string;
  others: string;
  note?: string;
} {
  let note: string | undefined;
  if (priceText.includes("(")) {
    const match = /\((.*?)\)/.exec(priceText);
    if (match) {
      note = match[1];
      priceText = priceText.replace(match[0], "");
    }
  }

  const cleaned = priceText
    .replace(/\xa0/g, " ")
    .replace(/ €|&nbsp|;/g, "")
    .replaceAll(",", ".")
    .trim();
  const parts = cleaned.split("|").map((p) => p.trim());
  const studentPrice = parts[0] || "";
  const employeePrice = parts[1] || "";
  const othersPrice = parts[2] || "";

  return {
    student: studentPrice,
    employee: employeePrice,
    others: othersPrice,
    note: note,
  };
}

// -------- Parse nutrition information --------
function parseNutritionDiv(nutritionDiv?: Element | null): MealNutrition {
  function parseNutritionWithParentheses(text: string): [string, string] {
    const main = text.substring(0, text.indexOf("g") + 1);
    const match = /\((.*?)\)/.exec(text);
    const extra = match ? match[1] : "";
    return [main, extra];
  }

  const nutrition: MealNutrition = {};

  if (!nutritionDiv) {
    return nutrition; // Return empty nutrition if no div is found
  }

  try {
    const [energy, protein, fat, carbs, salt] = Array.from(
      nutritionDiv.querySelectorAll("tr"),
    ).slice(1);

    nutrition.calories = energy
      ?.querySelectorAll("td")[1]
      .textContent?.split("/")[1]
      .replace(",0", "")
      .replace("kcal", "")
      .trim();
    nutrition.protein = protein
      ?.querySelectorAll("td")[1]
      .textContent?.replace("g", "")
      .replace(",", ".")
      .trim();

    const [fatVal, satFat] = parseNutritionWithParentheses(
      fat.querySelectorAll("td")[1].textContent?.trim() || "",
    );
    nutrition.fat = fatVal.replace("g", "").replace(",", ".").trim();
    nutrition.saturatedFat = satFat
      .replace("davon gesättigt", "")
      .replace("g", "")
      .replace(",", ".")
      .trim();

    const [carbVal, sugar] = parseNutritionWithParentheses(
      carbs.querySelectorAll("td")[1].textContent?.trim() || "",
    );
    nutrition.carbohydrates = carbVal.replace("g", "").replace(",", ".").trim();
    nutrition.sugar = sugar
      .replace("davon Zucker", "")
      .replace("g", "")
      .replace(",", ".")
      .trim();

    nutrition.salt = salt
      ?.querySelectorAll("td")[1]
      .textContent?.replace("g", "")
      .replace(",", ".")
      .trim();

    return nutrition;
  } catch (error) {
    console.error("Error parsing nutrition information", {
      div: nutritionDiv,
    });
    return {};
  }
}
