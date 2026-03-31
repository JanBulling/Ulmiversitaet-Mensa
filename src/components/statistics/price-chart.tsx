"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/ui/charts/chart";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

const priceChartConfig = {
  price_student: {
    label: "Student",
    color: "#2563eb",
  },
  price_employee: {
    label: "Mitarbeiter",
    color: "#16a34a",
  },
} satisfies ChartConfig;

function priceToString(price: number | null) {
  if (price === null) return "n/a";
  return `${price.toFixed(2)}€`;
}

export function PriceChart({
  data,
}: {
  data: {
    date: string;
    price_student: number;
    price_employee: number;
    price_others: number;
  }[];
}) {
  return (
    <ChartContainer config={priceChartConfig} className="h-50 w-full">
      <LineChart
        accessibilityLayer
        data={data}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
          tickFormatter={(value) =>
            new Date(value).toLocaleDateString("de-DE", {
              month: "short",
              day: "numeric",
            })
          }
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              labelFormatter={(value) =>
                new Date(value).toLocaleDateString("de-DE", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })
              }
              valueFormatter={(value) => priceToString(value as number)}
            />
          }
        />
        {/* <ChartTooltip
          content={
            <ChartTooltipContent
              className="w-38"
              nameKey="price"
              labelFormatter={(value) => {
                return new Date(value).toLocaleDateString("de-DE", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
              }}
            />
          }
        /> */}
        <Line
          dataKey="price_student"
          type="step"
          stroke="var(--color-price_student)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="price_employee"
          type="step"
          stroke="var(--color-price_employee)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
}
