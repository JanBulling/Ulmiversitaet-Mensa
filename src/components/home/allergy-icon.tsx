"use client";

import { cn } from "@/lib/utils";
import { Allergy } from "@/types/meal";
import { Egg, Milk, Nut, TriangleAlert, Wheat } from "lucide-react";

const allergyIconMap: Partial<Record<Allergy, React.ComponentType>> = {
  GLUTEN: Wheat,
  EIER: Egg,
  MILCH: Milk,
  WEIZEN: Wheat,
  WALLNUSS: Nut,
  PISTAZIE: Nut,
  MANDEL: Nut,
  CASHEW: Nut,
  MACADEMIA: Nut,
  PEKANUS: Nut,
};

const allergyColorMap: Partial<Record<Allergy, string>> = {
  GLUTEN: "#ff0000",
  EIER: "#00ff00",
};

const DefaultIcon = TriangleAlert;

interface AllergyIconProps {
  allergy: Allergy;
}

export function AllergyIcon({ allergy }: AllergyIconProps) {
  const Icon = allergyIconMap[allergy] ?? DefaultIcon;
  return (
    <>
      <Icon
        size={14}
        style={{ color: allergyColorMap[allergy] }}
        className={cn()}
      />
      {allergy}
    </>
  );
}
