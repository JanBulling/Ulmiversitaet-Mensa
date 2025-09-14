import { getMenuForDate } from "@/lib/db-integration/get-for-date";
import { dateToString } from "@/lib/utils";

export async function GET() {
  try {
    const today = new Date();

    console.info("[V1-TODAY - GET]", "api endpoint called");

    const categories = await getMenuForDate(dateToString(today));

    return Response.json(categories);
  } catch (err) {
    console.error("[V1/TODAY - GET]", "Unexpected server error", err);
    return new Response("Unexpected server error", { status: 500 });
  }
}
