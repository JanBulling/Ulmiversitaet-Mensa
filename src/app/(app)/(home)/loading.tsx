import DateSelector from "@/components/home/date-selector";
import { Skeleton } from "@/ui/skeleton";

export default function HomeLoading() {
  const date = new Date();
  if (date.getDay() === 6) {
    date.setDate(date.getDate() + 2);
  } else if (date.getDay() == 0) {
    date.setDate(date.getDate() + 1);
  }
  date.setHours(8, 0, 0, 0);

  const dateFormatter = new Intl.DateTimeFormat("de-DE", {
    dateStyle: "full",
  });

  return (
    <div className="my-4">
      <DateSelector date={date} />
      <div className="mx-auto max-w-screen-xl px-4 md:px-12">
        <h2 className="mx-auto my-4 text-xl font-semibold">
          {dateFormatter.format(date)}
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    </div>
  );
}
