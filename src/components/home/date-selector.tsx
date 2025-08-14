"use client";

import { cn, getStartOfWeek } from "@/lib/utils";
import { Button } from "@/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
// import { useRouter } from "next/navigation";

export default function DateSelector({ selectedDate }: { selectedDate: Date }) {
  // const router = useRouter();

  const todayDate = new Date();
  const nextWeekDate = new Date();
  nextWeekDate.setDate(todayDate.getDate() + 7);

  const startOfNextWeek = getStartOfWeek(nextWeekDate);
  const startOfThisWeek = getStartOfWeek(todayDate);
  const startOfSelectedWeek = getStartOfWeek(selectedDate);

  function handleDateChange(newDate: Date) {
    const searchParams = newDate.toISOString().split("T")[0];
    // router.replace(`/?date=${searchParams}`);
    // router.refresh();

    window.location.href = `/?date=${searchParams}`;
  }

  function handleWeekChange(direction: "next" | "prev") {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(
      currentDate.getDate() + (direction === "next" ? 7 : -7),
    );
    const mondayOfUpdatedWeek = getStartOfWeek(currentDate);
    handleDateChange(mondayOfUpdatedWeek);
  }

  function getWeekDays() {
    const week = [];

    for (let i = 0; i < 5; i++) {
      // Monday to Friday
      const day = new Date(startOfSelectedWeek);
      day.setDate(startOfSelectedWeek.getDate() + i);
      week.push(day);
    }

    return week;
  }

  const weekDays = getWeekDays();
  const formatter = new Intl.DateTimeFormat("de-DE", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  });

  const isNextWeekDisabled =
    startOfSelectedWeek.getTime() >= startOfNextWeek.getTime();
  const isPrevWeekDisabled =
    startOfSelectedWeek.getTime() <= startOfThisWeek.getTime();

  return (
    <div className="bg-card sticky top-4 z-10 mb-8 flex justify-between rounded-xl p-4 shadow-md">
      <Button
        variant="outline"
        size="icon"
        disabled={isPrevWeekDisabled}
        className={cn(
          "hover:cursor-pointer",
          isPrevWeekDisabled && "invisible",
        )}
        onClick={() => handleWeekChange("prev")}
      >
        <ChevronLeft className="size-5" />
      </Button>
      <div className="flex items-center justify-center gap-1">
        {weekDays.map((day) => {
          const dateString = day.toISOString().split("T")[0];
          const isToday = day.toDateString() === todayDate.toDateString();
          const isSelected = day.toDateString() === selectedDate.toDateString();

          return (
            <Button
              key={dateString}
              variant="ghost"
              onClick={() => handleDateChange(day)}
              className={cn(
                "hover:cursor-pointer",
                isSelected && "bg-primary text-primary-foreground",
                isToday && "bg-accent text-accent-foreground",
              )}
            >
              {isToday ? "Heute" : formatter.format(day)}
            </Button>
          );
        })}
      </div>
      <Button
        variant="outline"
        size="icon"
        disabled={isNextWeekDisabled}
        className={cn(
          "hover:cursor-pointer",
          isNextWeekDisabled && "invisible",
        )}
        onClick={() => handleWeekChange("next")}
      >
        <ChevronRight className="size-5" />
      </Button>
    </div>
  );
}
