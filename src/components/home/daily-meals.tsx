import { getPlanForDate } from "@/lib/db-integration/get-for-date";
import MensaCategoryCard from "./category-card";

export default async function DailyMeals({ date }: { date: Date }) {
  const mensaPlan = await getPlanForDate(date);

  if (mensaPlan.length === 0) {
    return (
      <p className="text-muted-foreground text-center">
        No meals available for this date.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      {mensaPlan.map((category) => (
        <MensaCategoryCard key={category.category} category={category} />
      ))}
    </div>
  );
}
