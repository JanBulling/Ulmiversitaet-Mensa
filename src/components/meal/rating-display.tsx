import { Label } from "@/ui/input/label";
import { Rating } from "@/ui/rating";

interface RatingDisplayProps {
  totalRating: number;
  tasteRating: number;
  lookRating: number;
  priceRating: number;
  numberRatings: number;
}

export default function RatingDisplay({
  numberRatings,
  totalRating,
  tasteRating,
  lookRating,
  priceRating,
}: RatingDisplayProps) {
  return (
    <div className="bg-card rounded border px-4 py-2 shadow">
      <h2 className="text-xl font-semibold">
        Bewertung:{" "}
        <span className="text-muted-foreground text-sm font-normal">
          (Bisher {numberRatings} Bewertungen)
        </span>
      </h2>
      <Rating
        value={totalRating ?? 0}
        size={24}
        className="my-2 text-yellow-500"
      />

      <div className="grid grid-cols-[2fr_1fr_2fr_2fr_1fr] gap-y-1">
        <Label className="font-semibold">Geschmack:</Label>
        <Rating size={16} value={tasteRating} />

        <Label className="col-start-4 font-semibold">Aussehen:</Label>
        <Rating size={16} value={lookRating} />

        <Label className="font-semibold">Preis:</Label>
        <Rating size={16} value={priceRating} />
      </div>
    </div>
  );
}
