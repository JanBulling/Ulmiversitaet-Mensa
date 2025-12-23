import SiteLayout from "@/components/general/site-layout";
import { getTop10Meals } from "@/lib/top-meals";
import { cn } from "@/lib/utils";
import { Rating } from "@/ui/rating";
import { StarIcon } from "lucide-react";
import Link from "next/link";

export const revalidate = 21600;
export const dynamic = "force-static";

export default async function BestMealPage() {
  const bestMeals = await getTop10Meals();

  return (
    <SiteLayout>
      <h1 className="mt-8 text-2xl font-bold md:text-3xl">
        Die{" "}
        <span className="text-primary px-2 font-mono text-4xl font-black uppercase">
          TOP 10
        </span>{" "}
        der Mensa
      </h1>
      <p>Die besten Gerichte, welche die Mensa der Uni Ulm zu bieten hat!</p>

      <ol className="my-4 divide-y">
        {bestMeals.map((m, idx) => (
          <Link key={m.id} href={`/meal/${m.slug}`}>
            <li
              className={cn(
                "flex gap-4 p-4",
                idx === 0 && "bg-warning/10",
                idx === 1 && "bg-success/10",
                idx === 2 && "bg-info/10",
              )}
            >
              <h2
                className={cn(
                  "text-primary self-center font-mono text-4xl font-bold",
                  idx === 0 && "text-warning",
                  idx === 1 && "text-success",
                  idx === 2 && "text-info",
                )}
              >
                {idx + 1}
              </h2>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{m.name}</h3>
                <p>{m.category}</p>
              </div>

              <Rating
                value={m.rating_total!}
                numberRatings={m.num_ratings!}
                icon={<StarIcon className="text-yellow-400" />}
              />
            </li>
          </Link>
        ))}
      </ol>
    </SiteLayout>
  );
}
