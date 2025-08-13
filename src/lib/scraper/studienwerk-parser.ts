import { Meal } from "@/types/meal";
import jsdom from "jsdom";
import { parseCategoryDiv } from "./parsers/category-parser";
import { parseMealDiv } from "./parsers/meal-parser";

export function parseMensaHTML(htmlString: string): Meal[] {
  const meals: Meal[] = [];

  const dom = new jsdom.JSDOM(htmlString);
  const document = dom.window.document;

  if (document.querySelector(".nodata")) return [];

  const mainDiv = document.querySelector("div");
  if (!mainDiv) return [];

  /**
   * The HTML children are IN ORDER in the following structure:
   * - Header divs with class "gruppenkopf": Contains the category name
   * - Meal divs with class "splMeal": Contains the meal information
   */
  const children = Array.from(mainDiv.children).filter(
    (el) => el.tagName === "DIV",
  );
  if (children.length === 0) return [];

  // Split the children into categories based on the header divs
  // Each category consists of a header div followed by one or more meal divs
  while (children.length > 0) {
    const categoryDiv = children.shift();
    if (!categoryDiv || !categoryDiv.classList.contains("gruppenkopf")) {
      throw new Error("Invalid HTML structure: Expected a category div");
    }

    const currentCategory = parseCategoryDiv(categoryDiv);

    // loop further and parse the meals until a new category starts
    while (
      children.length > 0 &&
      !children[0].classList.contains("gruppenkopf")
    ) {
      const mealDiv = children.shift();
      if (!mealDiv || !mealDiv.classList.contains("splMeal")) {
        throw new Error("Invalid HTML structure: Expected a meal div");
      }

      const meal = parseMealDiv(mealDiv, currentCategory);

      meals.push(meal);
    }
  }

  return meals;
}
