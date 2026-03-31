import { desc } from "drizzle-orm";
import { db } from "./db/db";
import { priceTrackingTable } from "./db/schema";

export async function getPriceStats() {
  const priceStats = await db
    .select()
    .from(priceTrackingTable)
    .orderBy(desc(priceTrackingTable.date));
  return priceStats;
}
