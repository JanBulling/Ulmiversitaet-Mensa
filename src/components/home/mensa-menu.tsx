"use client";

import * as React from "react";

import { Category } from "@/types/category";
import DateSelector from "./date-selector";
import MensaCategoryCard from "./category-card";
import { Skeleton } from "@/ui/Skeleton";
import { MealCategory } from "@/types/category";
import MensaCategoryList from "./category-list";
import { Separator } from "@/ui/separator";
import SiteLayout from "../general/site-layout";

interface MensaMenuProps {
  initialMenu: Category[];
  initialDate: Date;
}

const dateFormatter = new Intl.DateTimeFormat("de-DE", {
  dateStyle: "full",
});

const useSingleCard: MealCategory[] = [
  "SATTMACHER",
  "PRIMA KLIMA",
  "FLEISCH UND FISCH",
  "TOPF UND PFANNE",
];

export function MensaMenu({ initialMenu, initialDate }: MensaMenuProps) {
  const [mensaMenu, setMensaMenu] = React.useState<Category[]>(initialMenu);
  const [date, setDate] = React.useState<Date>(initialDate);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  async function fetchNewMenu(newDate: Date) {
    const dateString = newDate.toISOString().split("T")[0];

    setIsLoading(true);

    try {
      const response = await fetch(`/api/v1?date=${dateString}`, {
        cache: "default",
        next: { revalidate: 3600 },
      });
      const mensaMenuResponse = await response.json();

      setMensaMenu(mensaMenuResponse.meal_plan as Category[]);
    } catch (error) {
      console.error("Something went wrong", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <DateSelector
        onDateChange={(date) => {
          setDate(date);
          fetchNewMenu(date);
        }}
        date={date}
      />
      <SiteLayout>
        <h2 className="mx-auto my-4 text-xl font-semibold">
          {dateFormatter.format(date)}
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {mensaMenu.map((category) => {
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
      </SiteLayout>
    </>
  );
}
