import { pgTableCreator, uuid } from "drizzle-orm/pg-core";

const pgTable = pgTableCreator((name) => `mensa_${name}`);

export const mealsTable = pgTable("meals", {
  id: uuid("id").defaultRandom().primaryKey(),
});
