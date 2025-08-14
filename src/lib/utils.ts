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
