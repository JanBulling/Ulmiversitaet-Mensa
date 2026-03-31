import SiteLayout from "@/components/general/site-layout";
import { PriceChart } from "@/components/statistics/price-chart";
import { getPriceStats } from "@/lib/statistics";

export default async function StatisticsPage() {
  const priceStats = await getPriceStats();

  const priceData = priceStats.map((stat) => ({
    date: stat.date.toISOString(),
    price_student: stat.avg_price_student ?? 0,
    price_employee: stat.avg_price_employee ?? 0,
    price_others: stat.avg_price_others ?? 0,
  }));

  return (
    <SiteLayout>
      <h1>Statistiken</h1>
      <p>Der Preis ist heiß...</p>

      <PriceChart data={priceData} />
    </SiteLayout>
  );
}
