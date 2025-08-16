import { db } from "@/lib/db/db";
import { mealsTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

interface MealPageProps {
  params: Promise<{ slug: string }>;
}

export default async function MealPage({ params }: MealPageProps) {
  const { slug } = await params;

  const mealResponse = await db
    .select()
    .from(mealsTable)
    .where(eq(mealsTable.slug, slug));

  if (mealResponse.length !== 1) {
    return notFound();
  }
  const meal = mealResponse[0];

  return <div>{meal.name}</div>;
}
