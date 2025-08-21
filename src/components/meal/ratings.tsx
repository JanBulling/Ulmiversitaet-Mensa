import { db } from "@/lib/db/db";
import { ratingsTable } from "@/lib/db/schema";
import { Label } from "@/ui/input/label";
import { Rating } from "@/ui/rating";
import { and, desc, eq, isNotNull, ne } from "drizzle-orm";
import RatingsForm from "./rating-form";

interface ReviewProps {
  mealId: string;
  totalRating?: number | null;
  tasteRating?: number | null;
  lookRating?: number | null;
  priceRating?: number | null;
  numberRatings?: number | null;
}

export default async function Ratings({
  mealId,
  numberRatings,
  totalRating,
  tasteRating,
  lookRating,
  priceRating,
}: ReviewProps) {
  const comments = await db
    .select()
    .from(ratingsTable)
    .where(
      and(
        eq(ratingsTable.meal_id, mealId),
        isNotNull(ratingsTable.text),
        ne(ratingsTable.text, ""),
      ),
    )
    .orderBy(desc(ratingsTable.created_at))
    .limit(50);

  const dateFormatter = Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="w-full py-8 md:grid md:grid-cols-12 md:gap-x-8">
      <div className="lg:col-span-4">
        <h2 className="text-2xl font-bold tracking-tight">Bewertungen</h2>
        <Rating
          value={totalRating ?? 0}
          size={24}
          className="mt-2 text-yellow-500"
        />
        <p className="text-muted-foreground text-sm">
          Insgesamt {numberRatings ?? "0"} Bewertungen
        </p>

        <div className="mt-4 max-w-fit space-y-2">
          <div className="flex items-center justify-end gap-2">
            <Label>Geschmack:</Label>
            <Rating size={16} value={tasteRating ?? 0} />
          </div>
          <div className="flex items-center justify-end gap-2">
            <Label>Optik:</Label>
            <Rating size={16} value={lookRating ?? 0} />
          </div>
          <div className="flex items-center justify-end gap-2">
            <Label>Preis:</Label>
            <Rating size={16} value={priceRating ?? 0} />
          </div>
        </div>

        <div className="mt-8 w-full">
          <h3 className="text-lg font-medium">Deine Meinung ist gefragt!</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            Falls du dieses Gericht gegessen hast, teile bitte deine Meinung
            dazu für andere Studenten.
          </p>

          <RatingsForm mealId={mealId} />
        </div>
      </div>

      <div className="mt-16 lg:col-span-7 lg:col-start-6 lg:mt-0">
        <h2 className="text-2xl font-bold tracking-tight">Kommentare</h2>

        <div className="divide-muted-foreground -my-2 divide-y">
          {comments.length === 0 && (
            <div className="my-8">
              <p className="text-sm italic">
                Noch keine Kommentare zu diesem Gericht
              </p>
            </div>
          )}
          {comments.map((comment) => (
            <div key={comment.id} className="py-8">
              <div className="flex items-center justify-between">
                <Rating value={comment.rating_total} size={16} />
                <p className="text-muted-foreground text-sm">
                  {dateFormatter.format(comment.created_at)}
                </p>
              </div>
              <p className="text-muted-foreground mt-1 text-base">
                {comment.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
