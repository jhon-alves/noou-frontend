import { TableCell, TableRow } from "../ui/table"

export function TableRowSkeleton({ columns = 6 }: { columns?: number }) {
  return Array.from({ length: columns }).map((_, i) => (
    <TableRow key={`sk-${i}`} className="animate-pulse">
      <TableCell>
        <div className="h-6 w-40 rounded-xl bg-muted" />
      </TableCell>
      <TableCell>
        <div className="h-6 w-56 rounded-xl bg-muted" />
      </TableCell>
      <TableCell>
        <div className="h-6 w-20 rounded-xl bg-muted" />
      </TableCell>
      <TableCell>
        <div className="h-6 w-32 rounded-xl bg-muted" />
      </TableCell>
      <TableCell>
        <div className="h-6 w-40 rounded-xl bg-muted" />
      </TableCell>
      <TableCell>
        <div className="h-6 w-56 rounded-xl bg-muted" />
      </TableCell>
      <TableCell>
        <div className="h-6 w-20 rounded-xl bg-muted" />
      </TableCell>
      <TableCell>
        <div className="h-8 w-7 rounded-full bg-muted" />
      </TableCell>
    </TableRow>
  ))
}
