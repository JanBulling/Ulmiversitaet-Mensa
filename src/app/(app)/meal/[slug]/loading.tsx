import SiteLayout from "@/components/general/site-layout";
import { Skeleton } from "@/ui/Skeleton";

export default function MealLoadingPage() {
  return (
    <SiteLayout className="my-4">
      <Skeleton className="h-12 w-md" />
      <Skeleton className="mt-2 h-6 w-32" />

      <div className="mt-16 gap-8 md:grid md:grid-cols-2">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    </SiteLayout>
  );
}
