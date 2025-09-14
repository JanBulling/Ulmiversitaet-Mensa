"use client";

import { useSettings } from "@/hooks/use-settings";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/ui/tabs";
import * as React from "react";

interface PriceDisplayProps {
  student: string;
  employee: string;
  other: string;
  note?: string;
}

export default function PriceDisplay({
  student,
  employee,
  other,
  note,
}: PriceDisplayProps) {
  const [price, setPrice] = React.useState<string>();
  const { priceType } = useSettings();

  return (
    <div className="flex items-center">
      {note && <p className="text-muted-foreground mr-2 text-sm">{note}</p>}
      <Tabs
        value={price ?? priceType}
        onValueChange={setPrice}
        className="flex flex-row items-center justify-start gap-6"
      >
        <TabsContent value="STUDENT" asChild>
          <span className="shrink-0 font-mono text-xl font-bold">
            {student}€
          </span>
        </TabsContent>
        <TabsContent value="EMPLOYEE" asChild>
          <span className="shrink-0 font-mono text-xl font-bold">
            {employee}€
          </span>
        </TabsContent>
        <TabsContent value="OTHER" asChild>
          <span className="shrink-0 font-mono text-xl font-bold">{other}€</span>
        </TabsContent>
        <TabsList className="flex-1">
          <TabsTrigger value="STUDENT">Student</TabsTrigger>
          <TabsTrigger value="EMPLOYEE">Mitarbeiter</TabsTrigger>
          <TabsTrigger value="OTHER">Gast</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
