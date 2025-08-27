import { getGuruResponse } from "@/lib/guru";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const dateQuery = searchParams.get("date");

  try {
    const guruResponse = await getGuruResponse();
    return Response.json(
      {
        message: guruResponse,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "https://ulmiversitaet.de",
        },
      },
    );
  } catch (err) {
    console.error("[GET - GURU]", err);
    return Response.json(
      {
        success: false,
        message: "Something went wrong with the Guru",
      },
      { status: 500 },
    );
  }
}
