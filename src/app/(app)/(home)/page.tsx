"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";

import {
  adjustToNextWeekday,
  dateToString,
  parseDateFromString,
} from "@/lib/utils";
import { fetcher } from "@/lib/fetcher";
import DateSelector from "@/components/home/date-selector";
import SiteLayout from "@/components/general/site-layout";
import { MealCategory, MensaMenu } from "@/types/category";

import { Skeleton } from "@/ui/skeleton";
import MensaCategoryList from "@/components/home/category-list";
import { Separator } from "@/ui/separator";
import MensaCategoryCard from "@/components/home/category-card";

const dateFormatter = new Intl.DateTimeFormat("de-DE", {
  dateStyle: "full",
});

const useSingleCard: MealCategory[] = [
  "SATTMACHER",
  "PRIMA KLIMA",
  "FLEISCH UND FISCH",
  "TOPF UND PFANNE",
];

export default function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const router = useRouter();

  const initialDate =
    parseDateFromString(React.use(searchParams).date) ||
    adjustToNextWeekday(new Date());

  const [selectedDate, setSelectedDate] = React.useState<Date>(initialDate);

  // Sync URL when date changes
  React.useEffect(() => {
    const dateStr = dateToString(selectedDate);
    router.replace(`?date=${dateStr}`, { scroll: false });
  }, [selectedDate, router]);

  const { data, error, isLoading } = useSWR<{
    date: string;
    mensaMenu: MensaMenu;
  }>(`/api/v1/${dateToString(selectedDate)}`, fetcher, {
    revalidateOnFocus: false,
  });

  return (
    <div className="my-4">
      <DateSelector date={selectedDate} onDateChange={setSelectedDate} />
      <SiteLayout>
        <h2 className="mx-auto my-4 text-xl font-semibold">
          {dateFormatter.format(selectedDate)}
        </h2>

        {isLoading && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        )}
        {data && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {data.mensaMenu.map((category) => {
              if (
                useSingleCard.includes(category.category) &&
                category.meals.length === 1
              ) {
                return (
                  <MensaCategoryCard
                    key={category.category}
                    category={category}
                  />
                );
              } else {
                return (
                  <React.Fragment key={category.category}>
                    <Separator
                      orientation="horizontal"
                      className="col-span-full"
                    />
                    <MensaCategoryList category={category} />
                  </React.Fragment>
                );
              }
            })}
          </div>
        )}
        {error && (
          <div className="">
            <p>ERROR</p>
          </div>
        )}
      </SiteLayout>
    </div>
  );
}
