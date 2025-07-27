import { parseMensaHTML } from "@/lib/scraper/parser";
import { getMensaHTML } from "@/lib/scraper/studienwerk-scarper";

export async function GET() {
  const start = getRelevantMonday();

  const results = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setHours(8, 0, 0, 0);
    date.setDate(start.getDate() + i);

    const htmlMensa = await getMensaHTML({ date: date });
    const mealPlan = parseMensaHTML(htmlMensa);

    if (mealPlan.length > 0) {
      results.push({
        date: start.toDateString(),
        meals: mealPlan,
      });
    }
  }

  return Response.json(results);
}

function getRelevantMonday(date: Date = new Date()): Date {
  const currentDay = date.getDay(); // 0 (Sun) - 6 (Sat)
  const result = new Date(date);

  if (currentDay === 6) {
    // Saturday → Next Monday
    result.setDate(date.getDate() + 2);
  } else if (currentDay === 0) {
    // Sunday → Next Monday
    result.setDate(date.getDate() + 1);
  } else {
    // Weekday → Past Monday
    result.setDate(date.getDate() - (currentDay - 1));
  }

  // Normalize to start of day if needed
  result.setHours(8, 0, 0, 0);

  return result;
}
