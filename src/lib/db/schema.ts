import { allergies, mealCategories, mealTypes } from "@/types/meal";
import {
  date,
  index,
  pgEnum,
  pgTableCreator,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { sl } from "zod/locales";

const pgTable = pgTableCreator((name) => `mensa_${name}`);

export const mealCategoriesEnum = pgEnum("meal_category", mealCategories);
export const mealTypesEnum = pgEnum("meal_type", mealTypes);
export const mealAllergiesEnum = pgEnum("meal_allergy", allergies);

export const mealsTable = pgTable(
  "meals",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull().unique(),

    name: text("name").notNull(),
    // date: date("date", { mode: "date" }).notNull(),
    category: mealCategoriesEnum("category").notNull(),

    types: mealTypesEnum("types").array().notNull(),

    allergies: mealAllergiesEnum("allergy").array().notNull(),

    price_student: text("price_student"),
    price_employee: text("price_employee"),
    price_others: text("price_others"),
    price_note: text("price_note"),

    nutrition_calories: text("nutrition_calories"),
    nutrition_protein: text("nutrition_protein"),
    nutrition_carbohydrates: text("nutrition_carbohydrates"),
    nutrition_sugar: text("nutrition_sugar"),
    nutrition_fat: text("nutrition_fat"),
    nutrition_saturated_fat: text("nutrition_saturated_fat"),
    nutrition_salt: text("nutrition_salt"),

    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    slugIdx: uniqueIndex("slug_idx").on(table.slug),
    nameIdx: index("name_idx").on(table.name),
  }),
);

export const mensaPlanTable = pgTable(
  "mensa_plan",
  {
    id: serial("id").primaryKey(),
    date: date("date", { mode: "date" }).notNull(),
    meal_id: uuid("meal_id")
      .references(() => mealsTable.id)
      .notNull(),
  },
  (table) => ({
    dateMealIdIdx: uniqueIndex("date_meal_id_idx").on(
      table.date,
      table.meal_id,
    ),
  }),
);
