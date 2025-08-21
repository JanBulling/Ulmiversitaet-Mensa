import { Table, TableBody, TableCell, TableRow } from "@/ui/table";

interface PriceProps {
  note?: string | null;
  student?: string | null;
  employee?: string | null;
  other?: string | null;
}

export default function Price({ note, student, employee, other }: PriceProps) {
  return (
    <div className="w-full py-8">
      <h2 className="text-2xl font-bold tracking-tight">Preis</h2>
      <p className="text-muted-foreground text-sm">{note}</p>

      <Table className="mt-2 w-full md:max-w-xs">
        <TableBody>
          <TableRow>
            <TableCell>Studierende</TableCell>
            <TableCell className="text-right">{student} €</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Mitarbeitende</TableCell>
            <TableCell className="text-right">{employee} €</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Sonstige / Gäste</TableCell>
            <TableCell className="text-right">{other} €</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
