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

interface Props extends React.HTMLAttributes<HTMLFormElement> {
  mealId: string;
}

const schema = z.object({
  rating_price: z.number().min(1).max(5),
  rating_taste: z.number().min(1).max(5),
  rating_look: z.number().min(1).max(5),
  comment: z.string().max(1000).optional().nullable(),
});

type FormData = z.infer<typeof schema>;

export default function RatingsForm({ mealId, className, ...props }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [commentLength, setCommentLength] = React.useState<number>(0);
  const [alreadyRated, setAlreadyRated] = React.useState<boolean>(false);

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
    setAlreadyRated(true);
  }

  if (alreadyRated) {
    return null;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("my-4 max-w-3xl space-y-2", className)}
      {...props}
    >
      <div className="">
        <Label className="text-sm font-semibold" htmlFor="rating_taste">
          Geschmack:
        </Label>
        <RatingInput
          id="rating_taste"
          onValueChange={(val) => setValue("rating_taste", val)}
          {...register("rating_taste")}
        >
          {Array.from({ length: 5 }).map((_, idx) => (
            <RatingButton
              key={idx}
              size={24}
              className={cn(errors.rating_taste && "text-destructive")}
            />
          ))}
        </RatingInput>
        {errors.rating_taste && (
          <p className="text-destructive -mt-1 text-xs font-semibold">
            Eingabe benötigt
          </p>
        )}
      </div>

      <div className="mt-2">
        <Label className="text-sm font-semibold" htmlFor="rating_look">
          Optik:
        </Label>
        <RatingInput
          id="rating_look"
          onValueChange={(val) => setValue("rating_look", val)}
          {...register("rating_look")}
        >
          {Array.from({ length: 5 }).map((_, idx) => (
            <RatingButton
              key={idx}
              size={24}
              className={cn(errors.rating_look && "text-destructive")}
            />
          ))}
        </RatingInput>
        {errors.rating_look && (
          <p className="text-destructive -mt-1 text-xs font-semibold">
            Eingabe benötigt
          </p>
        )}
      </div>

      <div>
        <Label className="text-sm font-semibold" htmlFor="rating_price">
          Preis:
        </Label>
        <RatingInput
          id="rating_price"
          onValueChange={(val) => setValue("rating_price", val)}
          {...register("rating_price")}
        >
          {Array.from({ length: 5 }).map((_, idx) => (
            <RatingButton
              key={idx}
              size={24}
              className={cn(errors.rating_price && "text-destructive")}
            />
          ))}
        </RatingInput>
        {errors.rating_price && (
          <p className="text-destructive -mt-1 text-xs font-semibold">
            Eingabe benötigt
          </p>
        )}
      </div>

      <div>
        <Label className="text-sm font-semibold" htmlFor="rating_taste">
          Kommentar (optional)
        </Label>
        <Textarea
          {...register("comment", {
            onChange: (e) => setCommentLength(e.target.value.length),
          })}
          className="h-32"
          placeholder="Hinterlasse einen optionalen Kommentar"
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
  );
}
