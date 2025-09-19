"use client";

import * as React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Label } from "@/ui/input/label";
import { RatingButton, RatingInput } from "@/ui/input/rating-input";
import { Button } from "@/ui/button";
import { Textarea } from "@/ui/input/textarea";
import { useRouter } from "next/navigation";
import { useStorage } from "@/hooks/use-storage";

interface Props {
  mealId: string;
  slug: string;
  mealDate?: Date;
  className?: string;
}

const schema = z.object({
  rating_price: z.number().min(1).max(5),
  rating_taste: z.number().min(1).max(5),
  rating_look: z.number().min(1).max(5),
  comment: z.string().max(1000).optional().nullable(),
});

type FormData = z.infer<typeof schema>;

function mealRatingPossible(mealLastServed?: Date): {
  ratable: boolean;
  message?: string;
} {
  const now = new Date();

  const isFuture = !mealLastServed || mealLastServed > now;
  if (isFuture)
    return {
      ratable: false,
      message: "Zukünftige Gerichte können noch nicht bewertet werden!",
    };

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  const isInPast = yesterday >= mealLastServed;
  if (isInPast)
    return {
      ratable: false,
      message: "Gericht liegt zu weit in der Vergangenheit",
    };

  const elevenThirty = new Date();
  elevenThirty.setHours(11, 30, 0, 0);

  if (now < elevenThirty)
    return {
      ratable: false,
      message: "Gerichte können nicht vor 11:30 Uhr bewertet werden!",
    };

  return { ratable: true };
}

export default function RatingForm({
  mealId,
  slug,
  mealDate,
  className,
}: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [commentLength, setCommentLength] = React.useState<number>(0);
  const [alreadyRated, setAlreadyRated] = useStorage<string[]>("ratings", []);

  const ratingTimeWindowOpen = mealRatingPossible(mealDate);

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);

    const response = await fetch("/api/v1/rating", {
      method: "POST",
      body: JSON.stringify({ id: mealId, ...data }),
    });

    setIsLoading(false);

    if (!response.ok) {
      setError("root", {});
      return;
    }
    router.refresh();
    setAlreadyRated([...alreadyRated, slug]);
  }

  if (alreadyRated.includes(slug)) {
    return (
      <div className={cn("bg-card rounded border px-4 py-8 shadow", className)}>
        <p className="text-muted-foreground text-center text-sm">
          Du hast dieses Gericht bereits bewertet
        </p>
      </div>
    );
  }

  if (!ratingTimeWindowOpen.ratable) {
    return (
      <div className="bg-card rounded border px-2 py-8 shadow md:px-4">
        <p className="text-muted-foreground text-center text-sm">
          {ratingTimeWindowOpen.message}
        </p>
      </div>
    );
  }

  return (
    <div className={cn("bg-card rounded border px-4 py-4 shadow", className)}>
      <form onSubmit={handleSubmit(onSubmit)} className="pace-y-2">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label className="text-sm font-semibold">Geschmack</Label>
            <RatingInput
              id="rating_taste"
              onValueChange={(val) => setValue("rating_taste", val)}
              {...register("rating_taste")}
            >
              {Array.from({ length: 5 }).map((_, idx) => (
                <RatingButton
                  key={idx}
                  size={16}
                  className={cn(errors.rating_taste && "text-destructive")}
                />
              ))}
            </RatingInput>
          </div>

          <div>
            <Label className="text-sm font-semibold">Optik</Label>
            <RatingInput
              id="rating_look"
              onValueChange={(val) => setValue("rating_look", val)}
              {...register("rating_look")}
            >
              {Array.from({ length: 5 }).map((_, idx) => (
                <RatingButton
                  key={idx}
                  size={16}
                  className={cn(errors.rating_taste && "text-destructive")}
                />
              ))}
            </RatingInput>
          </div>

          <div>
            <Label className="text-sm font-semibold">Preis</Label>
            <RatingInput
              id="rating_price"
              onValueChange={(val) => setValue("rating_price", val)}
              {...register("rating_price")}
            >
              {Array.from({ length: 5 }).map((_, idx) => (
                <RatingButton
                  key={idx}
                  size={16}
                  className={cn(errors.rating_taste && "text-destructive")}
                />
              ))}
            </RatingInput>
          </div>
        </div>

        <div className="mt-2">
          <Label className="text-sm font-semibold" htmlFor="rating_taste">
            Kommentar{" "}
            <span className="text-muted-foreground font-normal">
              (optional)
            </span>
          </Label>
          <Textarea
            {...register("comment", {
              onChange: (e) => setCommentLength(e.target.value.length),
            })}
            className="h-32"
            placeholder="Hinterlasse einen Kommentar"
          />
          <p className="text-muted-foreground text-xs">{commentLength}/1000</p>
        </div>

        <Button
          type="submit"
          loading={isLoading}
          className={cn("bg-card w-full cursor-pointer")}
          variant="outline"
        >
          Bewerten
        </Button>
      </form>
    </div>
  );
}
