import { Table, TableBody, TableCell, TableRow } from "@/ui/table";

interface NutritionalValuesProps {
  calories?: string | null;
  protein?: string | null;
  fat?: string | null;
  saturatedFat?: string | null;
  carbohydrates?: string | null;
  sugar?: string | null;
  salt?: string | null;
}

export function NutritionalValues({
  calories,
  protein,
  fat,
  saturatedFat,
  carbohydrates,
  sugar,
  salt,
}: NutritionalValuesProps) {
  return (
    <div className="w-full py-8">
      <h2 className="text-2xl font-bold tracking-tight">Nährwerte</h2>
      <p className="text-muted-foreground text-sm">pro Portion</p>

      <Table className="mt-2 w-full md:max-w-xs">
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
