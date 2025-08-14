"use client";

import * as React from "react";

import { Category } from "@/types/category";
import DateSelector from "./date-selector";
import MensaCategoryCard from "./category-card";

interface MensaMenuProps {
  initialMenu: Category[];
  initialDate: Date;
}

const dateFormatter = new Intl.DateTimeFormat("de-DE", {
  dateStyle: "full",
});

export function MensaMenu({ initialMenu, initialDate }: MensaMenuProps) {
  const [mensaMenu, setMensaMenu] = React.useState<Category[]>(initialMenu);
  const [date, setDate] = React.useState<Date>(initialDate);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  async function fetchNewMenu(newDate: Date) {
    const dateString = newDate.toISOString().split("T")[0];

    setIsLoading(true);

    try {
      const response = await fetch(`/api/v1?date=${dateString}`, {
        cache: "no-cache",
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
      <div className="mx-auto max-w-screen-xl px-4 md:px-12">
        <h2 className="mx-auto my-4 text-xl font-semibold">
          {dateFormatter.format(date)}
        </h2>

        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {mensaMenu.map((category) => (
              <MensaCategoryCard
                key={category.category}
                category={category}
                allergies={false}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
