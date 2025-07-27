import { parseMensaHTML } from "@/lib/scraper/parser";
import { getMensaHTML } from "@/lib/scraper/studienwerk-scarper";

export async function GET() {
  const today = new Date();
  today.setHours(8, 0, 0, 0);

  const htmlMensa = await getMensaHTML({ date: today });
  const mealPlan = parseMensaHTML(htmlMensa);

  return Response.json(mealPlan);
}
