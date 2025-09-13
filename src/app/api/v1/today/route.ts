import { getMenuForDate } from "@/lib/db-integration/get-for-date";
import { dateToString } from "@/lib/utils";

export const revalidate = 86400;
export const dynamic = "force-static";

export async function GET() {
  try {
    const today = new Date();

    const todayString = dateToString(today);
    const categories = await getMenuForDate(today);

    return Response.json({
      date: todayString,
      mensaMenu: categories,
    });
  } catch (err) {
    console.error("[V1/TODAY - GET]", "Unexpected server error", err);
    return new Response("Unexpected server error", { status: 500 });
  }
}
