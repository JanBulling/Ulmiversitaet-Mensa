"use client";

import { capitalize, cn } from "@/lib/utils";
import { Allergy } from "@/types/allergy";
import { Egg, Fish, Milk, Nut, TriangleAlert, Wheat } from "lucide-react";

const allergyIconMap: Partial<Record<Allergy, React.ComponentType>> = {
  GLUTEN: Wheat,
  EIER: Egg,
  MILCH: Milk,
  WEIZEN: Wheat,
  ROGGEN: Wheat,
  DINKEL: Wheat,
  HAFER: Wheat,
  WALLNUSS: Nut,
  PISTAZIE: Nut,
  MANDEL: Nut,
  CASHEW: Nut,
  MACADEMIA: Nut,
  PEKANUS: Nut,
  ERDNÜSSE: Nut,
  FISCH: Fish,
};

const DefaultIcon = TriangleAlert;

interface AllergyIconProps {
  allergy: Allergy;
}

export function AllergyIcon({ allergy }: AllergyIconProps) {
  const Icon = allergyIconMap[allergy] ?? DefaultIcon;

  return (
    <div className="flex items-center gap-2">
      <div className="bg-primary text-primary-foreground rounded-full p-1">
        <Icon size={14} className={cn()} />
      </div>
      <p className="text-primary text-sm font-semibold">
        {capitalize(allergy)}
      </p>
    </div>
  );
}
