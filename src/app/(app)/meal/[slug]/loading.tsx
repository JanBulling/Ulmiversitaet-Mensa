import SiteLayout from "@/components/general/site-layout";
import { Skeleton } from "@/ui/skeleton";

export default function MealLoadingPage() {
  return (
    <SiteLayout>
      <div className="my-4 grid grid-cols-1 gap-4 md:my-8 md:grid-cols-2">
        <div>
          <Skeleton className="h-12 w-md" />
          <Skeleton className="mt-2 h-6 w-32" />

          <Skeleton className="mt-2 h-40 w-full" />

          <div className="my-4 grid grid-cols-2 items-start gap-2">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
        <div>
          <div className="bg-muted text-muted-foreground flex aspect-video items-center justify-center rounded border p-4 text-center">
            Bilder können aktuell noch nicht hochgeladen werden 🥹
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
