import { Allergy } from "@/types/allergy";
import { AllergyIcon } from "../icons/allergy-icon";

interface AllergiesProps {
  allergies: Allergy[];
}

export function Allergies({ allergies }: AllergiesProps) {
  return (
    <div className="w-full py-8">
      <h2 className="text-2xl font-bold tracking-tight">Allergien</h2>
      {allergies.length === 0 && (
        <div className="my-8">
          <p className="text-sm italic">Keine Allergene in diesem Gericht</p>
        </div>
      )}

      <div className="mt-2 grid grid-cols-2 gap-y-2 md:grid-cols-4">
        {allergies.map((allergy) => (
          <AllergyIcon key={allergy} allergy={allergy} />
        ))}
      </div>
    </div>
  );
}
