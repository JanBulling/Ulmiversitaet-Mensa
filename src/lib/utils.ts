import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace("ö", "oe")
    .replace("ä", "ae")
    .replace("ü", "ue")
    .replace("ß", "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50); // Limit to 50 characters
}

export function getStartOfWeek(date: Date): Date {
  const startOfWeek = new Date(date);
  const day = startOfWeek.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Adjust for Sunday
  startOfWeek.setDate(startOfWeek.getDate() + diff);
  startOfWeek.setHours(8, 0, 0, 0);
  return startOfWeek;
}

export function getTotalRating(
  taste: number,
  look: number,
  price: number,
): number {
  return (3 * taste + 2 * look + price) / 6;
}

export function capitalize(str: string): string {
  const firstLetter = str[0];

  return firstLetter.toLocaleUpperCase() + str.substring(1).toLocaleLowerCase();
}

export function parseDateFromString(dateStr: string | null): Date | null {
  if (!dateStr) return null;
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? null : parsed;
}

export function dateToString(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function adjustToNextWeekday(date: Date): Date {
  const day = date.getDay(); // 0=Sunday, 6=Saturday
  if (day === 6) {
    date.setDate(date.getDate() + 2);
  } else if (day === 0) {
    date.setDate(date.getDate() + 1);
  }
  return date;
}
