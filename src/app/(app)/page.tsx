import DailyMeals from "@/components/home/daily-meals";
import DateSelector from "@/components/home/date-selector";
import { Suspense } from "react";

export default function Home({
  searchParams,
}: {
  searchParams: { date?: string };
}) {
  let selectedDate = searchParams?.date
    ? new Date(searchParams?.date)
    : new Date();
  if (isNaN(selectedDate.getTime())) {
    selectedDate = new Date();
  }
  selectedDate.setHours(8, 0, 0, 0);

  // const mensaPlan = await getPlanForDate(selectedDate);
  const formattedDate = new Intl.DateTimeFormat("de-DE", {
    dateStyle: "full",
  }).format(selectedDate);

  return (
    <div className="mt-4 w-full">
      <DateSelector selectedDate={selectedDate} />
      <h2 className="mx-auto my-4 text-xl font-semibold">{formattedDate}</h2>

      <Suspense fallback={<p>Loading</p>}>
        <DailyMeals date={selectedDate} />
      </Suspense>
    </div>
  );
}
