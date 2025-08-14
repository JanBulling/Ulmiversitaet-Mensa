"use client";

import * as React from "react";

import { cn, getStartOfWeek } from "@/lib/utils";
import { Button } from "@/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { d } from "node_modules/drizzle-kit/index-BAUrj6Ib.mjs";

const dateFormatter = new Intl.DateTimeFormat("de-DE", {
  weekday: "short",
  day: "2-digit",
  month: "2-digit",
});

interface DateSelectorProps {
  date: Date;
  onDateChange: (date: Date) => void;
}

export default function DateSelector({
  date,
  onDateChange,
}: DateSelectorProps) {
  const today = new Date();
  const nextWeekDay = new Date();
  nextWeekDay.setDate(nextWeekDay.getDate() + 7);

  const startOfSelectedWeek = getStartOfWeek(date);
  const startOfTodayWeek = getStartOfWeek(today);
  const startOfNextWeek = getStartOfWeek(nextWeekDay);

  function getWeekDays() {
    const result = [];

    const mondayOfWeek = getStartOfWeek(date);

    for (let i = 0; i < 5; i++) {
      const day = new Date(mondayOfWeek);
      day.setDate(mondayOfWeek.getDate() + i);
      result.push(day);
    }

    return result;
  }

  function handleWeekChange(direction: "next" | "prev") {
    const dayInNewWeek = new Date(date);
    dayInNewWeek.setDate(
      dayInNewWeek.getDate() + (direction === "next" ? 7 : -7),
    );

    const mondayNewWeek = getStartOfWeek(dayInNewWeek);
    onDateChange(mondayNewWeek);
  }

  const isNextWeekDisabled =
    startOfSelectedWeek.getTime() >= startOfNextWeek.getTime();
  const isPrevWeekDisabled =
    startOfSelectedWeek.getTime() <= startOfTodayWeek.getTime();

  return (
    <div className="bg-card no-scrollbar sticky top-4 z-10 mx-2 mb-8 flex max-w-screen-xl justify-between gap-2 overflow-x-scroll rounded-xl p-4 shadow-md md:mx-auto">
      <Button
        variant="outline"
        size="icon"
        disabled={isPrevWeekDisabled}
        className={cn(
          "cursor-pointer",
          isPrevWeekDisabled && "hidden md:invisible",
        )}
        onClick={() => handleWeekChange("prev")}
      >
        <ChevronLeft className="size-5" />
      </Button>
      <div className="flex items-center justify-center gap-1">
        {getWeekDays().map((day) => {
          const isSelected = date.toDateString() === day.toDateString();
          const isToday = today.toDateString() === day.toDateString();

          return (
            <Button
              key={day.getDate()}
              variant={isSelected ? "default" : isToday ? "accent" : "ghost"}
              className="cursor-pointer"
              onClick={() => onDateChange(day)}
            >
              {isToday ? "Heute" : dateFormatter.format(day)}
            </Button>
          );
        })}
      </div>
      <Button
        variant="outline"
        size="icon"
        disabled={isNextWeekDisabled}
        className={cn(
          "cursor-pointer",
          isNextWeekDisabled && "hidden md:invisible",
        )}
        onClick={() => handleWeekChange("next")}
      >
        <ChevronRight className="size-5" />
      </Button>
    </div>
  );
}
