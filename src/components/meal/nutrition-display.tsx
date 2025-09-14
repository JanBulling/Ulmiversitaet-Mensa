import { Table, TableBody, TableCell, TableRow } from "@/ui/table";

interface NutritionDisplayProps {
  calories: string;
  protein: string;
  fat: string;
  saturatedFat: string;
  carbohydrates: string;
  sugar: string;
  salt: string;
}

export default function NutritionDisplay({
  calories,
  protein,
  fat,
  saturatedFat,
  carbohydrates,
  sugar,
  salt,
}: NutritionDisplayProps) {
  return (
    <div className="bg-card rounded border px-4 py-2 shadow">
      <h2 className="font-semibold">
        Nährwerte{" "}
        <span className="text-muted-foreground text-sm font-normal">
          (pro Portion)
        </span>
      </h2>

      <Table className="mt-1 w-full md:max-w-xs">
        <TableBody>
          <TableRow>
            <TableCell>Energie</TableCell>
            <TableCell className="text-right">{calories} kcal</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Protein</TableCell>
            <TableCell className="text-right">{protein} g</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              Fett <br /> <span className="text-xs">davon gesättigt</span>
            </TableCell>
            <TableCell className="text-right">
              {fat} g <br /> <span className="text-xs">{saturatedFat} g</span>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              Kohlenhydrate <br /> <span className="text-xs">davon Zucker</span>
            </TableCell>
            <TableCell className="text-right">
              {carbohydrates} g <br />{" "}
              <span className="text-xs">{sugar} g</span>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Salz</TableCell>
            <TableCell className="text-right">{salt} g</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
