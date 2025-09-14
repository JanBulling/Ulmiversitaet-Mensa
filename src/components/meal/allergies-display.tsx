import { Allergy } from "@/types/allergy";
import { AllergyIcon } from "../icons/allergy-icon";

interface AllergiesDisplayProps {
  allergies: Allergy[];
}

export default function AllergiesDisplay({ allergies }: AllergiesDisplayProps) {
  return (
    <div className="bg-card rounded border px-4 py-2 shadow">
      <h2 className="font-semibold">Allergien</h2>

      <div className="mt-2 space-y-1">
        {allergies.map((allergy) => (
          <AllergyIcon key={allergy} allergy={allergy} />
        ))}
      </div>
    </div>
  );
}
